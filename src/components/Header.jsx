import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    UserAccountIcon,
    Layout01Icon,
    Sorting05Icon,
    Mail01Icon,
    FileDownloadIcon,
    ViewIcon,
    Download01Icon,
    Home01Icon
} from "hugeicons-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showResumeChoice, setShowResumeChoice] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        document.body.className = "bg-theme text-theme";
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "/#hero", icon: Home01Icon },
        { name: "About", href: "/#about", icon: UserAccountIcon },
        { name: "Projects", href: "/#projects", icon: Layout01Icon },
        { name: "Skills", href: "/#skills", icon: Sorting05Icon },
        { name: "Contact", href: "/#contact", icon: Mail01Icon },
        { name: "Resume", href: "#", icon: FileDownloadIcon, isResume: true }
    ];

    return (
        <header
            className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-2xl px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-center`}
        >
            <nav className="flex items-center gap-4 md:gap-12 justify-center w-full relative" >
                {navItems.map(item => (
                    <div key={item.name} className="relative">
                        {item.isResume ? (
                            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => setShowResumeChoice(!showResumeChoice)}>
                                <div className={`transition-all duration-300 ${showResumeChoice ? 'text-primary' : 'text-white/70 group-hover:text-white'}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${showResumeChoice ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`}>
                                    {item.name}
                                </span>

                                <AnimatePresence>
                                    {showResumeChoice && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2 flex gap-4 shadow-2xl z-[60]"
                                        >
                                            <a
                                                href="/resume.pdf"
                                                target="_blank"
                                                className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg transition-colors group/choice"
                                                onClick={() => setShowResumeChoice(false)}
                                            >
                                                <ViewIcon size={18} className="text-white/70 group-hover/choice:text-primary" />
                                                <span className="text-[9px] font-bold uppercase text-white/40 group-hover/choice:text-white/70">View</span>
                                            </a>
                                            <div className="w-[1px] bg-white/10 self-stretch my-2"></div>
                                            <a
                                                href="/resume.pdf"
                                                download
                                                className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg transition-colors group/choice"
                                                onClick={() => setShowResumeChoice(false)}
                                            >
                                                <Download01Icon size={18} className="text-white/70 group-hover/choice:text-primary" />
                                                <span className="text-[9px] font-bold uppercase text-white/40 group-hover/choice:text-white/70">Download</span>
                                            </a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <a
                                href={item.href}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className="text-white/70 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                    <item.icon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-all duration-300">
                                    {item.name}
                                </span>
                            </a>
                        )}
                    </div>
                ))}
            </nav>
        </header>
    );
};

export default Header;
