import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GithubIcon, ArrowRight01Icon } from "hugeicons-react";
import { projectsData } from "../data/projectsData";
import { motion } from "framer-motion";

const Projects = ({ limit = 3 }) => {
    const [filter, setFilter] = useState("all");
    const [showAll, setShowAll] = useState(false);

    const filteredProjects = filter === "all"
        ? projectsData
        : projectsData.filter(project => project.category.includes(filter));

    // Determine which projects to display based on the 'limit' and 'showAll' state
    const currentLimit = showAll ? filteredProjects.length : limit;
    const displayedProjects = filteredProjects.slice(0, currentLimit);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
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

    const cardVariants = {
        initial: { opacity: 0, y: 30 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="projects" className="py-24 bg-theme transition-colors duration-300">
            <div className="container mx-auto px-6">
                <motion.div
                    {...fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading text-white">Featured Projects</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-theme/80 leading-relaxed">
                        A curated selection of my digital craftsmanship. From complex web apps to minimalist UI designs.
                    </p>
                </motion.div>

                <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.2 }}
                    className="flex justify-center mb-12"
                >
                    <div className="max-w-full overflow-x-auto pb-4 hide-scrollbar">
                        <div className="inline-flex bg-accent/50 backdrop-blur-md p-1 rounded-xl border border-white/5">
                            {["all", "E-commerce", "Web apps", "Dashboards", "Sales"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-lg transition-all duration-300 font-semibold text-xs uppercase tracking-widest whitespace-nowrap ${filter === cat
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "hover:bg-white/5 text-theme/60 hover:text-white"
                                        }`}
                                >
                                    {cat === "all" ? "All" : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayedProjects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: (idx % 3) * 0.1 }}
                            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden"
                        >
                            <Link to={`/project/${project.id}`}>
                                <div className="relative aspect-[4/3] overflow-hidden p-4 pb-0">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-top rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-4 rounded-xl bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                                        <h3 className="text-white font-bold text-2xl mb-4 font-heading">{project.title}</h3>
                                        <p className="text-white/80 text-sm mb-8 leading-relaxed line-clamp-3">{project.description}</p>
                                        <span className="px-6 py-3 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <Link to={`/project/${project.id}`}>
                                        <h3 className="font-bold text-2xl text-white group-hover:text-primary transition-colors duration-300 font-heading">
                                            {project.title}
                                        </h3>
                                    </Link>
                                </div>
                                <p className="mb-8 text-theme/60 text-sm line-clamp-2 leading-relaxed h-10">
                                    {project.description}
                                </p>
                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <Link to={`/project/${project.id}`} className="text-primary hover:text-secondary flex items-center gap-2 font-bold text-sm transition-colors group/link">
                                        <span>Case Study</span>
                                        <ArrowRight01Icon size={18} className="group-hover/link:translate-x-1.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {!showAll && filteredProjects.length > limit && (
                    <motion.div
                        {...fadeInUp}
                        className="mt-20 text-center"
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-10 py-4 bg-white/5 border border-white/10 hover:border-primary/50 text-white font-bold rounded-2xl transition-all group active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            <span>Load More Projects</span>
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                                <ArrowRight01Icon size={20} className="text-primary group-hover:rotate-90 transition-transform" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;

