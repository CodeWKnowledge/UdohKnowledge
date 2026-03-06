import React, { useState, useEffect, useRef } from "react";
import Selfie from '../assets/Knowledge/Selfie.jpeg'
import Workspace from '../assets/Knowledge/Workspace.jpeg'
import Speaking from '../assets/Knowledge/Speaking.jpeg'
import Pose from '../assets/Knowledge/Pose.jpeg'
import { motion } from "framer-motion";

const About = () => {
    const [activeImage, setActiveImage] = useState(null);
    const galleryRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (galleryRef.current && !galleryRef.current.contains(e.target)) {
                setActiveImage(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <section id="about" className="md:py-32 py-16 bg-theme transition-colors duration-300 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Image Column - Staggered Gallery */}
                    <div ref={galleryRef} className="lg:col-span-6 relative h-[400px] md:h-[600px] flex items-center justify-center">
                        {/* 1. Workspace (Top Left - Reduced Size) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === 1 ? null : 1); }}
                            className={`absolute top-15 md:top-25 left-5 w-1/2 aspect-video cursor-pointer ${activeImage === 1 ? 'z-40' : 'z-15 md:hover:z-40'} group`}
                        >
                            <div className={`w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center ${activeImage === 1 ? 'scale-105 -rotate-2' : 'md:group-hover:scale-105 md:group-hover:-rotate-2'}`}>
                                <div className={`absolute -inset-4 bg-primary/30 blur-2xl rounded-2xl transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 1 ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>
                                <img
                                    src={Speaking}
                                    alt="Speaking"
                                    loading="lazy"
                                    decoding="async"
                                    className={`relative rounded-2xl shadow-2xl w-full h-full object-cover border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 1 ? 'grayscale-0 border-primary' : 'grayscale-[30%] md:group-hover:grayscale-0 md:group-hover:border-primary'}`}
                                />
                            </div>
                        </motion.div>

                        {/* 2. Speaking (Center Right) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === 2 ? null : 2); }}
                            className={`absolute top-5 right-5 w-2/5 aspect-[3/4] cursor-pointer ${activeImage === 2 ? 'z-40' : 'z-20 md:hover:z-40'} group`}
                        >
                            <div className={`w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center ${activeImage === 2 ? 'scale-105 rotate-2' : 'md:group-hover:scale-105 md:group-hover:rotate-2'}`}>
                                <div className={`absolute -inset-4 bg-secondary/30 blur-2xl rounded-2xl transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 2 ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>
                                <img
                                    src={Workspace}
                                    alt="Workspace"
                                    loading="lazy"
                                    decoding="async"
                                    className={`relative rounded-2xl shadow-2xl w-full h-full object-cover border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 2 ? 'border-secondary' : 'md:group-hover:border-secondary'}`}
                                />
                            </div>
                        </motion.div>

                        {/* 3. Selfie (Bottom Left) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === 3 ? null : 3); }}
                            className={`absolute bottom-4 left-8 w-2/5 aspect-square cursor-pointer ${activeImage === 3 ? 'z-40' : 'z-30 md:hover:z-40'} group`}
                        >
                            <div className={`w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center ${activeImage === 3 ? 'scale-105 -rotate-3' : 'md:group-hover:scale-105 md:group-hover:-rotate-3'}`}>
                                <div className={`absolute -inset-4 bg-primary/40 blur-2xl rounded-full transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 3 ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>
                                <img
                                    src={Pose}
                                    alt="Knowledge"
                                    loading="lazy"
                                    decoding="async"
                                    className={`relative rounded-full shadow-2xl w-full h-full object-cover border-2 border-primary/20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 3 ? 'border-primary' : 'md:group-hover:border-primary'}`}
                                />
                            </div>
                        </motion.div>

                        {/* 4. Pose (Middle Left - Staggered) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === 4 ? null : 4); }}
                            className={`absolute bottom-1/4 left-1/4 w-1/3 aspect-[4/5] cursor-pointer ${activeImage === 4 ? 'z-40' : 'z-20 md:hover:z-40'} group`}
                        >
                            <div className={`w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center ${activeImage === 4 ? 'scale-105 rotate-3' : 'md:group-hover:scale-105 md:group-hover:rotate-3'}`}>
                                <div className={`absolute -inset-4 bg-white/20 blur-2xl rounded-2xl transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 4 ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}></div>
                                <img
                                    src={Selfie}
                                    alt="Selfie"
                                    loading="lazy"
                                    decoding="async"
                                    className={`relative rounded-2xl shadow-2xl w-full h-full object-cover border border-white/5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeImage === 4 ? 'border-white/50' : 'md:group-hover:border-white/50'}`}
                                />
                            </div>
                        </motion.div>

                        {/* Background Branding Text - Optimized for Mobile & Desktop */}
                        <div className="absolute bottom-[10%] right-[-5%] pointer-events-none z-0 overflow-hidden select-none transform rotate-[-35deg] origin-bottom-right">
                            <span className="text-[15vw] md:text-6xl font-bold text-white/[0.05] whitespace-nowrap tracking-tighter logo-font">
                                CodeW/Knowledge ✦
                            </span>
                        </div>

                        {/* Decorative background shape */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] z-0"></div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-6 lg:pl-10">
                        <motion.div
                            {...fadeInUp}
                            className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8"
                        >
                            <span className="text-primary text-xs font-bold uppercase tracking-widest">The Persona</span>
                        </motion.div>
                        <motion.h2
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-10 font-heading leading-tight"
                        >
                            Curiosity-driven <br />
                            <span className="text-primary italic">innovation.</span>
                        </motion.h2>

                        <div className="space-y-6 max-w-xl">
                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                                className="text-xl text-white/90 leading-relaxed font-heading"
                            >
                                I'm Knowledge Udoh, a Developer passionate about crafting digital experiences that resonate.
                            </motion.p>
                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.3 }}
                                className="text-lg text-theme/40 leading-relaxed font-medium"
                            >
                                My approach combines technical precision with an obsession for visual details. I don't just build interfaces; I design workflows that feel natural and architecture that scales.
                            </motion.p>
                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.4 }}
                                className="text-lg text-theme/40 leading-relaxed"
                            >
                                From leading tech solutions to developing seamless mobile experiences, my focus is always on the intersection of human-centric design and powerful performance.
                            </motion.p>

                            <motion.p
                                {...fadeInUp}
                                transition={{ ...fadeInUp.transition, delay: 0.4 }}
                                className="text-lg text-theme/40 leading-relaxed"
                            >
                                I'm also an actively growing tech content creator, passionate about public speaking and sharing my knowledge with the world.
                            </motion.p>
                        </div>

                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.5 }}
                            className="mt-12 grid grid-cols-3 gap-6"
                        >
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">2+</span>
                                <span className="text-[9px] text-theme/30 uppercase tracking-[0.2em] font-bold">Years Experience</span>
                            </div>
                            <div className="flex flex-col border-l border-white/5 pl-6">
                                <span className="text-2xl font-bold text-white">15+</span>
                                <span className="text-[9px] text-theme/30 uppercase tracking-[0.2em] font-bold">Projects Built</span>
                            </div>
                            <div className="flex flex-col border-l border-white/5 pl-6">
                                <span className="text-2xl font-bold text-white">∞</span>
                                <span className="text-[9px] text-theme/30 uppercase tracking-[0.2em] font-bold">Ideas Explored</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
