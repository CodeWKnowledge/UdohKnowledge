import React from "react";
import { GithubIcon, Linkedin01Icon, NewTwitterIcon, TiktokIcon } from "hugeicons-react";
import { useSupabase } from "../context/SupabaseContext";

const Footer = () => {
    const { settings } = useSupabase();

    const socialLinks = [
        { name: "GitHub", icon: <GithubIcon size={22} />, link: settings?.social_links?.github || "https://github.com/CODEWKNOWLEDGE" },
        { name: "LinkedIn", icon: <Linkedin01Icon size={22} />, link: settings?.social_links?.linkedin || "https://www.linkedin.com/in/knowledge54/" },
        { name: "Twitter X", icon: <NewTwitterIcon size={22} />, link: settings?.social_links?.twitter || "https://x.com/CodeWKnowledge" },
        { name: "TikTok", icon: <TiktokIcon size={22} />, link: settings?.social_links?.tiktok || "https://www.tiktok.com/@codewithknowledge" }
    ];

    return (
        <footer className="py-16 bg-theme-bg border-t border-white/5 transition-all duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <a href="#hero" className="text-3xl font-bold text-primary font-logo tracking-tight hover:text-secondary transition-colors">
                            {settings?.site_name || "CodeW/Knowledge✦"}
                        </a>

                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">Connect Everywhere</h4>
                        <div className="flex items-center gap-5">
                            {socialLinks.map((social, idx) => (
                                <a
                                    href={social.link}
                                    key={idx}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-theme/70 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-xl"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-theme/40 text-[13px] font-medium tracking-wide">
                    <p className="font-logo">© {new Date().getFullYear()} {settings?.site_name || "Knowledge Udoh"}.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

