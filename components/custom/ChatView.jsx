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
        <div className="relative h-[85vh] flex flex-col liquid-glass rounded-2xl overflow-hidden">
            {/* Compact Environment Header */}
            <div className="liquid-glass border-b border-blue-500/20 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                        environment === 'react' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                        <span>{environment === 'react' ? 'React' : 'HTML'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Active</span>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <div className="space-y-3">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar */}
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Content */}
                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`p-3 rounded-2xl shadow-lg text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                        : 'liquid-glass text-slate-100'
                                }`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600 prose-pre:rounded-lg prose-pre:text-xs">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-white">{msg.content}</p>
                                    )}
                                </div>
                                
                                {/* Compact Timestamp */}
                                <div className={`text-xs text-slate-500 mt-1 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'AI'} • now
                                </div>
                            </div>
                            
                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 liquid-glass rounded-xl flex items-center justify-center shadow-lg">
                                        <User className="h-4 w-4 text-blue-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading Message */}
                    {loading && (
                        <div className="flex gap-2 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="liquid-glass p-3 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                    <Loader2Icon className="animate-spin h-4 w-4 text-blue-400" />
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span>AI thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Input Section */}
            <div className="border-t border-blue-500/20 liquid-glass p-3">
                <div className="relative group">
                    {/* Input Container */}
                    <div className="relative liquid-glass rounded-2xl p-3">
                        <div className="flex gap-2">
                            <textarea
                                placeholder={`Ask about ${environment}...`}
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="flex-1 input-liquid h-16 resize-none text-sm"
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
                                    className="btn-liquid-primary flex items-center justify-center w-16 h-16 rounded-xl"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Compact Footer */}
                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                            <span>Enter to send</span>
                            <div className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                <span>AI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;