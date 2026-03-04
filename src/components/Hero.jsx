import React, { useState, useEffect } from "react";
import { GithubIcon, Linkedin01Icon, NewTwitterIcon, TiktokIcon, ArrowDown01Icon } from "hugeicons-react";

const Hero = () => {
    const [displayText, setDisplayText] = useState("");
    const fullText = "Frontend Developer & UI Designer";
    const typingSpeed = 100;

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < fullText.length) {
                setDisplayText((prev) => fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, typingSpeed);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-20">
            {/* Prismatic Aurora Burst - Multi-layered Purple Gradient Background */}
            <div
                className="absolute inset-0 z-0 bg-black"
                style={{
                    background: `
                        radial-gradient(ellipse 120% 80% at 70% 20%, rgba(139, 92, 246, 0.2), transparent 50%),
                        radial-gradient(ellipse 100% 60% at 30% 10%, rgba(63, 6, 88, 0.15), transparent 60%),
                        radial-gradient(ellipse 90% 70% at 50% 0%, rgba(56, 2, 77, 0.38), transparent 65%),
                        radial-gradient(ellipse 110% 50% at 80% 30%, rgba(49, 6, 91, 0.12), transparent 40%),
                        radial-gradient(ellipse 80% 50% at 15% 75%, rgba(59, 4, 70, 0.15), transparent 50%),
                        radial-gradient(ellipse 100% 70% at 85% 85%, rgba(54, 7, 62, 0.18), transparent 60%),
                        radial-gradient(ellipse 70% 60% at 40% 90%, rgba(60, 6, 80, 0.15), transparent 50%),
                        #000000
                    `,
                }}
            />
            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/2 mb-12 md:mb-0">
                        <div className="text-sm font-medium mb-4 tracking-wider font-bold reveal active accent-font text-primary">
                            <h1 className="text-xl font-bold mb-2">𝙲𝚘𝚍𝚎𝚆/𝙺𝚗𝚘𝚠𝚕𝚎𝚍𝚐𝚎 ✦</h1>
                        </div>
                        <div className="flex-col items-center justify-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 reveal active text-white text-center">
                            Knowledge Udoh
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-theme reveal active text-center">
                            Crafting innovative web experiences. 
                            
                        </p>
                        <p className="text-lg md:text-xl mb-8 text-theme reveal active text-center">Building ideas to life.</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 reveal active">
                            <a
                                href="#projects"
                                className="px-6 py-3 bg-primary text-white font-medium !rounded-button hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                View Projects
                            </a>
                            <a
                                href="#contact"
                                className="px-6 py-3 border border-theme font-medium !rounded-button hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                            >
                                Hire Me
                            </a>
                        </div>
                        <div className="flex items-center justify-center gap-4 reveal active">
                            <a href="https://github.com/CODEWKNOWLEDGE" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <GithubIcon size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/knowledge54/" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Linkedin01Icon size={20} />
                            </a>
                            <a href="https://x.com/CodeWKnowledge" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <NewTwitterIcon size={20} />
                            </a>
                            <a href="https://www.tiktok.com/@codewithknowledge" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <TiktokIcon size={20} />
                            </a>
                        </div>
                    </div>

                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 animate-bounce ">
                    <a href="#about" className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-theme">
                        <ArrowDown01Icon size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
