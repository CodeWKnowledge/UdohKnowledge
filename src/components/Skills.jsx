import React from "react";
import { motion } from "framer-motion";

const Skills = () => {
    const skillGroups = [
        ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS", "Responsive Design"],
        ["Framer Motion", "Shadcn UI", "Bootstrap", "Git & GitHub", "Vite", "Figma"],
        ["Vercel", "Netlify", "Pxxl", "VS Code", "UI/UX Design", "Performance Optimization", "API Integration", "State Management", "Testing"]
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <section id="skills" className="py-24 bg-accent/30 overflow-hidden border-y border-theme-border/20">
            <div className="container mx-auto px-6 mb-16 text-center">
                <motion.div {...fadeInUp}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-white">Core Competencies</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-8"></div>
                    <p className="max-w-2xl mx-auto text-lg text-theme opacity-70">
                        A dynamic showcase of my technical toolkit and professional strengths.
                    </p>
                </motion.div>
            </div>

            <div className="flex flex-col gap-6">
                {skillGroups.map((row, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                        className="relative flex whitespace-nowrap"
                    >
                        {/* Edge Fades */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-theme-bg/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-theme-bg/80 to-transparent z-10 pointer-events-none"></div>

                        <div className={`flex gap-4 ${idx % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'} hover:[animation-play-state:paused] w-max`}>
                            {/* Duplicate set 4 times to ensure no gaps on any screen size */}
                            {[...row, ...row, ...row, ...row].map((skill, sIdx) => (
                                <div
                                    key={sIdx}
                                    className="px-8 py-4 bg-card/40 text-theme border border-theme-border/30 rounded-2xl text-lg font-medium hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-default flex-shrink-0"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;

