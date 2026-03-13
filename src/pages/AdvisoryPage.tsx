import { motion } from 'framer-motion';
import Advisory from '@/components/Advisory';

const AdvisoryPage = () => (
    <div className="pt-28 pb-16 min-h-screen relative overflow-hidden bg-transparent text-white">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 opacity-40 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
            >
                <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">Mentorship</p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">Advisory Panel</h1>
                <p className="text-muted-foreground max-w-lg">
                    Guided by academic pioneers and industry veterans who bridge theory and application.
                </p>
            </motion.div>
        </div>
        <Advisory />
    </div>
);

export default AdvisoryPage;
