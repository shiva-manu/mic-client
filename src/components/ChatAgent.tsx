import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Updated api call structure
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Could not connect to AI service.' }]);
        } finally {
            setLoading(false);
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
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center z-50",
                    isOpen && "hidden"
                )}
            >
                <MessageSquare className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">MIC AI Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/5 rounded-xl">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex flex-col max-w-[80%] space-y-1",
                                        m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10"
                                                : "bg-white/5 text-foreground/90 rounded-tl-none border border-white/5 shadow-inner"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter opacity-50">
                                        {m.role === 'user' ? 'You' : 'Assistant'}
                                    </span>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start mr-auto">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="bg-white/5 border-white/10 rounded-xl h-10 text-xs focus:ring-primary/50"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="h-10 w-10 p-0 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
