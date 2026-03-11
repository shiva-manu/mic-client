import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const boardMembers = [
    { name: "Alex Johnson", role: "President", image: "/images/board.png" },
    { name: "Sarah Chen", role: "Vice President", image: "/images/board.png" },
    { name: "Michael Smith", role: "Technical Head", image: "/images/board.png" },
    { name: "Emily Davis", role: "Events Coordinator", image: "/images/board.png" },
];

const BoardMembers = () => {
    return (
        <section id="board" className="py-20 bg-background overflow-hidden font-sans">
            <div className="w-full px-4 sm:px-8 lg:px-12">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                        hidden: {}
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
                >
                    {boardMembers.map((member, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
                            }}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <Card className="rounded-2xl border-4 border-primary/10 overflow-hidden bg-muted/20 hover:border-primary/40 transition-all duration-500 shadow-xl shadow-black/5 h-full flex flex-col">
                                <CardHeader className="p-0 shrink-0">
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </CardHeader>
                                <div className="p-8 flex-1 flex flex-col justify-end">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary group-hover:text-secondary mb-1 dark:group-hover:text-primary-foreground transition-colors duration-300">{member.name}</CardTitle>
                                        <CardDescription className="text-muted-foreground font-black uppercase tracking-widest text-[10px] italic">{member.role}</CardDescription>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default BoardMembers;
