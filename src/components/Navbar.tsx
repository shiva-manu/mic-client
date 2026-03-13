import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
    { label: "Home", path: "/" },
    { label: "Board", path: "/board" },
    { label: "Advisory", path: "/advisory" },
    { label: "Events", path: "/events" },
    { label: "Ideas", path: "/ideas" },
    { label: "Archive", path: "/completed-events" },
];

const Navbar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
                <nav className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl px-4 h-14 shadow-xl shadow-black/10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <img src="/images/logo.png" alt="MIC" className="h-[300px] w-[120px] object-contain mt-2.5" />
                    </Link>

                    {/* Center links */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {links.map((l) => (
                            <Link
                                key={l.path}
                                to={l.path}
                                className={cn(
                                    "relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
                                    location.pathname === l.path
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {location.pathname === l.path && (
                                    <motion.span
                                        layoutId="bubble"
                                        className="absolute inset-0 bg-secondary rounded-lg"
                                        transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-xs text-muted-foreground hover:text-foreground hover:bg-secondary">
                            <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                </svg>
                                Join Discord
                            </a>
                        </Button>
                        <Button size="sm" className="hidden sm:flex text-xs bg-primary hover:bg-primary/90 text-white rounded-lg gap-1.5 h-8 px-4">
                            Contact <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden mx-4 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 shadow-xl shadow-black/10"
                    >
                        {links.map((l) => (
                            <Link
                                key={l.path}
                                to={l.path}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    location.pathname === l.path
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                            <Button variant="outline" size="sm" asChild className="flex-1 text-xs rounded-lg h-9">
                                <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                    </svg>
                                    Join Discord
                                </a>
                            </Button>
                            <Button size="sm" className="flex-1 text-xs bg-primary text-white rounded-lg h-9">Contact</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
