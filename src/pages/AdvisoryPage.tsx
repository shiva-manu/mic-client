import { motion } from 'framer-motion';
import Advisory from '@/components/Advisory';

const AdvisoryPage = () => {
    return (
        <div className="pt-20">
            <div className="container px-6 lg:px-12 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.8] border-b-8 border-primary pb-8">
                        Advisory <span className="italic">Panel</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-20">
                        Guided by academic pioneers and industry veterans who bridge the gap between theory and application.
                    </p>
                </motion.div>
            </div>
            <Advisory />
        </div>
    );
};

export default AdvisoryPage;
