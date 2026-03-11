import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TypewriterTitle = () => {
    const lines = [
        { text: "Machine", color: "text-primary" },
        { text: "Intelligence", color: "text-primary" },
        { text: "Club", color: "text-secondary" }
    ];

    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayedLines, setDisplayedLines] = useState(["", "", ""]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const handleType = () => {
            if (!isDeleting) {
                if (currentLineIndex < lines.length) {
                    if (currentCharIndex < lines[currentLineIndex].text.length) {
                        // Typing character
                        const newDisplayedLines = [...displayedLines];
                        newDisplayedLines[currentLineIndex] = lines[currentLineIndex].text.substring(0, currentCharIndex + 1);
                        setDisplayedLines(newDisplayedLines);
                        setCurrentCharIndex(currentCharIndex + 1);
                        timeout = setTimeout(handleType, 100);
                    } else {
                        // Next line
                        setCurrentLineIndex(currentLineIndex + 1);
                        setCurrentCharIndex(0);
                        timeout = setTimeout(handleType, 200);
                    }
                } else {
                    // All typed, pause
                    timeout = setTimeout(() => setIsDeleting(true), 2500);
                }
            } else {
                if (currentLineIndex >= lines.length) {
                    // Start deleting from the last line
                    setCurrentLineIndex(lines.length - 1);
                    setCurrentCharIndex(lines[lines.length - 1].text.length);
                    timeout = setTimeout(handleType, 100);
                } else if (currentLineIndex >= 0) {
                    if (currentCharIndex > 0) {
                        // Deleting character
                        const newDisplayedLines = [...displayedLines];
                        newDisplayedLines[currentLineIndex] = lines[currentLineIndex].text.substring(0, currentCharIndex - 1);
                        setDisplayedLines(newDisplayedLines);
                        setCurrentCharIndex(currentCharIndex - 1);
                        timeout = setTimeout(handleType, 50);
                    } else {
                        // Previous line
                        if (currentLineIndex > 0) {
                            setCurrentLineIndex(currentLineIndex - 1);
                            setCurrentCharIndex(lines[currentLineIndex - 1].text.length);
                            timeout = setTimeout(handleType, 50);
                        } else {
                            // All deleted, pause
                            timeout = setTimeout(() => {
                                setIsDeleting(false);
                                setCurrentLineIndex(0);
                                setCurrentCharIndex(0);
                                setDisplayedLines(["", "", ""]);
                            }, 500);
                        }
                    }
                }
            }
        };

        timeout = setTimeout(handleType, 100);
        return () => clearTimeout(timeout);
    }, [currentLineIndex, currentCharIndex, isDeleting, displayedLines]);

    return (
        <h1 className="text-3xl leading-[0.9] sm:text-6xl md:text-[80px] lg:text-[100px] font-black tracking-tighter md:leading-[0.85] uppercase">
            {lines.map((line, idx) => (
                <span key={idx} className={cn("block", line.color)}>
                    {displayedLines[idx]}
                </span>
            ))}
        </h1>
    );
};

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-32 md:pb-40 bg-background">
            <div className="w-full px-4 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 flex flex-col gap-6 text-left">
                        <TypewriterTitle />
                        <p className="text-lg md:text-2xl text-muted-foreground max-w-[700px] font-medium leading-relaxed">
                            Merging organic wisdom with computational excellence. We explore the synergy between biological logic and machine learning.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button size="lg" className="rounded-md h-12 md:h-14 px-8 md:px-10 text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/10">
                                Explore Events
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-md h-12 md:h-14 px-8 md:px-10 text-sm font-bold uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary/5 transition-all">
                                Join Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-4 self-center hidden lg:block">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                            <div className="relative rounded-2xl overflow-hidden border-4 border-primary/20 bg-muted/30 p-2">
                                <img
                                    src="/images/hero.png"
                                    alt="MIC Hero"
                                    className="w-full h-auto object-cover grayscale opacity-80"
                                />
                            </div>
                        </div>
                        <div className="mt-10 space-y-3">
                            <div className="flex justify-between border-b border-primary/20 pb-2 font-bold uppercase tracking-tight text-xs text-primary/80">
                                <span>Founded</span>
                                <span className="text-secondary font-black">2024</span>
                            </div>
                            <div className="flex justify-between border-b border-primary/20 pb-2 font-bold uppercase tracking-tight text-xs text-primary/80">
                                <span>Active Members</span>
                                <span className="text-secondary font-black">500+</span>
                            </div>
                            <div className="flex justify-between border-b border-primary/20 pb-2 font-bold uppercase tracking-tight text-xs text-primary/80">
                                <span>Location</span>
                                <span className="text-secondary font-black">Tech Lab 01</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organic Shapes Background */}
            <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 -z-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
        </section>
    );
};

export default Hero;
