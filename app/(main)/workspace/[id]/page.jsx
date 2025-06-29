import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Content - Optimized for mobile */}
            <div className='relative z-10 p-2 sm:p-3 lg:p-4'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 h-[calc(100vh-1rem)] sm:h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-2rem)]'>
                    {/* Chat Panel - Full width on mobile, 1/4 on desktop */}
                    <div className='lg:col-span-1 h-[50vh] lg:h-full'>
                        <div className="h-full glass-morphism rounded-lg lg:rounded-xl overflow-hidden shadow-2xl">
                            <ChatView />
                        </div>
                    </div>
                    
                    {/* Code Panel - Full width on mobile, 3/4 on desktop */}
                    <div className='lg:col-span-3 h-[50vh] lg:h-full'>
                        <div className="h-full glass-morphism rounded-lg lg:rounded-xl overflow-hidden shadow-2xl">
                            <CodeView />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;