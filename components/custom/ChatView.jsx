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
        <div className="h-[85vh] flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Simple Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            environment === 'react' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-orange-100 text-orange-700'
                        }`}>
                            {environment === 'react' ? 'React' : 'HTML'}
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                        AI Assistant
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar */}
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Content */}
                            <div className={`max-w-xs lg:max-w-md ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`p-3 rounded-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 text-gray-900'
                                }`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown className="prose prose-sm max-w-none prose-pre:bg-gray-800 prose-pre:text-white prose-pre:rounded">
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-sm">{msg.content}</p>
                                    )}
                                </div>
                                
                                {/* Timestamp */}
                                <div className={`text-xs text-gray-400 mt-1 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'AI'} • now
                                </div>
                            </div>
                            
                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading Message */}
                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Loader2Icon className="animate-spin h-4 w-4" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <textarea
                        placeholder={`Ask about your ${environment} project...`}
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    )}
                </div>
                
                {/* Footer */}
                <div className="text-xs text-gray-400 mt-2">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
}

export default ChatView;