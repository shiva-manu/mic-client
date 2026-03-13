import { motion } from "framer-motion";
import { Github, Linkedin, MessageSquare, Quote, Sparkles } from "lucide-react";
import type { Easing } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98] as unknown as Easing
        }
    })
};

const AdvisorySkeleton = () => (
    <div className="w-full h-[500px] rounded-[3rem] border border-white/5 bg-white/[0.01] p-8 flex flex-col gap-6">
        <Skeleton className="w-full h-2/3 rounded-2xl bg-white/5" />
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-2/3 bg-white/5" />
        </div>
    </div>
);

const AdvisorCard = ({ advisor, index }: { advisor: any; index: number }) => {
    return (
        <motion.div
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative flex flex-col h-[520px] rounded-[3rem] bg-[#0d0d0d] border border-white/10 overflow-hidden transition-all duration-700 hover:border-primary/50"
        >
            {/* Image Section - Takes most of the card */}
            <div className="relative h-3/5 w-full overflow-hidden">
                <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Floating Meta Info */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                    <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Senior Advisor
                    </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-90" />
            </div>

            {/* Content Section */}
            <div className="relative flex-1 p-8 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                        {advisor.name}
                    </h3>
                    <p className="text-primary/70 text-xs font-mono uppercase tracking-[0.2em] mt-1">
                        {advisor.role.split(' - ')[0]}
                    </p>
                </div>

                <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-2 -left-3 w-8 h-8 text-white/5 -z-10" />
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 italic">
                        "Pioneering the intersection of intelligence and community coordination through strategic academic guidance."
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex gap-3">
                        {advisor.linkedin && (
                            <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                        {advisor.github && (
                            <a href={advisor.github} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    <button className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest group/btn">
                        Contact
                        <MessageSquare className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>

            {/* Subtle Hover Reveal Border */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-[3rem] transition-all duration-700 pointer-events-none" />
        </motion.div>
    );
};

const Advisory = () => {
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const data = await api.getAdvisory();
                setAdvisors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch advisors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdvisors();
    }, []);

    return (
        <section className="py-24 relative z-10 bg-transparent">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid lg:grid-cols-[450px_1fr] gap-20">

                    {/* Sticky Sidebar Header */}
                    <div className="lg:sticky lg:top-32 h-fit space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                                Leadership Board
                            </span>
                            <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                                Academic <br />
                                <span className="text-primary">Eminence.</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                                Our advisory panel consists of industry pioneers and academic visionaries dedicated to steering our club's technical and ethical standards.
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {[
                                { label: "Establishment", value: "2024", subtitle: "Founded on excellence" },
                                { label: "Global Presence", value: "Panelist Network", subtitle: "Across top universities" },
                                { label: "Core Values", value: "Integrity & AI", subtitle: "Guiding principles" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex items-center gap-6 group"
                                >
                                    <div className="w-12 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                                    <div>
                                        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.subtitle}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>


                    </div>

                    {/* Main Grid Content */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                <>
                                    <AdvisorySkeleton />
                                    <AdvisorySkeleton />
                                    <AdvisorySkeleton />
                                    <AdvisorySkeleton />
                                </>
                            ) : advisors.length === 0 ? (
                                <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                                    <p className="text-muted-foreground italic font-serif">Curating the finest minds for our panel...</p>
                                </div>
                            ) : (
                                advisors.map((advisor, i) => (
                                    <AdvisorCard key={advisor.id || i} advisor={advisor} index={i} />
                                ))
                            )}
                        </div>


                    </div>

                </div>
            </div>
        </section>
    );
};

export default Advisory;
