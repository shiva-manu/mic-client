import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ongoingEvents = [
    {
        title: "Eco-ML Hackathon",
        description: "Developing energy-efficient models for environmental data analysis.",
        date: "Current - March 15",
        location: "Botany Lab 3",
        time: "Ongoing",
        image: "/images/event1.png",
        tags: ["Green AI", "Research"]
    }
];

const upcomingEvents = [
    {
        title: "Neural Mimicry Workshop",
        description: "Practical session on building biologically inspired neural layers.",
        date: "March 20, 2024",
        location: "Tech Lab 01",
        time: "2:00 PM - 5:00 PM",
        image: "/images/event2.png",
        tags: ["Workshop", "Biomimicry"]
    },
    {
        title: "Organic Tech Symposium",
        description: "Annual meeting of the minds on the future of natural/synthetic synergy.",
        date: "April 5, 2024",
        location: "Main Auditorium",
        time: "10:00 AM - 4:00 PM",
        image: "/images/hero.png",
        tags: ["Talk", "Society"]
    }
];

const completedEvents = [
    {
        title: "Winter AI Retreat",
        description: "A 3-day intensive on deep learning architectures in nature.",
        date: "January 12-15, 2024",
        location: "Mountain Base",
        time: "Completed",
        image: "/images/event1.png",
        tags: ["Retreat", "Advanced"]
    },
    {
        title: "Bio-Logic Seminar",
        description: "Introductory talk on how DNA inspires computation.",
        date: "February 5, 2024",
        location: "Tech Lab 01",
        time: "Completed",
        image: "/images/event2.png",
        tags: ["Seminar", "Intro"]
    }
];

export { ongoingEvents, upcomingEvents, completedEvents };

const Events = () => {
    const allEvents = [
        ...ongoingEvents.map(e => ({ ...e, status: 'ongoing' })),
        ...upcomingEvents.map(e => ({ ...e, status: 'upcoming' }))
    ];

    return (
        <div className="py-24 bg-background">
            <div className="w-full px-4 sm:px-8 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20 text-center">
                        <Badge className="mb-4 rounded-md bg-primary/10 text-primary border-primary/20 font-black px-4 py-1 text-[10px] uppercase tracking-[0.2em]">
                            MIC Chronology
                        </Badge>
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-primary">
                            Event <span className="italic outline-text">Timeline</span>
                        </h2>
                    </div>

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
                        {allEvents.map((event, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                                }}
                                className="mb-16 last:mb-0 relative pl-8 md:pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className={cn(
                                    "absolute left-0 top-0 -translate-x-[calc(50%+1px)] h-4 w-4 rounded-full border-2 border-background z-10",
                                    event.status === 'ongoing' ? "bg-secondary animate-pulse shadow-[0_0_10px_rgba(var(--secondary),0.5)]" : "bg-primary"
                                )} />

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <Badge className={cn(
                                            "rounded-md font-black px-3 py-0.5 text-[8px] uppercase tracking-widest",
                                            event.status === 'ongoing' ? "bg-secondary text-secondary-foreground" : "bg-primary/5 text-primary border-primary/10"
                                        )}>
                                            {event.status}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                            <img src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" alt="Calendar" className="h-3 w-3 grayscale opacity-40 brightness-0 dark:invert" />
                                            {event.date}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                        <div className="md:col-span-8">
                                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-primary leading-none mb-4">
                                                {event.title}
                                            </h3>
                                            <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                                                {event.description}
                                            </p>
                                            <div className="flex gap-4">
                                                <Button size="sm" className="rounded-md h-9 px-6 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90">
                                                    {event.status === 'ongoing' ? 'Participate' : 'Register'}
                                                </Button>
                                                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary/60">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/854/854866.png" alt="Location" className="h-3.5 w-3.5 grayscale opacity-60 brightness-0 dark:invert" />
                                                    {event.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 rounded-lg overflow-hidden border border-primary/10 aspect-video md:aspect-square">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-500"
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

export default Events;
