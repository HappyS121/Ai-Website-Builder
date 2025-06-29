"use client"
import React from 'react';
import { ChevronDown, Bot, Zap, Star, Sparkles } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/configs/AiModel';
import { useModel } from '@/context/ModelContext';

function ModelSelector() {
    const { selectedModel, setSelectedModel } = useModel();
    const [isOpen, setIsOpen] = React.useState(false);
    
    const handleModelSelect = (modelKey) => {
        setSelectedModel(modelKey);
        setIsOpen(false);
    };

    const getCurrentModelInfo = () => {
        return Object.values(AVAILABLE_MODELS).find(model => model.key === selectedModel) || AVAILABLE_MODELS.GEMINI;
    };

    const currentModelInfo = getCurrentModelInfo();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 liquid-glass hover-lift border border-blue-500/30 rounded-2xl px-6 py-3 text-sm text-slate-300 transition-all duration-300 group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                            {currentModelInfo.name}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            {currentModelInfo.provider}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-400 group-hover:text-blue-400`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-96 liquid-glass border border-blue-500/30 rounded-3xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                        <div className="flex items-center gap-3">
                            <Zap className="h-6 w-6 text-blue-400 animate-pulse" />
                            <span className="text-white font-bold text-lg">AI Models</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2 font-medium">Choose your AI assistant</p>
                    </div>

                    {/* Model List */}
                    <div className="p-3 max-h-80 overflow-y-auto custom-scrollbar">
                        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                            <button
                                key={key}
                                onClick={() => handleModelSelect(model.key)}
                                className={`w-full text-left p-4 rounded-2xl text-sm transition-all duration-300 group mb-2 ${
                                    selectedModel === model.key
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-lg animate-pulse-glow'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white liquid-glass-hover'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            selectedModel === model.key
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse-glow'
                                                : 'bg-slate-700 group-hover:bg-slate-600'
                                        }`}>
                                            <Bot className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{model.name}</div>
                                            <div className="text-xs text-slate-400 font-medium">{model.provider}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {model.provider === 'OpenRouter' && (
                                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
                                                Free
                                            </span>
                                        )}
                                        {selectedModel === model.key && (
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Model Features */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {model.provider === 'Google' && (
                                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-medium">Fast</span>
                                    )}
                                    {model.provider === 'OpenRouter' && (
                                        <>
                                            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded font-medium">Advanced</span>
                                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded font-medium">Free Tier</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-blue-500/20 liquid-glass">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Star className="h-4 w-4 animate-pulse" />
                            <span>All models support code generation</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModelSelector;