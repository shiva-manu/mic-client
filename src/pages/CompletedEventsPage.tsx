import { completedEvents } from '@/components/Events';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const CompletedEventsPage = () => {
    return (
        <div className="pt-20 min-h-screen bg-background text-foreground">
            <div className="container px-6 lg:px-12 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.8] border-b-8 border-primary pb-8">
                        Archive <span className="italic">Events</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-20">
                        A look back at our technical milestones and community gatherings.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto pb-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.15 } },
                            hidden: {}
                        }}
                        className="relative border-l-2 border-primary/10 ml-4 md:ml-0"
                    >
                        {completedEvents.map((event, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                                }}
                                className="mb-16 last:mb-0 relative pl-8 md:pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-0 -translate-x-[calc(50%+1px)] h-4 w-4 rounded-full border-2 border-background z-10 bg-primary/40" />

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <Badge className="rounded-md font-black px-3 py-0.5 text-[8px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                                            Completed
                                        </Badge>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                            <img src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" alt="Calendar" className="h-3 w-3 grayscale opacity-40 brightness-0 dark:invert" />
                                            {event.date}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                        <div className="md:col-span-8">
                                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-primary leading-none mb-4 grayscale">
                                                {event.title}
                                            </h3>
                                            <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                                                {event.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary/60">
                                                <img src="https://cdn-icons-png.flaticon.com/512/854/854866.png" alt="Location" className="h-3.5 w-3.5 grayscale opacity-60 brightness-0 dark:invert" />
                                                {event.location}
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 rounded-lg overflow-hidden border border-primary/10 aspect-video md:aspect-square">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover grayscale opacity-30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CompletedEventsPage;
