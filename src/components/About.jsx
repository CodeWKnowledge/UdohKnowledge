import React from "react";
import Selfie from '../assets/Knowledge/Selfie.jpeg'
import Workspace from '../assets/Knowledge/Workspace.jpeg'
import Speaking from '../assets/Knowledge/Speaking.jpeg'
import Pose from '../assets/Knowledge/Pose.jpeg'
import { motion } from "framer-motion";

const About = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <section id="about" className="py-32 bg-theme transition-colors duration-300 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Image Column - Staggered Gallery */}
                    <div className="lg:col-span-6 relative h-[500px] md:h-[600px] flex items-center justify-center">
                        {/* 1. Workspace (Top Left - Reduced Size) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute top-35 md:top-25 left-5  w-1/2 aspect-video z-15 group "
                        >
                            <div className="absolute -inset-2 bg-primary/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={Speaking}
                                alt="Speaking"
                                className="relative rounded-2xl shadow-xl w-full h-full object-cover border border-white/5 grayscale-[30%] group-hover:grayscale-0 
                                group-hover:border-primary group-hover:scale-[1.02] transition-all duration-700"
                            />
                        </motion.div>

                        {/* 2. Speaking (Center Right) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="absolute top-1/4 right-5 w-2/5 aspect-[3/4] z-20 group"
                        >
                            <div className="absolute -inset-2 bg-secondary/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={Workspace}
                                alt="Workspace"
                                className="relative rounded-2xl shadow-2xl w-full h-full object-cover border border-white/10 group-hover:scale-[1.02] transition-all
                                group-hover:border-primary duration-700"
                            />
                        </motion.div>

                        {/* 3. Selfie (Bottom Left) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="absolute bottom-4 left-8 w-2/5 aspect-square z-30 group"
                        >
                            <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={Pose}
                                alt="Knowledge"
                                className="relative rounded-full shadow-2xl w-full h-full object-cover border-2 border-primary/20 group-hover:border-primary 
                                group-hover:scale-[1.02] transition-all duration-700"
                            />
                        </motion.div>

                        {/* 4. Pose (Middle Left - Staggered) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="absolute bottom-1/4 left-1/4 w-1/3 aspect-[4/5] z-20 group"
                        >
                            <div className="absolute -inset-2 bg-white/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={Selfie}
                                alt="Selfie"
                                className="relative rounded-2xl shadow-lg w-full h-full object-cover border border-white/5  group-hover:opacity-100 
                                group-hover:border-primary group-hover:scale-[1.02] transition-all duration-700"
                            />
                        </motion.div>

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
                                From leading tech solutions at Avera to developing seamless mobile experiences at FlowSpy, my focus is always on the intersection of human-centric design and powerful performance.
                            </motion.p>
                        </div>

                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.5 }}
                            className="mt-12 grid grid-cols-3 gap-6"
                        >
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">3+</span>
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
