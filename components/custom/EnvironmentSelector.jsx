"use client"
import React from 'react';
import { ChevronDown, Code, Globe } from 'lucide-react';
import { DEVELOPMENT_ENVIRONMENTS, useEnvironment } from '@/context/EnvironmentContext';

function EnvironmentSelector() {
    const { selectedEnvironment, setSelectedEnvironment } = useEnvironment();
    const [isOpen, setIsOpen] = React.useState(false);
    
    const handleEnvironmentSelect = (envKey) => {
        setSelectedEnvironment(envKey);
        setIsOpen(false);
    };

    const getCurrentEnvironmentInfo = () => {
        return Object.values(DEVELOPMENT_ENVIRONMENTS).find(env => env.key === selectedEnvironment) || DEVELOPMENT_ENVIRONMENTS.REACT;
    };

    const currentEnvInfo = getCurrentEnvironmentInfo();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-gray-900/60 hover:bg-gray-800/60 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white transition-all duration-300 hover:border-blue-500/60 min-w-[200px]"
            >
                <span className="text-xl">{currentEnvInfo.icon}</span>
                <div className="flex-1 text-left">
                    <div className="font-medium text-blue-400">{currentEnvInfo.name}</div>
                    <div className="text-xs text-gray-400">{currentEnvInfo.description}</div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl shadow-lg z-50">
                    <div className="p-2">
                        <div className="text-xs text-blue-400 px-3 py-2 font-medium">
                            Development Environment
                        </div>
                        {Object.entries(DEVELOPMENT_ENVIRONMENTS).map(([key, env]) => (
                            <button
                                key={key}
                                onClick={() => handleEnvironmentSelect(env.key)}
                                className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                                    selectedEnvironment === env.key
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'text-gray-300 hover:bg-gray-800/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{env.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium">{env.name}</div>
                                        <div className="text-xs text-gray-500 mb-1">{env.description}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {env.features.map((feature, index) => (
                                                <span key={index} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EnvironmentSelector;