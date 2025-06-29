"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { Send, Bot, User, Loader2Icon } from 'lucide-react';
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
        <div className="h-full flex flex-col liquid-glass rounded-2xl overflow-hidden">
            {/* Minimal Header */}
            <div className="border-b border-blue-500/10 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        environment === 'react' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'bg-orange-500/10 text-orange-400'
                    }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        {environment === 'react' ? 'React' : 'HTML'}
                    </div>
                    <div className="text-xs text-slate-500">AI Chat</div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="space-y-4">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* AI Avatar */}
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            )}
                            
                            {/* Message */}
                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`p-3 rounded-xl text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                                        : 'bg-slate-800/50 text-slate-100 border border-slate-700/50'
                                }`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-600 prose-pre:rounded-lg prose-pre:text-xs">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading */}
                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Loader2Icon className="animate-spin h-4 w-4" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-blue-500/10 p-4">
                <div className="flex gap-2">
                    <textarea
                        placeholder={`Ask about your ${environment} project...`}
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none resize-none h-16"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (userInput?.trim()) {
                                    onGenerate(userInput);
                                }
                            }
                        }}
                    />
                    
                    {userInput && (
                        <button
                            onClick={() => onGenerate(userInput)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center w-12 h-12"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatView;