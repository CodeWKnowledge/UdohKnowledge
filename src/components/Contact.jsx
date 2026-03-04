import React, { useState } from "react";
import { Mail01Icon, CallIcon, Location01Icon, MailSend02Icon, ArrowRight01Icon, Tick01Icon, AlertCircleIcon } from "hugeicons-react";

const Contact = () => {
    const [status, setStatus] = useState("idle"); // idle, sending, success, error
    const [result, setResult] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");

        const formData = new FormData(e.target);

        formData.append("access_key", "321a91fe-e5a9-4f47-83b8-cf02761b698f");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setResult("Message sent successfully!");
                e.target.reset();
            } else {
                console.error("Error", data);
                setStatus("error");
                setResult(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submit error", error);
            setStatus("error");
            setResult("Failed to send message. Please check your connection.");
        }
    };

    return (
        <section id="contact" className="py-28 bg-theme-bg relative overflow-hidden transition-colors duration-500">
            {/* Minimal Background Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16 reveal active">
                        <span className="text-secondary accent-font text-lg mb-2 block">Ready to talk?</span>
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 font-heading text-white italic">Get In Touch</h2>
                        <p className="text-base md:text-lg text-theme/50 font-light leading-relaxed">
                            Have a vision you want to bring to life? Let's collaborate and build something extraordinary together.
                        </p>
                    </div>

                    {/* Minimalist Contact Form */}
                    <div className="reveal active">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-theme/20 shadow-inner"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-theme/20 shadow-inner"
                                    required
                                />
                            </div>
                            <textarea
                                name="message"
                                rows="5"
                                placeholder="Tell me about your project..."
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-theme/20 resize-none shadow-inner"
                                required
                            ></textarea>

                            <div className="flex flex-col items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    className={`group relative px-12 py-4 font-bold rounded-2xl transition-all overflow-hidden active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 w-full md:w-auto
                                        ${status === "sending" ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-primary text-white shadow-primary/20 hover:scale-[1.02]"}`}
                                >
                                    <span className="relative z-10">
                                        {status === "sending" ? "Sending..." : "Send Message"}
                                    </span>
                                    {status !== "sending" && <ArrowRight01Icon size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />}
                                </button>

                                {status === "success" && (
                                    <div className="flex items-center gap-2 text-green-400 font-medium py-2 reveal active">
                                        <Tick01Icon size={20} />
                                        <span>{result}</span>
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="flex items-center gap-2 text-red-400 font-medium py-2 reveal active">
                                        <AlertCircleIcon size={20} />
                                        <span>{result}</span>
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Ultra-Minimalist Contact Footer */}
                        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-x-10 gap-y-4">
                            {[
                                { icon: <Mail01Icon size={16} />, content: "udohknowledge5@gmail.com", link: "mailto:udohknowledge5@gmail.com" },
                                { icon: <CallIcon size={16} />, content: "+234 703 754 1754", link: "tel:+2347037541754" },
                                { icon: <Location01Icon size={16} />, content: "Port Harcourt, Nigeria", link: "#" }
                            ].map((item, idx) => (
                                <a
                                    href={item.link}
                                    key={idx}
                                    className="flex items-center gap-2.5 text-theme/30 hover:text-primary transition-colors text-[13px] font-medium tracking-wide"
                                >
                                    <span className="text-primary/50">{item.icon}</span>
                                    <span>{item.content}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
