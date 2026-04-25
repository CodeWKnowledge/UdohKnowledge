import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] mt-20 flex flex-col items-center justify-center relative overflow-hidden py-20 px-6">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <div className="inline-block mb-4">
          <span className="text-8xl md:text-9xl font-black bg-gradient-to-br from-primary via-white to-white/50 text-transparent bg-clip-text font-heading">
            404
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Looks like you're lost in the void.
        </h1>
        
        <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="group relative px-8 py-3.5 bg-primary text-white font-bold rounded-xl overflow-hidden shadow-[0_0_40px_rgba(126,34,206,0.3)] hover:shadow-[0_0_60px_rgba(126,34,206,0.5)] transition-all active:scale-95 w-full sm:w-auto flex justify-center items-center gap-2"
          >
            <span className="relative z-10">Return to Homepage</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          </Link>
          
          <Link 
            to="/#contact" 
            className="px-8 py-3.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 font-bold rounded-xl transition-all active:scale-95 w-full sm:w-auto"
          >
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
