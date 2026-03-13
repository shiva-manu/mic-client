import { motion } from 'framer-motion';
import Events from '@/components/Events';

const EventsPage = () => (
    <div className="pt-28 pb-16 grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
            >
                <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">What's Happening</p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">Events</h1>
                <p className="text-muted-foreground max-w-lg">
                    From hackathons to technical deep-dives — everything MIC has coming up.
                </p>
            </motion.div>
        </div>
        <Events />
    </div>
);

export default EventsPage;
