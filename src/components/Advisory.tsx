import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const advisors = [
    {
        name: "Dr. Robert Wilson",
        position: "Senior Faculty Advisor",
        specialization: "Bio-Computational Systems",
        image: "/images/advisor.png"
    },
    {
        name: "Prof. Maria Garcia",
        position: "Associate Advisor",
        specialization: "Adaptive Neural Models",
        image: "/images/advisor.png"
    },
];

const Advisory = () => {
    return (
        <section id="advisory" className="py-20 bg-background overflow-hidden">
            <div className="w-full px-4 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col justify-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight text-primary">
                            Institutional <span className="italic outline-text">Wisdom</span>
                        </h2>
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start group">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shrink-0 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">01</div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black uppercase tracking-tight text-primary">Scholarly Excellence</h4>
                                    <p className="text-muted-foreground font-medium max-w-sm text-sm sm:text-base leading-relaxed">Guiding our research initiatives with academic precision and futuristic insight.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start group">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shrink-0 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">02</div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black uppercase tracking-tight text-primary">Ethical Frameworks</h4>
                                    <p className="text-muted-foreground font-medium max-w-sm text-sm sm:text-base leading-relaxed">Defining the moral boundaries of machine-living integration for a balanced future.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.2 } },
                            hidden: {}
                        }}
                        className="grid gap-8"
                    >
                        {advisors.map((advisor, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.95, y: 30 },
                                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                                }}
                            >
                                <Card className="rounded-2xl border border-primary/10 p-6 sm:p-10 bg-muted/20 hover:border-primary/40 hover:bg-muted/30 transition-all duration-500 overflow-hidden group relative">
                                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                                        <Avatar className="h-48 w-48 sm:h-72 sm:w-72 rounded-xl border-4 border-primary/10 shrink-0 group-hover:border-primary/30 transition-colors duration-500">
                                            <AvatarImage src={advisor.image} className="grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
                                            <AvatarFallback className="rounded-none bg-primary/10 text-primary">{advisor.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 pt-4">
                                            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-2 text-primary">{advisor.name}</h3>
                                            <p className="text-xs font-bold uppercase tracking-widest italic mb-6 text-secondary">{advisor.position}</p>
                                            <p className="text-sm sm:text-lg font-medium leading-relaxed italic text-muted-foreground">"Specializing in {advisor.specialization} to guide sustainable AI development."</p>
                                        </div>
                                    </div>
                                    {/* Subtle decorative glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Advisory;
