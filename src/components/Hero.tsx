import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import AgentModel from "@/components/AgentModel";

/* ── Typewriter ── */
const useTypewriter = (words: string[], typingSpeed = 80, deletingSpeed = 40, pause = 2500) => {
    const [text, setText] = useState("");
    const [wordIdx, setWordIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[wordIdx];
        const timeout = setTimeout(() => {
            if (!deleting) {
                setText(word.slice(0, text.length + 1));
                if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), pause);
            } else {
                setText(word.slice(0, text.length - 1));
                if (text.length - 1 === 0) { setDeleting(false); setWordIdx((i) => (i + 1) % words.length); }
            }
        }, deleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timeout);
    }, [text, deleting, wordIdx, words, typingSpeed, deletingSpeed, pause]);

    return text;
};

/* ── Marquee logos ── */
const partners = ["TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "Google Cloud", "IEEE", "SNIST"];
const Marquee = () => (
    <div className="relative overflow-hidden py-6 border-t border-border/50">
        <div className="flex animate-[scroll_20s_linear_infinite] gap-16 whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
                <span key={i} className="text-sm text-muted-foreground/50 font-medium tracking-wide uppercase">{p}</span>
            ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
);

/* ── Hero ── */
const Hero = () => {
    const typed = useTypewriter(["Intelligence", "Innovation", "Impact"]);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            {/* Spotlight */}
            <div className="spotlight top-[-20%] left-1/2 -translate-x-1/2" />

            <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors mb-8 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Eco-ML Hackathon is live
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
                >
                    Machine{" "}
                    <span className="text-primary">{typed}</span>
                    <span className="text-primary animate-pulse">|</span>
                    <br />Club
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
                >
                    Where biology meets computation. We build adaptive systems,
                    run research-driven hackathons, and push the boundaries of AI.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 text-sm font-medium shadow-lg shadow-primary/20">
                        Explore Events <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-xl h-11 px-6 text-sm font-medium border-border/60 text-muted-foreground hover:text-foreground">
                        Join the Club
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center gap-12 mt-16 text-center"
                >
                    {[
                        { value: "500+", label: "Members" },
                        { value: "30+", label: "Projects" },
                        { value: "2024", label: "Founded" },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            <Marquee />
            <AgentModel />
        </section>
    );
};

export default Hero;
