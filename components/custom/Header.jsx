import React from 'react';
import { Code, Sparkles, Zap } from 'lucide-react';
import ModelSelector from './ModelSelector';

function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-10">
                    {/* Logo and Title - Compact */}
                    <div className="flex items-center space-x-2">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-md">
                                <Code className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold text-gradient-primary leading-tight">
                                AI Code Builder
                            </h1>
                            <p className="text-xs text-slate-400 hidden sm:block leading-none">
                                Next-gen platform
                            </p>
                        </div>
                    </div>

                    {/* Right Side Controls - Ultra Compact */}
                    <div className="flex items-center space-x-2">
                        <ModelSelector />
                        
                        {/* Ultra Compact Status Indicator */}
                        <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                            <Zap className="h-2.5 w-2.5" />
                            <span className="hidden sm:inline">Ready</span>
                        </div>

                        {/* Ultra Compact Theme Toggle */}
                        <button className="p-1 rounded-md bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <Sparkles className="h-3.5 w-3.5 text-slate-400 hover:text-blue-400 transition-colors duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;