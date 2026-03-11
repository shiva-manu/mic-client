import Hero from '@/components/Hero';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Home = () => {
    return (
        <div className="flex flex-col">
            <Hero />

            {/* Featured Section */}
            <section className="py-20 border-y border-primary/10 bg-muted/10 overflow-hidden">
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } },
                            hidden: {}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-16"
                    >
                        {[
                            { title: "Eco-AI", color: "text-primary", bg: "bg-primary/20", icon: "https://cdn-icons-png.flaticon.com/512/2913/2913520.png", desc: "Developing energy-efficient algorithms inspired by biological resource management.", link: "/advisory", linkText: "Learn More" },
                            { title: "Biology", color: "text-secondary", bg: "bg-secondary/20", icon: "https://cdn-icons-png.flaticon.com/512/3067/3067185.png", desc: "A community exploring neural inspiration and biomimetic interface engineering.", link: "/board", linkText: "The Board" },
                            { title: "Systems", color: "text-primary", bg: "bg-primary/20", icon: "https://cdn-icons-png.flaticon.com/512/900/900618.png", desc: "Building the next generation of robust, adaptive Machine Intelligence frameworks.", link: "/events", linkText: "View Events" }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="space-y-6 group"
                            >
                                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-black/5", card.bg, i === 1 ? "group-hover:bg-secondary" : "group-hover:bg-primary")}>
                                    <img src={card.icon} alt={card.title} className="h-full w-full grayscale group-hover:grayscale-0 transition-all brightness-0 dark:invert" />
                                </div>
                                <h3 className={cn("text-2xl font-black uppercase tracking-tight", card.color)}>{card.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-medium text-sm">
                                    {card.desc}
                                </p>
                                <Link to={card.link} className={cn("inline-flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] group-hover:gap-4 transition-all duration-300", card.color)}>
                                    {card.linkText} <ArrowRight className="h-3 w-3" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Home;
