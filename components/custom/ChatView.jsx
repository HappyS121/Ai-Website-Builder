"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Loader2Icon, Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useModel } from '@/context/ModelContext';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const { selectedModel } = useModel();
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const [environment, setEnvironment] = useState('react');
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id])

    const GetWorkSpaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
        setEnvironment(result?.environment || 'react');
        console.log(result);
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages);
        
        try {
            const result = await axios.post('/api/ai-chat', {
                prompt: PROMPT,
                model: selectedModel,
                environment: environment
            });

            const aiResp = {
                role: 'ai',
                content: result.data.result
            }
            setMessages(prev => [...prev, aiResp]);
            await UpdateMessages({
                messages: [...messages, aiResp],
                workspaceId: id
            })
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorResp = {
                role: 'ai',
                content: 'Sorry, I encountered an error while processing your request. Please try again.'
            }
            setMessages(prev => [...prev, errorResp]);
        }
        setLoading(false);
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }

    return (
        <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Ultra Compact Environment Header */}
            <div className="bg-slate-800/30 border-b border-slate-700/30 backdrop-blur-xl px-2 sm:px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
                        environment === 'react' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    }`}>
                        <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                        <span className="text-xs">{environment === 'react' ? 'React' : 'HTML'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span className="hidden sm:inline text-xs">AI</span>
                    </div>
                </div>
            </div>

            {/* Chat Messages - Fully Responsive */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-3">
                <div className="w-full space-y-3">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-2 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* AI Avatar - Only on larger screens */}
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0 hidden sm:block">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <Bot className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Content - Responsive width */}
                            <div className={`${
                                msg.role === 'user' 
                                    ? 'max-w-[90%] sm:max-w-[85%] order-first' 
                                    : 'max-w-[95%] sm:max-w-[90%]'
                            }`}>
                                <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                        : 'glass-morphism text-slate-100'
                                }`}>
                                    {/* AI Icon for mobile */}
                                    {msg.role === 'ai' && (
                                        <div className="flex items-center gap-2 mb-2 sm:hidden">
                                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                                                <Bot className="h-2.5 w-2.5 text-white" />
                                            </div>
                                            <span className="text-xs text-slate-400">AI Assistant</span>
                                        </div>
                                    )}
                                    
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-invert max-w-none prose-sm prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-white text-sm">{msg.content}</p>
                                    )}
                                </div>
                                
                                {/* Minimalist Timestamp */}
                                <div className={`text-xs text-slate-500 mt-1 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'AI'} • now
                                </div>
                            </div>
                            
                            {/* User Avatar - Only on larger screens */}
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 hidden sm:block">
                                    <div className="w-6 h-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                                        <User className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading Message */}
                    {loading && (
                        <div className="flex gap-2 justify-start w-full">
                            <div className="flex-shrink-0 hidden sm:block">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <Bot className="h-3 w-3 text-white" />
                                </div>
                            </div>
                            <div className="glass-morphism p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-lg max-w-[95%] sm:max-w-[90%]">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Loader2Icon className="animate-spin h-3 w-3 text-blue-400" />
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-xs font-medium">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ultra Compact Input Section */}
            <div className="border-t border-slate-700/30 bg-slate-800/20 backdrop-blur-xl p-2 sm:p-3">
                <div className="relative group">
                    {/* Subtle Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    
                    {/* Input Container */}
                    <div className="relative glass-morphism rounded-lg p-2">
                        <div className="flex gap-2">
                            <textarea
                                placeholder={`Ask about ${environment}...`}
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="flex-1 bg-slate-800/30 border border-slate-600/30 rounded-md p-2 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none text-sm"
                                rows="2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (userInput?.trim()) {
                                            onGenerate(userInput);
                                        }
                                    }
                                }}
                            />
                            
                            {/* Send Button */}
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex-shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Footer - Hidden on very small screens */}
                        <div className="hidden sm:flex justify-between items-center mt-1.5 text-xs text-slate-500">
                            <span className="text-xs">Enter to send</span>
                            <div className="flex items-center gap-1">
                                <Link className="h-2.5 w-2.5" />
                                <span className="text-xs">AI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;