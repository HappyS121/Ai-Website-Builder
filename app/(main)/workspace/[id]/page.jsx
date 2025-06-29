import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Subtle Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className='relative z-10 p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-3rem)]'>
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