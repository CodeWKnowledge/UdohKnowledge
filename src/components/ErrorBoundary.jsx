import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080110] flex flex-col items-center justify-center p-6 text-center font-[Inter]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          </div>
          
          <div className="relative z-10 max-w-md">
            <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4 font-heading">Something went wrong</h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data is safe. Try refreshing the page or head back to the home screen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105 transition-all"
              >
                Refresh Page
              </button>
              <a 
                href="/"
                className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all"
              >
                Go Home
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-12 p-4 bg-black/40 border border-white/5 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-red-400 font-mono text-xs mb-2 uppercase tracking-widest font-bold">Error Detail:</p>
                <code className="text-white/40 text-xs font-mono">{this.state.error?.toString()}</code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
