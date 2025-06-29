"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { Send, Bot, User, Sparkles, Loader2Icon } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
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
        <div className="relative h-[85vh] flex flex-col liquid-glass rounded-3xl overflow-hidden">
            {/* Environment Header */}
            <div className="liquid-glass border-b border-blue-500/20 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                            environment === 'react' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        } animate-pulse-glow`}>
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                            <span className="font-bold">
                                {environment === 'react' ? 'React Environment' : 'HTML Environment'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Sparkles className="h-4 w-4 animate-spin-glow" />
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
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                                        <Bot className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Content */}
                            <div className={`max-w-3xl ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`p-6 rounded-3xl shadow-2xl ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                        : 'liquid-glass text-slate-100'
                                } hover-lift`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600 prose-pre:rounded-xl">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-white font-medium">{msg.content}</p>
                                    )}
                                </div>
                                
                                {/* Timestamp */}
                                <div className={`text-xs text-slate-400 mt-3 font-medium ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'} • Just now
                                </div>
                            </div>
                            
                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 liquid-glass rounded-2xl flex items-center justify-center shadow-2xl">
                                        <User className="h-6 w-6 text-blue-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading Message */}
                    {loading && (
                        <div className="flex gap-4 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="liquid-glass p-6 rounded-3xl shadow-2xl">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <Loader2Icon className="animate-spin-glow h-6 w-6 text-blue-400" />
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="font-bold">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-blue-500/20 liquid-glass p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        
                        {/* Input Container */}
                        <div className="relative liquid-glass rounded-3xl p-6">
                            <div className="flex gap-4">
                                <textarea
                                    placeholder={`Ask about your ${environment} project...`}
                                    value={userInput}
                                    onChange={(event) => setUserInput(event.target.value)}
                                    className="flex-1 input-liquid h-24 resize-none font-mono"
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
                                        className="btn-liquid-primary flex items-center justify-center w-20 h-20 rounded-2xl"
                                    >
                                        <Send className="h-7 w-7" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Footer */}
                            <div className="flex justify-between items-center mt-4 text-xs text-slate-400 font-medium">
                                <span>Press Enter to send, Shift+Enter for new line</span>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 hover:text-blue-400 transition-colors duration-200" />
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