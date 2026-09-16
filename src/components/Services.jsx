import React from "react";
import { motion } from "framer-motion";
import { useSupabase } from "../context/SupabaseContext";
import { 
    SoftwareIcon, 
    WebDesign01Icon, 
    TouchInteraction02Icon, 
    GlobalSearchIcon,
    LeftToRightListDashIcon 
} from "hugeicons-react";

const Services = () => {
    const { content } = useSupabase();
    const services = [
        {
            title: content?.service1_title || "Frontend Development",
            description: content?.service1_description || "Custom-built, high-performance web applications using modern frameworks like React and Next.js for optimal user experience.",
            icon: <WebDesign01Icon className="text-primary" />,
            keywords: ["React.js", "Next.js", "Performance"]
        },
        {
            title: content?.service2_title || "Full-Stack Architecture",
            description: content?.service2_description || "Robust end-to-end solutions integrating scalable frontends with powerful backend services and APIs.",
            icon: <SoftwareIcon className="text-secondary" />,
            keywords: ["API Integration", "Supabase", "Scalable"]
        },
        {
            title: content?.service3_title || "Mobile App Development",
            description: content?.service3_description || "Creating seamless, high-performance mobile applications for both iOS and Android using React Native and other mobile app development technologies.",
            icon: <TouchInteraction02Icon className="text-primary" />,
            keywords: ["React Native", "Flutter", "Mobile Development"]
        },
        {
            title: content?.service4_title || "Backend Development",
            description: content?.service4_description || "Developing robust and scalable backend systems using Node.js, Express, and other backend technologies.",
            icon: <GlobalSearchIcon className="text-secondary" />,
            keywords: ["Node.js", "Express", "Backend Development"]
        }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <section id="services" className="py-24 bg-theme-bg relative overflow-hidden">
            {/* Prismatic decoration */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] -translate-y-1/2 -z-10"></div>
            
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
                    <motion.div {...fadeInUp} className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-[1px] bg-primary/40"></span>
                            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[9px]">What I Do</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-theme font-heading leading-tight italic">
                            { ""}
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group p-6 rounded-2xl bg-card border border-theme-border hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-theme-border/50 border border-theme-border group-hover:border-primary/30 transition-colors">
                                    {React.cloneElement(service.icon, { size: 24 })}
                                </div>
                                <h3 className="text-xl font-bold text-theme group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                            </div>

                            <p className="text-theme-muted leading-relaxed font-light text-sm mb-4">
                                {service.description}
                            </p>

                            <div className="flex gap-3">
                                {service.keywords.slice(0, 2).map((word, i) => (
                                    <span key={i} className="text-[9px] text-theme-muted uppercase tracking-[0.1em] font-medium group-hover:text-theme/70 transition-colors">
                                        • {word}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
