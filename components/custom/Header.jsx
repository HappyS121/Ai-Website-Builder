import React from 'react';
import { Code, Sparkles, Zap } from 'lucide-react';
import ModelSelector from './ModelSelector';

function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                                <Code className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-gradient-primary">
                                AI Code Builder
                            </h1>
                            <p className="text-xs text-slate-400 hidden sm:block">
                                Next-gen development platform
                            </p>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-4">
                        <ModelSelector />
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <Zap className="h-4 w-4" />
                            <span className="hidden sm:inline">AI Ready</span>
                        </div>

                        {/* Theme Toggle - Future enhancement */}
                        <button className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <Sparkles className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;