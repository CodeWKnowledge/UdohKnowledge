import React from "react";
import { motion } from "framer-motion";

const Experience = () => {
    const experiences = [
        { date: "2024", role: "Freelance Developer", company: "Self-Employed", current: true },
        { date: "2024", role: "Co Founder & Frontend Developer", company: "FlowSpy", current: true },
        { date: "2025", role: "Frontend Developer", company: "Rutherking Educational Ventures", current: false },
        { date: "2025", role: "Frontend Developer", company: "Fincorex", current: true },
        { date: "2026", role: "Founder & CEO", company: "Avera Tech Solutions", current: true },
    ];

    const fadeInUp = {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const containerVariants = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    return (
        <section id="experience" className="py-24 bg-theme transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        {...fadeInUp}
                        className="flex items-center gap-4 mb-16"
                    >
                        <div className="w-12 h-px bg-primary/30"></div>
                        <h3 className="text-xl font-bold text-white/90 tracking-widest uppercase font-heading">Experience</h3>
                    </motion.div>

                    <div className="relative">
                        {/* Thin vertical line */}
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-white/5"></div>

                        <motion.div
                            variants={containerVariants}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            {experiences.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="relative pl-8 group"
                                >
                                    {/* Dot Node */}
                                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-white/10 group-hover:bg-primary group-hover:scale-125 transition-all duration-300 border border-theme"></div>

                                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                        <div className="flex flex-col">
                                            <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                                {item.role}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-theme/40 text-sm font-medium">at</span>
                                                <span className="text-primary/80 font-medium accent-font italic text-lg decoration-primary/20 hover:decoration-primary transition-all">
                                                    {item.company}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
                                            <span className="text-white/20 text-sm font-bold tracking-tighter uppercase">
                                                {item.date}
                                            </span>
                                            {item.current && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(126,34,206,0.6)]"></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subtle hover line highlight */}
                                    <div className="absolute left-[-1px] top-4 bottom-[-32px] w-px bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500 hidden sm:block"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;

