"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Sparkles, Send, Wand2, Loader2, Code, Globe, Zap, Star } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
    const [userInput, setUserInput] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [selectedEnvironment, setSelectedEnvironment] = useState('react');
    const [particles, setParticles] = useState([]);
    const { messages, setMessages } = useContext(MessagesContext);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    // Generate floating particles
    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 50; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    delay: Math.random() * 6,
                    duration: 3 + Math.random() * 4
                });
            }
            setParticles(newParticles);
        };
        generateParticles();
    }, []);

    const environments = [
        {
            id: 'react',
            name: 'React',
            icon: Code,
            description: 'Modern React with Vite & TypeScript',
            color: 'from-blue-500 via-blue-600 to-cyan-500',
            features: ['Components', 'Hooks', 'State Management', 'Routing']
        },
        {
            id: 'html',
            name: 'HTML',
            icon: Globe,
            description: 'Pure HTML/CSS/JavaScript',
            color: 'from-orange-500 via-red-500 to-pink-500',
            features: ['Semantic HTML', 'Modern CSS', 'Vanilla JS', 'Responsive']
        }
    ];

    const onGenerate = async (input) => {
        const msg = {
            role: 'user',
            content: input,
            environment: selectedEnvironment
        }
        setMessages(msg);
        const workspaceID = await CreateWorkspace({
            messages: [msg],
            environment: selectedEnvironment
        });
        router.push('/workspace/' + workspaceID);
    }

    const enhancePrompt = async () => {
        if (!userInput) return;
        
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: userInput,
                    environment: selectedEnvironment
                }),
            });

            const data = await response.json();
            if (data.enhancedPrompt) {
                setUserInput(data.enhancedPrompt);
            }
        } catch (error) {
            console.error('Error enhancing prompt:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const onSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    const getSuggestionsForEnvironment = () => {
        return selectedEnvironment === 'react' 
            ? Lookup.SUGGESTIONS.REACT 
            : Lookup.SUGGESTIONS.HTML;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 grid-pattern opacity-20"></div>
                
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Floating Particles */}
                <div className="particles">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="particle"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-16">
                    {/* Hero Header */}
                    <div className="text-center space-y-8 max-w-4xl">
                        {/* Badge */}
                        <div className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full px-6 py-3 border border-blue-500/30 backdrop-blur-sm hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300">
                            <Star className="h-5 w-5 text-blue-400 animate-spin-slow" />
                            <span className="text-blue-400 text-sm font-semibold tracking-wide uppercase">
                                Next-Gen AI Development
                            </span>
                            <Zap className="h-5 w-5 text-cyan-400" />
                        </div>

                        {/* Main Title */}
                        <h1 className="text-6xl md:text-8xl font-black leading-tight">
                            <span className="block text-gradient animate-gradient">
                                Build the
                            </span>
                            <span className="block text-gradient animate-gradient" style={{animationDelay: '0.5s'}}>
                                Future
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Transform your ideas into production-ready applications with 
                            <span className="neon-blue font-semibold"> AI-powered </span>
                            development tools
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold neon-blue">10K+</div>
                                <div className="text-sm text-slate-400">Projects Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold neon-turquoise">99%</div>
                                <div className="text-sm text-slate-400">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold neon-cyan">5min</div>
                                <div className="text-sm text-slate-400">Average Build</div>
                            </div>
                        </div>
                    </div>

                    {/* Environment Selector */}
                    <div className="w-full max-w-4xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-3">Choose Your Stack</h3>
                            <p className="text-slate-400">Select the perfect technology for your vision</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {environments.map((env) => {
                                const IconComponent = env.icon;
                                const isSelected = selectedEnvironment === env.id;
                                
                                return (
                                    <div
                                        key={env.id}
                                        onClick={() => setSelectedEnvironment(env.id)}
                                        className={`group relative cursor-pointer transition-all duration-500 hover-lift ${
                                            isSelected ? 'scale-105' : 'hover:scale-102'
                                        }`}
                                    >
                                        {/* Glow Effect */}
                                        {isSelected && (
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse-glow"></div>
                                        )}
                                        
                                        {/* Card */}
                                        <div className={`relative card-modern p-8 ${
                                            isSelected 
                                                ? 'border-blue-500/50 bg-slate-800/70' 
                                                : 'hover:border-slate-600/50'
                                        }`}>
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${env.color} shadow-lg`}>
                                                        <IconComponent className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-white">{env.name}</h4>
                                                        <p className="text-slate-400">{env.description}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Selection Indicator */}
                                                <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                                    isSelected 
                                                        ? 'border-blue-500 bg-blue-500' 
                                                        : 'border-slate-600 group-hover:border-slate-500'
                                                }`}>
                                                    {isSelected && (
                                                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {env.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                                                        <span className="text-sm text-slate-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shimmer Effect */}
                                            <div className="shimmer-effect absolute inset-0 rounded-2xl"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="w-full max-w-4xl">
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                            
                            {/* Main Container */}
                            <div className="relative glass-morphism rounded-2xl p-8">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Text Area */}
                                    <div className="flex-1">
                                        <textarea
                                            placeholder={`Describe your ${selectedEnvironment.toUpperCase()} project vision...`}
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            className="w-full h-40 bg-slate-800/50 border-2 border-slate-600/50 rounded-xl p-6 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-lg resize-none transition-all duration-300 backdrop-blur-sm"
                                            disabled={isEnhancing}
                                        />
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex lg:flex-col gap-4">
                                        {userInput && (
                                            <>
                                                <button
                                                    onClick={enhancePrompt}
                                                    disabled={isEnhancing}
                                                    className="btn-secondary flex items-center justify-center min-w-[120px] h-16 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isEnhancing ? (
                                                        <Loader2 className="h-6 w-6 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Wand2 className="h-6 w-6 mr-2" />
                                                            <span className="hidden sm:inline">Enhance</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => onGenerate(userInput)}
                                                    disabled={isEnhancing}
                                                    className="btn-primary flex items-center justify-center min-w-[120px] h-16 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="h-6 w-6 mr-2" />
                                                    <span className="hidden sm:inline">Generate</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions Grid */}
                    <div className="w-full max-w-6xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {selectedEnvironment === 'react' ? 'React Inspirations' : 'HTML Templates'}
                            </h3>
                            <p className="text-slate-400">Click any idea to get started instantly</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getSuggestionsForEnvironment().map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative p-6 card-modern text-left hover-lift"
                                >
                                    {/* Icon */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <Code className="h-5 w-5 text-white" />
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
                                    </div>
                                    
                                    {/* Content */}
                                    <h4 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-200">
                                        {suggestion}
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Ready-to-use {selectedEnvironment} template
                                    </p>

                                    {/* Shimmer Effect */}
                                    <div className="shimmer-effect absolute inset-0 rounded-2xl"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;