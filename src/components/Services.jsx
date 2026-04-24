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
            title: content?.service1_title || "Business Website Development",
            description: content?.service1_description || "Custom-built, high-performance websites tailored to your business goals. Scalable architecture that grows with your brand.",
            icon: <WebDesign01Icon className="text-primary" />,
            keywords: ["Web Agency", "Custom Development"]
        },
        {
            title: content?.service2_title || "E-commerce Solutions",
            description: content?.service2_description || "Seamless online shopping experiences with secure payment integration and intuitive product management systems.",
            icon: <SoftwareIcon className="text-secondary" />,
            keywords: ["Online Store", "Secure Payments"]
        },
        {
            title: content?.service3_title || "Personal Website Development",
            description: content?.service3_description || "Custom-built, high-performance websites tailored to your personal goals. Scalable architecture that grows with your brand.",
            icon: <TouchInteraction02Icon className="text-primary" />,
            keywords: ["Personal Site", "Brand Identity"]
        },
        {
            title: content?.service4_title || "Digital Agency Services",
            description: content?.service4_description || "End-to-end support from SEO strategy to web maintenance. We ensure your business is always visible and high-performing.",
            icon: <GlobalSearchIcon className="text-secondary" />,
            keywords: ["SEO Strategy", "Maintenance"]
        }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <section id="services" className="py-24 bg-[#05010a] relative overflow-hidden">
            {/* Prismatic decoration */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] -translate-y-1/2 -z-10"></div>
            
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
                    <motion.div {...fadeInUp} className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-[1px] bg-primary/40"></span>
                            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[9px]">Capabilities</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-heading leading-tight italic">
                            {content?.services_header_title || "Web Design & Development Services."}
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
                            className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                                    {React.cloneElement(service.icon, { size: 24 })}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                            </div>

                            <p className="text-white/40 leading-relaxed font-light text-sm mb-4">
                                {service.description}
                            </p>

                            <div className="flex gap-3">
                                {service.keywords.slice(0, 2).map((word, i) => (
                                    <span key={i} className="text-[9px] text-white/10 uppercase tracking-[0.1em] font-medium group-hover:text-white/30 transition-colors">
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
