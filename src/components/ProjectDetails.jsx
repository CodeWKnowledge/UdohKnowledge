import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { GithubIcon, ArrowRight01Icon, ArrowLeft01Icon, Share01Icon } from "hugeicons-react";
import { projectsData as staticProjects } from "../data/projectsData";
import { motion } from "framer-motion";
import { useSupabase } from "../context/SupabaseContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const { projects } = useSupabase();

    const dataToUse = projects && projects.length > 0 ? projects : staticProjects;

    const currentIndex = useMemo(() => {
        return dataToUse.findIndex(p => p.id.toString() === id.toString());
    }, [id, dataToUse]);

    const project = dataToUse[currentIndex];

    const prevProject = currentIndex > 0 ? dataToUse[currentIndex - 1] : null;
    const nextProject = currentIndex < dataToUse.length - 1 ? dataToUse[currentIndex + 1] : null;

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const revealOnScroll = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-theme-bg p-6">
                <h1 className="text-4xl font-bold text-white mb-6 font-heading">Project Not Found</h1>
                <Link to="/" className="text-primary hover:text-secondary flex items-center gap-2 font-bold transition-all">
                    <ArrowLeft01Icon size={20} />
                    <span>Back to Home</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-bg pt-32 pb-24 selection:bg-primary/30">
            <div className="container mx-auto px-6">
                {/* Header Navigation */}
                <motion.div
                    {...fadeInUp}
                    className="flex justify-between items-center mb-16"
                >
                    <Link to="/" className="group flex items-center gap-2 text-theme font-semibold hover:text-primary transition-all">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                            <ArrowLeft01Icon size={20} />
                        </div>
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex gap-4">
                        {(project.githubUrl || project.github_url) && (
                            <a href={project.githubUrl || project.github_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all">
                                <GithubIcon size={20} />
                            </a>
                        )}
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all">
                            <Share01Icon size={20} />
                        </button>
                    </div>
                </motion.div>

                {/* Hero Section */}
                <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-20"></div>
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-xl">
                            <img
                                src={project.image_url || project.image}
                                alt={project.title}
                                className="w-full object-cover aspect-video"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold text-white font-heading leading-tight italic">
                            {project.title}
                        </h1>
                        <p className="text-lg md:text-xl text-theme/90 font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                            {project.description}
                        </p>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    {...revealOnScroll}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-16"
                >
                    {/* Left: Project Narrative */}
                    <div className="order-2 lg:order-1 lg:col-span-7 space-y-20">
                        <section className="space-y-8">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold">Project Overview</h2>
                            <div className="space-y-6 text-xl text-theme/70 leading-relaxed font-light">
                                <p>{project.details || project.description}</p>
                            </div>
                        </section>

                        {project.technologies && project.technologies.length > 0 && (
                            <section className="space-y-8">
                                <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold">Technologies Used</h2>
                                <div className="flex flex-wrap gap-3">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-primary/30 transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right: Project Meta */}
                    <div className="order-1 lg:order-2 lg:col-span-5 space-y-10">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-y-10">
                                {project.date && (
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Date</h4>
                                        <p className="text-white font-medium text-lg">{project.date}</p>
                                    </div>
                                )}
                                {project.type && (
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Type</h4>
                                        <p className="text-white font-medium text-lg">{project.type}</p>
                                    </div>
                                )}
                                {project.client && (
                                    <div className="space-y-2 col-span-2">
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Client</h4>
                                        <p className="text-white font-medium text-lg">{project.client}</p>
                                    </div>
                                )}
                            </div>

                            <a
                                href={project.live_url || project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm tracking-[0.2em] uppercase hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
                            >
                                <span>Visit Project</span>
                                <Share01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Footer */}
                <motion.div
                    {...revealOnScroll}
                    className="mt-40 pt-20 border-t border-white/5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                        {prevProject ? (
                            <Link to={`/project/${prevProject.id}`} className="group flex flex-col items-start gap-3 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all">
                                <span className="text-xs uppercase tracking-[0.3em] text-theme/40 font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <ArrowLeft01Icon size={16} /> Previous Project
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors font-heading leading-tight italic">
                                    {prevProject.title}
                                </h3>
                            </Link>
                        ) : <div className="hidden md:block" />}

                        {nextProject ? (
                            <Link to={`/project/${nextProject.id}`} className="group flex flex-col items-end gap-3 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all text-right">
                                <span className="text-xs uppercase tracking-[0.3em] text-theme/40 font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    Next Project <ArrowRight01Icon size={16} />
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors font-heading leading-tight italic">
                                    {nextProject.title}
                                </h3>
                            </Link>
                        ) : <div className="hidden md:block" />}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectDetails;

