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
                className="flex items-center gap-3 glass-morphism hover:bg-slate-800/70 border border-slate-600/50 hover:border-blue-500/30 rounded-xl px-4 py-3 text-sm text-slate-300 transition-all duration-300 group"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                            {currentModelInfo.name}
                        </div>
                        <div className="text-xs text-slate-400">
                            {currentModelInfo.provider}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-400 group-hover:text-blue-400`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 glass-morphism border border-slate-600/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-400" />
                            <span className="text-white font-semibold">AI Models</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Choose your AI assistant</p>
                    </div>

                    {/* Model List */}
                    <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
                        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                            <button
                                key={key}
                                onClick={() => handleModelSelect(model.key)}
                                className={`w-full text-left p-4 rounded-xl text-sm transition-all duration-300 group ${
                                    selectedModel === model.key
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            selectedModel === model.key
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                : 'bg-slate-700 group-hover:bg-slate-600'
                                        }`}>
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{model.name}</div>
                                            <div className="text-xs text-slate-400">{model.provider}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {model.provider === 'OpenRouter' && (
                                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                                                Free
                                            </span>
                                        )}
                                        {selectedModel === model.key && (
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Model Features */}
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {model.provider === 'Google' && (
                                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Fast</span>
                                    )}
                                    {model.provider === 'OpenRouter' && (
                                        <>
                                            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">Advanced</span>
                                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Free Tier</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
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