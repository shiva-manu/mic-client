import { motion } from "framer-motion";
import { MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Easing } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as Easing } })
};

const CompletedEventSkeleton = () => (
    <div className="relative">
        <div className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-[3px] border-background flex items-center justify-center bg-white/5">
            <div className="w-1 h-1 rounded-full bg-background/50" />
        </div>
        <div className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
                <Skeleton className="md:col-span-2 h-40 md:h-[200px] bg-white/5 rounded-none" />
                <div className="md:col-span-3 p-6 flex flex-col justify-center space-y-3">
                    <Skeleton className="h-4 w-20 rounded-full bg-white/5" />
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-12 w-full bg-white/5" />
                    <div className="flex gap-4">
                        <Skeleton className="h-3 w-20 bg-white/5" />
                        <Skeleton className="h-3 w-20 bg-white/5" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CompletedEventsPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.getEvents();
                const filtered = Array.isArray(data) ? data.filter((e: any) => e.status === 'COMPLETED') : [];
                setEvents(filtered);
            } catch (error) {
                console.error("Failed to fetch completed events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="pt-28 pb-16 min-h-screen grain">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Past Events</p>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">Archive</h1>
                    <p className="text-muted-foreground max-w-lg">
                        A look back at our technical milestones and community gatherings.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="relative border-l border-white/5 ml-4 md:ml-8 pl-8 md:pl-12 space-y-8">
                        {[1, 2, 3].map((i) => (
                            <CompletedEventSkeleton key={i} />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-border/50 rounded-3xl bg-card/20">
                        <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">The archive is currently empty.</p>
                    </div>
                ) : (
                    <div className="relative border-l border-border/50 ml-4 md:ml-8 pl-8 md:pl-12 space-y-8">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event.id || idx}
                                custom={idx}
                                variants={fadeUp}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-[3px] border-background flex items-center justify-center bg-muted-foreground/30"
                                >
                                    <div className="w-1 h-1 rounded-full bg-background" />
                                </motion.div>

                                <div className="group rounded-2xl border border-border/50 bg-card/30 overflow-hidden hover:border-border hover:bg-card/60 transition-all duration-300">
                                    <div className="grid md:grid-cols-5 gap-0">
                                        <div className="md:col-span-2 h-40 md:h-auto relative overflow-hidden">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden md:block" />
                                        </div>
                                        <div className="md:col-span-3 p-6 flex flex-col justify-center">
                                            <span className="inline-block w-fit px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-muted-foreground border border-border/50 mb-3">
                                                Completed
                                            </span>
                                            <h3 className="font-semibold text-lg text-foreground/70 group-hover:text-foreground transition-colors mb-1">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>
                                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedEventsPage;

