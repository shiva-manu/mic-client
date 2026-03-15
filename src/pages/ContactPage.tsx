import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Loader2, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollnumber: '',
        phone: '',
        email: ''
    });

    const [isTyping, setIsTyping] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Typing effect detector
    useEffect(() => {
        const hasValues = Object.values(formData).some(val => val.length > 0);
        if (hasValues) {
            setIsTyping(true);
            const timeout = setTimeout(() => setIsTyping(false), 1200);
            return () => clearTimeout(timeout);
        }
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // fake simulate api
        await new Promise(r => setTimeout(r, 2000));
        setSubmitting(false);
        setSuccess(true);
        setFormData({ name: '', rollnumber: '', phone: '', email: '' });
        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center font-mono relative overflow-hidden bg-[#0a0a0a]">
            {/* Rust themed grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ce412b10_1px,transparent_1px),linear-gradient(to_bottom,#ce412b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="bg-[#151515] border border-[#ce412b]/30 rounded-lg p-1 shadow-2xl shadow-[#ce412b]/10">
                    <div className="bg-[#111] rounded-md overflow-hidden">

                        {/* Terminal Header */}
                        <div className="bg-[#151515] px-4 py-3 border-b border-[#ce412b]/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-[#ce412b]" />
                                <span className="text-[11px] text-[#ce412b] font-bold tracking-[0.2em] uppercase">Contact_Module.rs</span>
                            </div>
                            <div className="flex gap-1.5 opacity-60">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="bg-[#ce412b]/5 px-4 py-2 text-[11px] text-[#ce412b]/70 flex items-center gap-2 border-b border-[#ce412b]/10 font-bold tracking-wide">
                            <Cpu className="w-3.5 h-3.5" />
                            {isTyping ? (
                                <span className="flex items-center gap-2 text-[#ce412b]">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling input_
                                </span>
                            ) : submitting ? (
                                <span className="flex items-center gap-2 text-[#ce412b]">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Executing memory safe push_
                                </span>
                            ) : success ? (
                                <span className="text-green-500">Process exited with code 0 (Success)</span>
                            ) : (
                                <span>Awaiting user input_</span>
                            )}
                        </div>

                        {/* Form */}
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="text-[#ce412b]">fn</span> get_name() -&gt; String
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="font-mono bg-[#151515] border-[#ce412b]/20 focus-visible:ring-[#ce412b]/40 focus-visible:border-[#ce412b] rounded text-white h-11"
                                        placeholder='"John Doe"'
                                    />
                                </div>

                                {/* Roll Number */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground flex items-center gap-2 mt-4">
                                        <span className="text-[#ce412b]">let</span> roll_number: <span className="text-blue-400">u32</span>
                                    </label>
                                    <Input
                                        required
                                        value={formData.rollnumber}
                                        onChange={e => setFormData({ ...formData, rollnumber: e.target.value })}
                                        className="font-mono bg-[#151515] border-[#ce412b]/20 focus-visible:ring-[#ce412b]/40 focus-visible:border-[#ce412b] rounded text-white h-11"
                                        placeholder='"21X..."'
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground flex items-center gap-2 mt-4">
                                        <span className="text-[#ce412b]">let mut</span> phone: <span className="text-blue-400">String</span>
                                    </label>
                                    <Input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="font-mono bg-[#151515] border-[#ce412b]/20 focus-visible:ring-[#ce412b]/40 focus-visible:border-[#ce412b] rounded text-white h-11"
                                        placeholder='"9876543210"'
                                    />
                                </div>

                                {/* College Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground flex items-center gap-2 mt-4">
                                        <span className="text-[#ce412b]">pub</span> email: Option&lt;<span className="text-blue-400">CollegeEmail</span>&gt;
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="font-mono bg-[#151515] border-[#ce412b]/20 focus-visible:ring-[#ce412b]/40 focus-visible:border-[#ce412b] rounded text-white h-11"
                                        placeholder='"student@snist.edu.in"'
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-6 bg-[#ce412b] hover:bg-[#a6301e] text-white font-mono rounded-lg h-12 tracking-[0.1em] text-[13px] font-bold transition-all relative overflow-hidden group border border-[#ce412b]"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="flex items-center justify-center gap-2 relative z-10 uppercase">
                                        {submitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Cargo Build --release</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Cargo Run</>
                                        )}
                                    </span>
                                </Button>

                                <AnimatePresence>
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-green-500 text-xs text-center pt-3 font-bold"
                                        >
                                            [Ok] Request compiled and transmitted successfully!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;
