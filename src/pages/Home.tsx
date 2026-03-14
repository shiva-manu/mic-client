import Hero from '@/components/Hero';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Brain, Network, Calendar, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatAgent from '@/components/ChatAgent';

import type { Easing } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as Easing }
    })
};

const features = [
    { icon: Leaf, title: "Eco-AI", desc: "Energy-efficient algorithms inspired by nature.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Brain, title: "Neural Systems", desc: "Biologically inspired neural architectures.", color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: Network, title: "Adaptive ML", desc: "Robust, self-improving machine learning.", color: "text-blue-400", bg: "bg-blue-500/10" },
];

const bento = [
    {
        title: "Upcoming Events",
        desc: "Hackathons, workshops, and symposiums pushing the frontier of AI research.",
        icon: Calendar, link: "/events", span: "md:col-span-2",
        img: "/images/event1.png"
    },
    {
        title: "Our Team",
        desc: "Led by passionate students and guided by experienced faculty advisors.",
        icon: Users, link: "/board", span: "md:col-span-1",
        img: "/images/board.png"
    },
    {
        title: "Research Focus",
        desc: "Sustainable AI, biomimetic computing, and adaptive neural systems.",
        icon: Sparkles, link: "/advisory", span: "md:col-span-1",
        img: "/images/advisor.png"
    },
    {
        title: "Event Archive",
        desc: "Browse our history of technical milestones and community achievements.",
        icon: Calendar, link: "/completed-events", span: "md:col-span-2",
        img: "/images/event2.png"
    },
];

const Home = () => {
    return (
        <div className="bg-transparent text-white">
            <Hero />

            {/* Features */}
            <section className="relative py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="grid sm:grid-cols-3 gap-4"
                    >
                        {features.map((f, i) => (
                            <motion.div key={i} custom={i} variants={fadeUp} className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-border hover:bg-card transition-all duration-300">
                                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                                    <f.icon className={`w-5 h-5 ${f.color}`} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid */}
            <section className="relative pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-10"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Explore <span className="text-primary">MIC</span>
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm max-w-md">Dive into our community, events, and research initiatives.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="grid md:grid-cols-3 gap-4"
                    >
                        {bento.map((b, i) => (
                            <motion.div key={i} custom={i} variants={fadeUp} className={b.span}>
                                <Link
                                    to={b.link}
                                    className="group relative block rounded-2xl border border-border/50 bg-card/50 overflow-hidden hover:border-border hover:bg-card transition-all duration-300 h-full"
                                >
                                    {/* Image */}
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={b.img} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <b.icon className="w-4 h-4 text-primary" />
                                            <h3 className="font-semibold text-sm">{b.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                            View <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            <ChatAgent />
        </div>
    );
};

export default Home;
