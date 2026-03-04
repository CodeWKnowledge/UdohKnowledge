import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { GithubIcon, ArrowRight01Icon, ArrowLeft01Icon, Share01Icon } from "hugeicons-react";
import { projectsData } from "../data/projectsData";

const ProjectDetails = () => {
    const { id } = useParams();

    const currentIndex = useMemo(() => {
        return projectsData.findIndex(p => p.id === parseInt(id));
    }, [id]);

    const project = projectsData[currentIndex];

    const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
    const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

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
                <div className="flex justify-between items-center mb-16 reveal active">
                    <Link to="/" className="group flex items-center gap-2 text-theme font-semibold hover:text-primary transition-all">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                            <ArrowLeft01Icon size={20} />
                        </div>
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex gap-4">
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all">
                                <GithubIcon size={20} />
                            </a>
                        )}
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all">
                            <Share01Icon size={20} />
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                {/* Hero Layout - More Compact Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 reveal active">


                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-20"></div>
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-xl">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full object-cover aspect-video"
                            />
                        </div>

                    </div>

                    <div className="space-y-6 -mt-32">
                        <h1 className="text-5xl font-bold text-white font-heading leading-tight italic">
                            {project.title}
                        </h1>
                        <p className="text-lg md:text-xl text-theme/90 font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                            {project.description}
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 reveal active">
                    {/* Left: Project Narrative */}
                    <div className="lg:col-span-7 space-y-20">
                        <section className="space-y-8">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold">Project Overview</h2>
                            <div className="space-y-6 text-xl text-theme/70 leading-relaxed font-light">
                                <p>{project.details}</p>
                            </div>
                        </section>

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
                    </div>

                    {/* Right: Project Meta */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-y-10">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Date</h4>
                                    <p className="text-white font-medium text-lg">{project.date}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Type</h4>
                                    <p className="text-white font-medium text-lg">{project.type}</p>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-theme/40 font-bold">Client</h4>
                                    <p className="text-white font-medium text-lg">{project.client}</p>
                                </div>
                            </div>

                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm tracking-[0.2em] uppercase hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
                            >
                                <span>Visit Project</span>
                                <Share01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="mt-40 pt-20 border-t border-white/5 reveal active">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        {prevProject ? (
                            <Link to={`/project/${prevProject.id}`} className="group flex flex-col items-start gap-4 max-w-xs">
                                <span className="text-xs uppercase tracking-[0.3em] text-theme/40 font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <ArrowLeft01Icon size={14} /> Previous
                                </span>
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors font-heading leading-tight italic">
                                    {prevProject.title}
                                </h3>
                            </Link>
                        ) : <div />}

                        {nextProject ? (
                            <Link to={`/project/${nextProject.id}`} className="group flex flex-col items-end gap-4 text-right max-w-xs">
                                <span className="text-xs uppercase tracking-[0.3em] text-theme/40 font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    Next <ArrowRight01Icon size={14} />
                                </span>
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors font-heading leading-tight italic">
                                    {nextProject.title}
                                </h3>
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
