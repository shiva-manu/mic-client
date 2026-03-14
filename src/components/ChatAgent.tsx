import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am MIC AI. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // Add a placeholder assistant message for streaming
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        let buffer = '';
        let displayedContent = '';
        let isDone = false;

        const interval = setInterval(() => {
            if (buffer.length > 0) {
                // Smoothly drain the buffer (1-2 chars normally, up to 5 if far behind)
                const charsToTake = Math.min(buffer.length, buffer.length > 50 ? 5 : 1);
                displayedContent += buffer.slice(0, charsToTake);
                buffer = buffer.slice(charsToTake);

                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = displayedContent;
                    return updated;
                });
            } else if (isDone) {
                clearInterval(interval);
                setLoading(false);
            }
        }, 35);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!response.ok) throw new Error('Failed to connect');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader');

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    isDone = true;
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            isDone = true;
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                // Filter out stubborn HTML tags and replace tabs with spaces
                                const cleanContent = parsed.content
                                    .replace(/<br\s*\/?>/gi, '\n')
                                    .replace(/\t/g, '  ');
                                buffer += cleanContent;
                            }
                        } catch (e) {
                            console.error('Error parsing stream chunk', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            isDone = true;
            displayedContent = 'Could not connect to AI service.';
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = displayedContent;
                return updated;
            });
        }
    };

    return (
        <>
            {/* Float Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] flex items-center justify-center z-[100]",
                    isOpen && "hidden"
                )}
            >
                <div className="relative">
                    <MessageSquare className="w-6 h-6" />
                    <div className="absolute -top-3 -right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-lg" />
                </div>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed z-[100] flex flex-col overflow-hidden",
                            "bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6",
                            "w-auto sm:w-[400px] h-[500px] sm:h-[600px] max-h-[85vh] sm:max-h-[700px]",
                            "bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.03]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Bot className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">MIC Intelligence</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] text-emerald-500/80 uppercase font-black tracking-widest">Active System</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 rounded-2xl w-10 h-10 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-transparent to-primary/[0.02]"
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex flex-col max-w-[90%] sm:max-w-[85%] space-y-2",
                                        m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-4 py-3 rounded-[1.25rem] text-sm sm:text-[15px] leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20 font-medium"
                                                : "bg-white/[0.05] text-white/90 rounded-tl-none border border-white/5 backdrop-blur-sm"
                                        )}
                                    >
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-primary-foreground prose-a:text-primary">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {m.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 px-1">
                                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">
                                            {m.role === 'user' ? 'Inquiry' : 'Response'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {loading && messages[messages.length - 1].content === '' && (
                                <div className="flex items-start mr-auto">
                                    <div className="bg-white/[0.05] p-4 rounded-2xl rounded-tl-none border border-white/5">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 sm:p-6 bg-black border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-3 relative group"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Message MIC AI..."
                                    className="bg-white/[0.03] border-white/10 rounded-2xl h-12 sm:h-14 text-sm sm:text-base focus:ring-primary/40 focus:border-primary/40 focus:bg-white/[0.05] transition-all px-5 pr-14"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-1.5 top-1.5 sm:top-2 sm:right-2 h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 flex items-center justify-center transition-transform active:scale-95"
                                >
                                    <Send className="w-4 h-4 sm:w-5 h-5" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-center text-white/20 mt-3 uppercase tracking-tighter font-bold">
                                Experimental Neural-Link Interface
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
