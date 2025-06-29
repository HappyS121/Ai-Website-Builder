"use client"
import React from 'react';
import { ChevronDown, Bot, Zap, Star } from 'lucide-react';
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
                className="flex items-center gap-2 glass-morphism hover:bg-slate-800/70 border border-slate-600/50 hover:border-blue-500/30 rounded-lg px-2.5 py-1 text-xs text-slate-300 transition-all duration-300 group"
            >
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200 text-xs leading-tight">
                            {currentModelInfo.name}
                        </div>
                        <div className="text-xs text-slate-400 leading-none">
                            {currentModelInfo.provider}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-400 group-hover:text-blue-400`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-72 glass-morphism border border-slate-600/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Compact Header */}
                    <div className="p-3 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-semibold text-sm">AI Models</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Choose your assistant</p>
                    </div>

                    {/* Compact Model List */}
                    <div className="p-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                            <button
                                key={key}
                                onClick={() => handleModelSelect(model.key)}
                                className={`w-full text-left p-3 rounded-lg text-xs transition-all duration-300 group ${
                                    selectedModel === model.key
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            selectedModel === model.key
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                : 'bg-slate-700 group-hover:bg-slate-600'
                                        }`}>
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{model.name}</div>
                                            <div className="text-xs text-slate-400">{model.provider}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5">
                                        {model.provider === 'OpenRouter' && (
                                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                                                Free
                                            </span>
                                        )}
                                        {selectedModel === model.key && (
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Compact Model Features */}
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {model.provider === 'Google' && (
                                        <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">Fast</span>
                                    )}
                                    {model.provider === 'OpenRouter' && (
                                        <>
                                            <span className="text-xs bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">Advanced</span>
                                            <span className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">Free</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Compact Footer */}
                    <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Star className="h-3 w-3" />
                            <span>All models support code generation</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModelSelector;