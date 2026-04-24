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
    Home01Icon,
    BookOpen01Icon
} from "hugeicons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabase } from "../context/SupabaseContext";

const Header = () => {
    const { settings } = useSupabase();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showResumeChoice, setShowResumeChoice] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
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
        { name: "Insights", href: "/blog", icon: BookOpen01Icon, isRoute: true },
        { name: "Contact", href: "/#contact", icon: Mail01Icon },
        { name: "Resume", href: "#", icon: FileDownloadIcon, isResume: true }
    ];

    return (
        <header
            className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[98%] md:w-[95%] max-w-2xl px-2 md:px-6 py-2 md:py-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-center`}
        >
            <nav className="flex items-center gap-0.5 md:gap-4 justify-center w-full relative" onMouseLeave={() => setHoveredItem(null)}>
                {navItems.map(item => (
                    <div
                        key={item.name}
                        className="relative z-10"
                        onMouseEnter={() => setHoveredItem(item.name)}
                    >
                        {/* Hover Background Pill */}
                        <AnimatePresence>
                            {hoveredItem === item.name && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </AnimatePresence>

                        {item.isResume ? (
                            <div
                                className="flex flex-col items-center gap-0.5 md:gap-1 px-2.5 md:px-4 py-1.5 md:py-2 group cursor-pointer"
                                onClick={() => setShowResumeChoice(!showResumeChoice)}
                                aria-label="Resume Options"
                            >
                                <motion.div
                                    animate={{ scale: hoveredItem === item.name ? 1.1 : 1 }}
                                    className={`transition-all duration-300 ${showResumeChoice ? 'text-primary' : 'text-white/70 group-hover:text-white'}`}
                                >
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.div>
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${showResumeChoice ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`}>
                                    {item.name}
                                </span>

                                <AnimatePresence>
                                    {showResumeChoice && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className="absolute top-full mt-4 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2 flex gap-4 shadow-2xl z-[60]"
                                        >
                                            <a
                                                href={settings?.social_links?.resume_url || "/Knowledge_Udoh_Resume.pdf"}
                                                target="_blank"
                                                className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg transition-colors group/choice"
                                                onClick={() => setShowResumeChoice(false)}
                                            >
                                                <ViewIcon size={18} className="text-white/70 group-hover/choice:text-primary" />
                                                <span className="text-[9px] font-bold uppercase text-white/40 group-hover/choice:text-white/70">View</span>
                                            </a>
                                            <div className="w-[1px] bg-white/10 self-stretch my-2"></div>
                                            <a
                                                href={settings?.social_links?.resume_url || "/Knowledge_Udoh_Resume.pdf"}
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
                        ) : item.isRoute ? (
                            <Link
                                to={item.href}
                                className="flex flex-col items-center gap-0.5 md:gap-1 px-2.5 md:px-4 py-1.5 md:py-2 group"
                                aria-label={item.name}
                            >
                                <motion.div
                                    animate={{ scale: hoveredItem === item.name || location.pathname.startsWith(item.href) ? 1.1 : 1 }}
                                    className={`${location.pathname.startsWith(item.href) ? 'text-primary' : 'text-white/70 group-hover:text-white'} transition-all duration-300`}
                                >
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.div>
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${location.pathname.startsWith(item.href) ? 'text-primary' : 'text-white/40 group-hover:text-white/70'} transition-all duration-300`}>
                                    {item.name}
                                </span>
                            </Link>
                        ) : (
                            <a
                                href={item.href}
                                className="flex flex-col items-center gap-0.5 md:gap-1 px-2.5 md:px-4 py-1.5 md:py-2 group"
                                aria-label={item.name}
                            >
                                <motion.div
                                    animate={{ scale: hoveredItem === item.name ? 1.1 : 1 }}
                                    className="text-white/70 group-hover:text-white transition-all duration-300"
                                >
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.div>
                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-all duration-300">
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
