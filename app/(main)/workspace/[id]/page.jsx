import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Content - Fixed height to fit screen */}
            <div className='relative z-10 h-full flex flex-col'>
                <div className='flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-0'>
                    {/* Chat Panel */}
                    <div className='lg:col-span-1 min-h-0'>
                        <div className="h-full glass-morphism rounded-2xl overflow-hidden shadow-2xl">
                            <ChatView />
                        </div>
                    </div>
                    
                    {/* Code Panel */}
                    <div className='lg:col-span-3 min-h-0'>
                        <div className="h-full glass-morphism rounded-2xl overflow-hidden shadow-2xl">
                            <CodeView />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;