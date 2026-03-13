import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import type { Easing } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const DiscordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
);

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as Easing } })
};

import { Skeleton } from "@/components/ui/skeleton";

const BoardMemberSkeleton = () => (
    <div className="group w-full max-w-[400px] h-[400px] relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 flex flex-col items-center justify-between">
        <Skeleton className="w-[280px] h-[280px] rounded-3xl bg-white/5" />
        <div className="w-full flex items-center justify-between px-3 mt-4">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32 bg-white/5" />
                <Skeleton className="h-3 w-20 bg-white/5" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-2xl bg-white/5" />
                <Skeleton className="h-10 w-10 rounded-2xl bg-white/5" />
            </div>
        </div>
    </div>
);

const BoardMembers = () => {
    const [boardMembers, setBoardMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await api.getBoardMembers();
                setBoardMembers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch board members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <BoardMemberSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (boardMembers.length === 0) {
        return (
            <div className="flex justify-center items-center py-32">
                <p className="text-muted-foreground">No board members found.</p>
            </div>
        );
    }

    return (
        <section className="py-20 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
                >
                    {boardMembers.map((m, i) => (
                        <motion.div
                            key={m.id || i}
                            custom={i}
                            variants={fadeUp}
                            className="group w-full max-w-[400px] h-[400px] relative rounded-[2.5rem] border border-white/10 bg-black p-6 flex flex-col items-center justify-between transition-all duration-500 hover:border-primary/40 shadow-2xl shadow-black/10 hover:shadow-primary/10"
                        >
                            {/* Interactive Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            {/* Member Image Section: 280x280 */}
                            <div className="w-[280px] h-[280px] rounded-3xl overflow-hidden relative z-10 border border-white/5 shadow-inner bg-muted/20">
                                <img
                                    src={m.image}
                                    alt={m.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content Area */}
                            <div className="w-full flex items-center justify-between px-3 mt-4 relative z-10">
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="font-bold text-xl tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
                                        {m.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-70">
                                        {m.role}
                                    </p>
                                </div>

                                {/* Social Connections */}
                                <div className="flex items-center gap-2.5">
                                    {m.github && (
                                        <a
                                            href={m.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg border border-border/50"
                                            title={`${m.name} on GitHub`}
                                        >
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {m.linkedin && (
                                        <a
                                            href={m.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg border border-border/50"
                                            title={`${m.name} on LinkedIn`}
                                        >
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {m.discord && (
                                        <a
                                            href={m.discord}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-2xl bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg border border-border/50"
                                            title={`${m.name} on Discord`}
                                        >
                                            <DiscordIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default BoardMembers;
