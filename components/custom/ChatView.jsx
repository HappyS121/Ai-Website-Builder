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
        <div className="relative h-[85vh] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Environment Header */}
            <div className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                            environment === 'react' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        }`}>
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                            <span className="font-medium">
                                {environment === 'react' ? 'React Environment' : 'HTML Environment'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>AI Assistant Active</span>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar */}
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Content */}
                            <div className={`max-w-3xl ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`p-6 rounded-2xl shadow-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                        : 'glass-morphism text-slate-100'
                                }`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-white">{msg.content}</p>
                                    )}
                                </div>
                                
                                {/* Timestamp */}
                                <div className={`text-xs text-slate-400 mt-2 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'} • Just now
                                </div>
                            </div>
                            
                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading Message */}
                    {loading && (
                        <div className="flex gap-4 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="glass-morphism p-6 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Loader2Icon className="animate-spin h-5 w-5 text-blue-400" />
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="font-medium">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        
                        {/* Input Container */}
                        <div className="relative glass-morphism rounded-2xl p-4">
                            <div className="flex gap-4">
                                <textarea
                                    placeholder={`Ask about your ${environment} project...`}
                                    value={userInput}
                                    onChange={(event) => setUserInput(event.target.value)}
                                    className="flex-1 bg-slate-800/50 border-2 border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none h-20"
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
                                        className="btn-primary flex items-center justify-center w-16 h-16 rounded-xl"
                                    >
                                        <Send className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Footer */}
                            <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                                <span>Press Enter to send, Shift+Enter for new line</span>
                                <div className="flex items-center gap-2">
                                    <Link className="h-4 w-4 hover:text-blue-400 transition-colors duration-200" />
                                    <span>Powered by AI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;