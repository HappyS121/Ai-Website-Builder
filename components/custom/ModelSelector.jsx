"use client"
import React from 'react';
import { ChevronDown, Bot, Cpu } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/configs/AiModel';
import { useModel } from '@/context/ModelContext';

function ModelSelector({ type = 'chat' }) {
    const { selectedModel, setSelectedModel, selectedCodeModel, setSelectedCodeModel } = useModel();
    const [isOpen, setIsOpen] = React.useState(false);
    
    const currentModel = type === 'chat' ? selectedModel : selectedCodeModel;
    const setCurrentModel = type === 'chat' ? setSelectedModel : setSelectedCodeModel;
    
    const handleModelSelect = (modelKey) => {
        setCurrentModel(modelKey);
        setIsOpen(false);
    };

    const getCurrentModelInfo = () => {
        return Object.values(AVAILABLE_MODELS).find(model => model.key === currentModel) || AVAILABLE_MODELS.GEMINI;
    };

    const currentModelInfo = getCurrentModelInfo();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors duration-200"
            >
                {type === 'chat' ? <Bot className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
                <span className="font-medium">{currentModelInfo.name}</span>
                <span className="text-xs text-gray-500">({currentModelInfo.provider})</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                        <div className="text-xs text-gray-400 px-2 py-1 font-medium">
                            {type === 'chat' ? 'Chat Models' : 'Code Generation Models'}
                        </div>
                        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                            <button
                                key={key}
                                onClick={() => handleModelSelect(model.key)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                    currentModel === model.key
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{model.name}</div>
                                        <div className="text-xs text-gray-500">{model.provider}</div>
                                    </div>
                                    {model.provider === 'OpenRouter' && (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModelSelector;