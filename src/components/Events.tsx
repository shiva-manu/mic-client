import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Easing } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as Easing } })
};

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.getEvents();
                // Filter only live and upcoming for this component
                const filtered = Array.isArray(data) ? data.filter((e: any) => e.status !== 'COMPLETED') : [];
                setEvents(filtered);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Events</h3>
                <p className="text-muted-foreground max-w-xs">Check back later or visit the archive to see what we've been up to.</p>
            </div>
        );
    }

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative border-l border-border/50 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
                    {events.map((event, idx) => (
                        <motion.div
                            key={event.id || idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={fadeUp}
                            custom={idx}
                            className="relative"
                        >
                            {/* Timeline Dot */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.1 + 0.3, duration: 0.4 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "absolute -left-[45px] md:-left-[61px] top-8 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center",
                                    event.status === 'LIVE' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-primary/50"
                                )}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-background" />
                            </motion.div>

                            <div className="group rounded-2xl border border-border/50 bg-card/50 overflow-hidden hover:border-border hover:bg-card transition-all duration-300">
                                <div className="grid md:grid-cols-5 gap-0">
                                    {/* Image */}
                                    <div className="md:col-span-2 h-48 md:h-auto relative overflow-hidden">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden md:block" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:hidden" />
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border uppercase tracking-wider",
                                                event.status === 'LIVE'
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-secondary text-muted-foreground border-border/50"
                                            )}>
                                                {event.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                                {event.status}
                                            </span>
                                            {event.tags && event.tags.map((t: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary/80 border border-primary/10">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{event.description}</p>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-5">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                                        </div>

                                        <div>
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-8 px-4 text-xs font-medium gap-1.5">
                                                {event.status === 'LIVE' ? 'Join Now' : 'Register'} <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;

