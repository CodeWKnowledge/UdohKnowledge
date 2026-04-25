import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GithubIcon, Linkedin01Icon, NewTwitterIcon, TiktokIcon, ArrowDown01Icon } from "hugeicons-react";
import mecat from "../assets/Knowledge/Smirk.png";
import { motion } from "framer-motion";
import { useSupabase } from "../context/SupabaseContext";

const Hero = () => {
    const { content, settings } = useSupabase();
    const [displayText, setDisplayText] = useState("");
    const fullText = content?.hero_title || "Frontend Developer & UI Designer";
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

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    return (
        <section id="hero" className="md:min-h-screen min-h-[50vh] flex items-center relative overflow-hidden pt-20">
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
                    <div className="md:w-1/2 w-full mb-12 md:mb-0">
                        <motion.div
                            {...fadeInUp}
                            className="flex items-center justify-end mr-20 mb-2 gap-4"
                        >
                            <div className="w-30 h-30 rounded-full border-2 border-primary/30 p-1 flex-shrink-0">
                                <img src={mecat} alt="Knowledge Udoh" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
                            </div>

                        </motion.div>
                        <div className="flex-col items-center justify-center">
                            <h2 className="text-lg md:text-xl ml-20 text-theme text-start ml-20">Hey, I'M</h2>
                            <motion.h1
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                                className="text-5xl md:text-6xl font-bold mb-1 text-white text-center"
                            >
                                Knowledge Udoh
                            </motion.h1>
                            <motion.h2
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                                className="text-2xl md:text-3xl font-logo font-bold mb-3 text-theme-muted text-center"
                            >
                                Web Agency & Frontend Engineer
                            </motion.h2>
                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                                className="text-lg md:text-xl mb-2 text-theme text-center leading-relaxed"
                            >
                                {content?.hero_description1 || "Engineering custom websites for businesses globally and in Nigeria."}
                            </motion.p>
                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.3 }}
                                className="text-lg md:text-xl mb-8 text-theme text-center"
                            >
                                {content?.hero_description2 || "We build scalable, high-performance web agency solutions, ecommerce platforms, and digital products that drive massive revenue."}
                            </motion.p>
                        </div>

                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center gap-4 mb-8"
                        >
                            <Link
                                to="/#contact"
                                className="px-8 py-4 bg-primary text-white font-bold tracking-widest uppercase text-xs !rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(126,34,206,0.3)] whitespace-nowrap"
                            >
                                Work with me
                            </Link>
                            <Link
                                to="/#projects"
                                className="px-8 py-4 border border-white/20 text-white font-bold tracking-widest uppercase text-xs !rounded-xl hover:bg-white/10 transition-all whitespace-nowrap"
                            >
                                View Portfolio
                            </Link>
                        </motion.div>
                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.5 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <a href={settings?.social_links?.github || "https://github.com/CODEWKNOWLEDGE"} target="_blank" aria-label="GitHub Profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <GithubIcon size={20} />
                            </a>
                            <a href={settings?.social_links?.linkedin || "https://www.linkedin.com/in/knowledge54/"} target="_blank" aria-label="LinkedIn Profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Linkedin01Icon size={20} />
                            </a>
                            <a href={settings?.social_links?.twitter || "https://x.com/CodeWKnowledge"} target="_blank" aria-label="Twitter X Profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <NewTwitterIcon size={20} />
                            </a>
                            <a href={settings?.social_links?.tiktok || "https://www.tiktok.com/@codewithknowledge"} target="_blank" aria-label="TikTok Profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <TiktokIcon size={20} />
                            </a>
                        </motion.div>
                    </div>

                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 animate-bounce ">
                    <Link to="/#about" className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-theme">
                        <ArrowDown01Icon size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
