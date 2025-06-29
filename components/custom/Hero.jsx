"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Sparkles, Send, Wand2, Loader2, Code, Globe, Zap, Star, Rocket } from 'lucide-react';
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
            for (let i = 0; i < 30; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    delay: Math.random() * 8,
                    duration: 6 + Math.random() * 4
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
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-gradient-xy"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-gradient-xy" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-turquoise-500/10 rounded-full blur-2xl animate-gradient-x" style={{animationDelay: '4s'}}></div>
                
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
                    <div className="text-center space-y-8 max-w-5xl">
                        {/* Badge */}
                        <div className="inline-flex items-center justify-center space-x-3 liquid-glass rounded-full px-8 py-4 hover-lift shimmer-effect">
                            <Star className="h-6 w-6 text-blue-400 animate-spin-glow" />
                            <span className="text-blue-400 text-lg font-bold tracking-wide uppercase">
                                Next-Gen AI Development
                            </span>
                            <Zap className="h-6 w-6 text-cyan-400 animate-pulse" />
                        </div>

                        {/* Main Title */}
                        <h1 className="text-7xl md:text-9xl font-black leading-tight">
                            <span className="block text-gradient-animated text-glow animate-float">
                                Build the
                            </span>
                            <span className="block text-gradient-animated text-glow animate-float-delayed">
                                Future
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                            Transform your ideas into production-ready applications with 
                            <span className="text-gradient-animated font-semibold"> AI-powered </span>
                            development tools
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-12 mt-16">
                            <div className="text-center animate-float">
                                <div className="text-4xl font-black text-gradient-animated">10K+</div>
                                <div className="text-sm text-slate-400 font-medium">Projects Created</div>
                            </div>
                            <div className="text-center animate-float-delayed">
                                <div className="text-4xl font-black text-gradient-animated">99%</div>
                                <div className="text-sm text-slate-400 font-medium">Success Rate</div>
                            </div>
                            <div className="text-center animate-float">
                                <div className="text-4xl font-black text-gradient-animated">5min</div>
                                <div className="text-sm text-slate-400 font-medium">Average Build</div>
                            </div>
                        </div>
                    </div>

                    {/* Environment Selector */}
                    <div className="w-full max-w-5xl">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-white mb-4 text-glow">Choose Your Stack</h3>
                            <p className="text-slate-400 text-lg">Select the perfect technology for your vision</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {environments.map((env) => {
                                const IconComponent = env.icon;
                                const isSelected = selectedEnvironment === env.id;
                                
                                return (
                                    <div
                                        key={env.id}
                                        onClick={() => setSelectedEnvironment(env.id)}
                                        className={`group relative cursor-pointer transition-all duration-500 hover-lift ${
                                            isSelected ? 'scale-105' : ''
                                        }`}
                                    >
                                        {/* Glow Effect */}
                                        {isSelected && (
                                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-30 animate-pulse-glow"></div>
                                        )}
                                        
                                        {/* Card */}
                                        <div className={`relative card-liquid p-8 ${
                                            isSelected 
                                                ? 'border-blue-500/50 bg-blue-500/5' 
                                                : ''
                                        } shimmer-effect`}>
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className={`p-5 rounded-2xl bg-gradient-to-r ${env.color} shadow-2xl animate-float`}>
                                                        <IconComponent className="h-10 w-10 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-3xl font-bold text-white text-glow">{env.name}</h4>
                                                        <p className="text-slate-400 text-lg">{env.description}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Selection Indicator */}
                                                <div className={`w-8 h-8 rounded-full border-3 transition-all duration-300 ${
                                                    isSelected 
                                                        ? 'border-blue-500 bg-blue-500 animate-pulse-glow' 
                                                        : 'border-slate-600 group-hover:border-slate-500'
                                                }`}>
                                                    {isSelected && (
                                                        <div className="w-full h-full rounded-full bg-white scale-50 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {env.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                                                        <span className="text-slate-300 font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="w-full max-w-5xl">
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse-glow"></div>
                            
                            {/* Main Container */}
                            <div className="relative liquid-glass rounded-3xl p-8 shimmer-effect">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Text Area */}
                                    <div className="flex-1">
                                        <textarea
                                            placeholder={`Describe your ${selectedEnvironment.toUpperCase()} project vision...`}
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            className="w-full h-48 input-liquid font-mono text-lg resize-none"
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
                                                    className="btn-liquid-secondary flex items-center justify-center min-w-[140px] h-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isEnhancing ? (
                                                        <Loader2 className="h-8 w-8 animate-spin-glow" />
                                                    ) : (
                                                        <>
                                                            <Wand2 className="h-8 w-8 mr-3" />
                                                            <span className="font-semibold">Enhance</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => onGenerate(userInput)}
                                                    disabled={isEnhancing}
                                                    className="btn-liquid-primary flex items-center justify-center min-w-[140px] h-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Rocket className="h-8 w-8 mr-3" />
                                                    <span className="font-semibold">Generate</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions Grid */}
                    <div className="w-full max-w-7xl">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-white mb-4 text-glow">
                                {selectedEnvironment === 'react' ? 'React Inspirations' : 'HTML Templates'}
                            </h3>
                            <p className="text-slate-400 text-lg">Click any idea to get started instantly</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getSuggestionsForEnvironment().map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative card-liquid text-left hover-lift"
                                >
                                    {/* Icon */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-float">
                                            <Code className="h-6 w-6 text-white" />
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300 group-hover:translate-x-2" />
                                    </div>
                                    
                                    {/* Content */}
                                    <h4 className="text-white font-bold text-lg mb-3 group-hover:text-blue-400 transition-colors duration-300">
                                        {suggestion}
                                    </h4>
                                    <p className="text-slate-400 text-sm font-medium">
                                        Ready-to-use {selectedEnvironment} template
                                    </p>
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