"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Loader2Icon, Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState, useRef } from 'react';
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
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Minimalist Environment Header */}
            <div className="bg-slate-800/30 border-b border-slate-700/30 backdrop-blur-xl px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                        environment === 'react' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                        <span>{environment === 'react' ? 'React' : 'HTML'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Sparkles className="h-3 w-3" />
                        <span className="hidden sm:inline">AI Active</span>
                    </div>
                </div>
            </div>

            {/* Chat Messages Container - Fixed height with proper scrolling */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-6"
                style={{ height: 'calc(100% - 140px)' }} // Fixed height calculation
            >
                <div className="max-w-full space-y-4 sm:space-y-6 min-h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1">
                        {Array.isArray(messages) && messages?.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 sm:gap-3 mb-4 sm:mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* AI Avatar */}
                                {msg.role === 'ai' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Message Content */}
                                <div className={`max-w-[85%] sm:max-w-[80%] lg:max-w-3xl ${msg.role === 'user' ? 'order-first' : ''}`}>
                                    <div className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                            : 'glass-morphism text-slate-100'
                                    }`}>
                                        {msg.role === 'ai' ? (
                                            <ReactMarkdown className="prose prose-invert max-w-none prose-sm sm:prose-base prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600 prose-pre:text-xs sm:prose-pre:text-sm">
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className="text-white text-sm sm:text-base">{msg.content}</p>
                                        )}
                                    </div>
                                    
                                    {/* Minimalist Timestamp */}
                                    <div className={`text-xs text-slate-500 mt-1 ${
                                        msg.role === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                        {msg.role === 'user' ? 'You' : 'AI'} • now
                                    </div>
                                </div>
                                
                                {/* User Avatar */}
                                {msg.role === 'user' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Loading Message */}
                        {loading && (
                            <div className="flex gap-2 sm:gap-3 justify-start mb-4 sm:mb-6">
                                <div className="flex-shrink-0">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="glass-morphism p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Loader2Icon className="animate-spin h-4 w-4 text-blue-400" />
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="text-sm font-medium">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Fixed Input Section */}
            <div className="border-t border-slate-700/30 bg-slate-800/20 backdrop-blur-xl p-3 sm:p-4 flex-shrink-0">
                <div className="relative group">
                    {/* Subtle Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    
                    {/* Input Container */}
                    <div className="relative glass-morphism rounded-xl p-3">
                        <div className="flex gap-2 sm:gap-3">
                            <textarea
                                placeholder={`Ask about your ${environment} project...`}
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="flex-1 bg-slate-800/30 border border-slate-600/30 rounded-lg p-2 sm:p-3 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none text-sm sm:text-base"
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
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-2 sm:p-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                            <span className="hidden sm:inline">Enter to send • Shift+Enter for new line</span>
                            <div className="flex items-center gap-1">
                                <Link className="h-3 w-3" />
                                <span>AI Powered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;