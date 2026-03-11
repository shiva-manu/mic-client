import { motion } from 'framer-motion';
import Events from '@/components/Events';

const EventsPage = () => {
    return (
        <div className="pt-20">
            <div className="container px-6 lg:px-12 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.8] border-b-8 border-primary pb-8">
                        Club <span className="italic">Events</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-20">
                        From high-stakes hackathons to technical deep-dives. Stay tuned for what's next.
                    </p>
                </motion.div>
            </div>
            <Events />
        </div>
    );
};

export default EventsPage;
