import React from 'react';
import { Code, Sparkles, Zap } from 'lucide-react';
import ModelSelector from './ModelSelector';

function Header() {
    return (
        <header className="sticky top-0 z-50 liquid-glass border-b border-blue-500/20">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse-glow"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-2xl">
                                <Code className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-gradient-animated">
                                AI Code Builder
                            </h1>
                            <p className="text-sm text-slate-400 hidden sm:block font-medium">
                                Next-gen development platform
                            </p>
                        </div>
                    </div>

                    {/* Center Navigation - Hidden on mobile */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm font-semibold relative group">
                            Projects
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm font-semibold relative group">
                            Templates
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm font-semibold relative group">
                            Docs
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </nav>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-6">
                        <ModelSelector />
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-3 liquid-glass px-6 py-3 rounded-full text-emerald-400 font-semibold border border-emerald-500/30 hover-lift">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                            <Zap className="h-5 w-5" />
                            <span className="hidden sm:inline">AI Ready</span>
                        </div>

                        {/* Theme Toggle */}
                        <button className="liquid-glass hover-lift p-3 rounded-xl border border-slate-700/50">
                            <Sparkles className="h-6 w-6 text-slate-400 hover:text-blue-400 transition-colors duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;