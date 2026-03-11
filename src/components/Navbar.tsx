import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Board Members", path: "/board" },
        { label: "Advisory", path: "/advisory" },
        { label: "Events", path: "/events" },
        { label: "Archive", path: "/completed-events" },
    ];

    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/90 backdrop-blur-md">
            <div className="w-full flex h-16 items-center justify-between pr-4 sm:pr-8 lg:pr-12">
                <Link to="/" className="flex items-center group shrink-0">
                    <img
                        src="/images/logo.png"
                        alt="MIC Logo"
                        className="h-32 w-auto transition-all group-hover:scale-105 dark:invert object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-1">
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-md group",
                                            location.pathname === item.path
                                                ? "text-primary-foreground"
                                                : "text-primary/80 hover:text-primary"
                                        )}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        {location.pathname === item.path && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-primary rounded-md"
                                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                            />
                                        )}
                                        {location.pathname !== item.path && (
                                            <div className="absolute inset-0 bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Desktop Buttons & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-md text-primary hover:bg-primary/10"
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <div className="hidden sm:flex items-center gap-3">
                        <Button variant="ghost" className="rounded-md font-bold px-4 uppercase tracking-wider text-xs text-primary hover:bg-primary/10">
                            Join Us
                        </Button>
                        <Button className="rounded-md font-bold px-5 uppercase tracking-wider text-xs bg-primary text-primary-foreground hover:opacity-90 transition-all">
                            Contact
                        </Button>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="lg:hidden rounded-md border-primary/30 h-10 w-10 flex items-center justify-center text-primary"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            }
                        />
                        <SheetContent
                            side="top"
                            showCloseButton={false}
                            className="w-full h-auto p-0 border-b border-primary/20 bg-background shadow-xl"
                        >
                            <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                                <SheetTitle className="text-sm font-black uppercase tracking-widest text-primary">MIC Navigation</SheetTitle>
                                <SheetClose className="rounded-md p-1 hover:bg-primary/10 transition-colors">
                                    <X className="h-5 w-5 text-primary" />
                                </SheetClose>
                            </div>
                            <motion.div
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: {
                                        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                                    },
                                    closed: {
                                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                    }
                                }}
                            >
                                <nav className="flex flex-col p-4 gap-1">
                                    {navItems.map((item) => (
                                        <motion.div
                                            key={item.path}
                                            variants={{
                                                open: { opacity: 1, x: 0 },
                                                closed: { opacity: 0, x: -20 }
                                            }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "text-sm font-bold uppercase tracking-widest p-3 rounded-md transition-all block",
                                                    location.pathname === item.path
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-primary/70 hover:bg-primary/5"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                                <motion.div
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: 10 }
                                    }}
                                    className="p-4 grid grid-cols-2 gap-3 pb-8"
                                >
                                    <Button variant="outline" className="w-full rounded-md border-primary/30 text-primary font-bold uppercase tracking-widest h-11 text-xs">
                                        Join Us
                                    </Button>
                                    <Button className="w-full rounded-md bg-primary text-primary-foreground font-bold uppercase tracking-widest h-11 text-xs">
                                        Contact
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
