import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BoardPage from './pages/BoardPage';
import AdvisoryPage from './pages/AdvisoryPage';
import EventsPage from './pages/EventsPage';
import CompletedEventsPage from './pages/CompletedEventsPage';
import { Separator } from './components/ui/separator';

import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="bg-background py-16 border-t border-primary/20">
    <div className="w-full px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="MIC Logo" className="h-10 w-auto dark:invert" />
            <span className="text-2xl font-black tracking-tight uppercase text-primary">MIC Club</span>
          </div>
          <p className="text-muted-foreground font-medium max-w-[400px] leading-relaxed text-sm">
            Exploring the fusion of natural wisdom and artificial intellect. A community committed to sustainable, biomimetic, and ethical innovation.
          </p>
        </div>
        <div className="col-span-1 md:col-span-1">
          <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-primary mb-8 underline underline-offset-8">Network</h4>
          <div className="flex flex-wrap gap-8">
            {[
              { title: "Discord", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png" },
              { title: "GitHub", icon: "https://cdn-icons-png.flaticon.com/512/25/25231.png" },
              { title: "LinkedIn", icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
              { title: "Instagram", icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                className="text-muted-foreground hover:text-primary transition-colors group"
                title={social.title}
              >
                <img src={social.icon} alt={social.title} className="h-10 w-10 grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all brightness-0 dark:invert" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <Separator className="bg-primary/10" />
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
        <p>© 2024 Machine Intelligence Club (MIC). Organic Intelligence.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

import { ThemeProvider } from './components/theme-provider';

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mic-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans antialiased">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/advisory" element={<AdvisoryPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/completed-events" element={<CompletedEventsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;