import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ModelSelector from './ModelSelector';

function Header() {
    return (
        <header className="sticky top-0 z-50 liquid-glass border-b border-blue-500/20">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse-glow"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-2xl">
                                {/* Custom Logo SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
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
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-gradient-animated">
                                LanSoft Dev
                            </h1>
                            <p className="text-xs text-slate-400 hidden sm:block font-medium">
                                Next-gen development platform
                            </p>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-4">
                        <ModelSelector />
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2 liquid-glass px-4 py-2 rounded-full text-emerald-400 font-semibold border border-emerald-500/30 hover-lift">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <Zap className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm">AI Ready</span>
                        </div>

                        {/* Theme Toggle */}
                        <button className="liquid-glass hover-lift p-2 rounded-xl border border-slate-700/50">
                            <Sparkles className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;