import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-gradient-xy"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-gradient-xy" style={{animationDelay: '2s'}}></div>
                
                {/* Floating Particles */}
                <div className="particles">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${6 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className='relative z-10 p-4'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-2rem)]'>
                    {/* Chat Panel */}
                    <div className='lg:col-span-1'>
                        <ChatView />
                    </div>
                    
                    {/* Code Panel */}
                    <div className='lg:col-span-3'>
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;