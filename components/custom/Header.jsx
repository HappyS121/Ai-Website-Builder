import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ModelSelector from './ModelSelector';

function Header() {
    return (
        <header className="sticky top-0 z-50 liquid-glass border-b border-blue-500/20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-10">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-2">
                        <div className="relative group">
                            {/* Logo fără fundal pătrat */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24" className="animate-pulse-glow">
                                {/* Blocurile colorate aranjate conform imaginii atașate */}
                                {/* Rândul 1 (de jos) */}
                                <rect x="1.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#E74C3C" />
                                {/* Rândul 2 */}
                                <rect x="1.5" y="7.5" width="2.5" height="2.5" rx="0.5" fill="#F1C40F" />
                                <rect x="5" y="7.5" width="2.5" height="2.5" rx="0.5" fill="#27AE60" />
                                {/* Rândul 3 */}
                                <rect x="1.5" y="4" width="2.5" height="2.5" rx="0.5" fill="#F39C12" />
                                <rect x="5" y="4" width="2.5" height="2.5" rx="0.5" fill="#2ECC71" />
                                <rect x="8.5" y="4" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                                {/* Rândul 4 (de sus) */}
                                <rect x="5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#2ECC71" />
                                <rect x="8.5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                                <rect x="12" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#3498DB" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black text-white">
                                LanSoft Dev
                            </h1>
                            <p className="text-xs text-slate-400 hidden sm:block font-medium leading-none">
                                Next-gen development platform
                            </p>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-3">
                        <ModelSelector />
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-1 liquid-glass px-3 py-1 rounded-full text-emerald-400 font-semibold border border-emerald-500/30 hover-lift">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <Zap className="h-3 w-3" />
                            <span className="hidden sm:inline text-xs">AI Ready</span>
                        </div>

                        {/* Theme Toggle */}
                        <button className="liquid-glass hover-lift p-1.5 rounded-lg border border-slate-700/50">
                            <Sparkles className="h-4 w-4 text-slate-400 hover:text-blue-400 transition-colors duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;