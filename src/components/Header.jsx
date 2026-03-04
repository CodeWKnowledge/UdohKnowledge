import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu01Icon, Cancel01Icon, GithubIcon, Linkedin01Icon, NewTwitterIcon, TiktokIcon } from "hugeicons-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Apply theme classes to body
        document.body.className = "bg-theme text-theme";

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { name: "About", href: "/#about" },
        { name: "Projects", href: "/#projects" },
        { name: "Skills", href: "/#skills" },
        { name: "Contact", href: "/#contact" }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6  ${isScrolled ? "py-4 bg-opacity-90 backdrop-blur-md shadow-lg" : "py-6 bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-4xl text-primary logo-font"
                    >
                        Knowledge
                    </Link>
                    <div className="flex-1 flex justify-end items-center space-x-8">
                        <nav className="hidden md:flex items-center space-x-8" >
                            {navItems.map(item => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="nav-link font-medium hover:text-primary transition-colors text-white"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <div className="hamburger md:hidden" onClick={toggleMenu}>
                                {isMenuOpen ? <Cancel01Icon /> : <Menu01Icon />}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={toggleMenu}
            ></div>

            {/* Mobile Menu Content */}
            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-[400px] bg-theme/95 backdrop-blur-2xl z-50 border-l border-white/5 transition-transform duration-500 ease-out md:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center p-8 border-b border-white/5">
                    <span className="text-2xl text-primary logo-font">Menu</span>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white" onClick={toggleMenu}>
                        <Cancel01Icon size={24} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center p-8 space-y-8">
                    {navItems.map((item, index) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={toggleMenu}
                            className="group flex flex-col"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <span className="text-xs text-primary/40 uppercase tracking-[0.3em] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                            <span className="text-4xl font-bold text-white group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-2">
                                {item.name}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="p-8 border-t border-white/5 space-y-6">
                    <p className="text-theme/40 text-sm italic accent-font">
                        Crafting digital excellence, one pixel at a time.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://github.com/CODEWKNOWLEDGE" target="_blank" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary/20 hover:text-primary transition-all">
                            <GithubIcon size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/knowledge54/" target="_blank" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary/20 hover:text-primary transition-all">
                            <Linkedin01Icon size={18} />
                        </a>
                        <a href="https://x.com/CodeWKnowledge" target="_blank" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary/20 hover:text-primary transition-all">
                            <NewTwitterIcon size={18} />
                        </a>
                        <a href="https://www.tiktok.com/@codewithknowledge" target="_blank" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary/20 hover:text-primary transition-all">
                            <TiktokIcon size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
