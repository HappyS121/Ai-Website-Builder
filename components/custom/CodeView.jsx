"use client"
import React, { useContext } from 'react';
import { useState } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { useModel } from '@/context/ModelContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Code, Eye, FolderOpen, Zap } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState({});
    const [environment, setEnvironment] = useState('react');
    const { messages, setMessages } = useContext(MessagesContext);
    const { selectedModel } = useModel();
    const UpdateFiles = useMutation(api.workspace.UpdateFiles);
    const convex = useConvex();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        id && GetFiles();
    }, [id])

    const GetFiles = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        
        const workspaceEnvironment = result?.environment || 'react';
        setEnvironment(workspaceEnvironment);
        
        const defaultFiles = workspaceEnvironment === 'html' 
            ? Lookup.DEFAULT_FILE.HTML 
            : Lookup.DEFAULT_FILE.REACT;
        
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = { ...defaultFiles, ...processedFiles };
        setFiles(mergedFiles);
    }

    const preprocessFiles = (files) => {
        const processed = {};
        Object.entries(files).forEach(([path, content]) => {
            if (typeof content === 'string') {
                processed[path] = { code: content };
            } else if (content && typeof content === 'object') {
                if (!content.code && typeof content === 'object') {
                    processed[path] = { code: JSON.stringify(content, null, 2) };
                } else {
                    processed[path] = content;
                }
            }
        });
        return processed;
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages])

    const GenerateAiCode = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages);
        
        try {
            const result = await axios.post('/api/gen-ai-code', {
                prompt: PROMPT,
                model: selectedModel,
                environment: environment
            });
            
            const processedAiFiles = preprocessFiles(result.data?.files || {});
            
            const defaultFiles = environment === 'html' 
                ? Lookup.DEFAULT_FILE.HTML 
                : Lookup.DEFAULT_FILE.REACT;
            
            const mergedFiles = { ...defaultFiles, ...processedAiFiles };
            setFiles(mergedFiles);

            if (result.data?.files && Object.keys(result.data.files).length > 0) {
                await UpdateFiles({
                    workspaceId: id,
                    files: result.data?.files
                });
            }
        } catch (error) {
            console.error('Error generating code:', error);
        }
        setLoading(false);
    }
    
    const downloadFiles = async () => {
        try {
            const zip = new JSZip();
            
            Object.entries(files).forEach(([filename, content]) => {
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                if (fileContent) {
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            if (environment === 'react') {
                const packageJson = {
                    name: "generated-project",
                    version: "1.0.0",
                    private: true,
                    dependencies: Lookup.DEPENDANCY.REACT,
                    scripts: {
                        "dev": "vite",
                        "build": "vite build",
                        "preview": "vite preview"
                    }
                };
                zip.file("package.json", JSON.stringify(packageJson, null, 2));
            }

            const blob = await zip.generateAsync({ type: "blob" });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${environment}-project-files.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    const getSandpackTemplate = () => {
        return environment === 'html' ? 'static' : 'react';
    };

    const getDependencies = () => {
        return environment === 'html' ? {} : Lookup.DEPENDANCY.REACT;
    };

    const tabs = [
        { id: 'code', name: 'Code', icon: Code },
        { id: 'preview', name: 'Preview', icon: Eye }
    ];

    return (
        <div className='relative liquid-glass rounded-2xl overflow-hidden'>
            {/* Compact Header */}
            <div className='liquid-glass border-b border-blue-500/20 px-4 py-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        {/* Tab Selector */}
                        <div className='flex items-center liquid-glass p-1 rounded-lg border border-blue-500/30'>
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <IconComponent className="h-3 w-3" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Environment Badge */}
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold ${
                            environment === 'react' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                            {environment === 'react' ? 'React' : 'HTML/CSS/JS'}
                        </div>

                        {/* File Count */}
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <FolderOpen className="h-3 w-3" />
                            <span>{Object.keys(files).length}</span>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Status */}
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <Zap className="h-3 w-3" />
                            <span>Live</span>
                        </div>
                        
                        {/* Download Button */}
                        <button
                            onClick={downloadFiles}
                            className="btn-liquid-primary flex items-center gap-1 px-3 py-1 text-xs rounded-lg"
                        >
                            <Download className="h-3 w-3" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Code Editor */}
            <SandpackProvider 
                files={files}
                template={getSandpackTemplate()}
                theme={{
                    colors: {
                        surface1: '#0f172a',
                        surface2: '#1e293b',
                        surface3: '#334155',
                        disabled: '#64748b',
                        base: '#f8fafc',
                        clickable: '#e2e8f0',
                        hover: '#cbd5e1',
                        accent: '#3b82f6',
                        error: '#ef4444',
                        errorSurface: '#fecaca',
                        warning: '#f59e0b',
                        warningSurface: '#fed7aa'
                    },
                    syntax: {
                        plain: '#f8fafc',
                        comment: '#64748b',
                        keyword: '#3b82f6',
                        tag: '#06d6a0',
                        punctuation: '#cbd5e1',
                        definition: '#f59e0b',
                        property: '#06d6a0',
                        static: '#ef4444',
                        string: '#10b981'
                    },
                    font: {
                        body: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                        mono: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                        size: '13px',
                        lineHeight: '1.5'
                    }
                }}
                customSetup={{
                    dependencies: getDependencies(),
                    entry: environment === 'html' ? '/index.html' : '/index.js'
                }}
                options={{
                    bundlerTimeoutSecs: 120,
                    recompileMode: "immediate",
                    recompileDelay: 300,
                    showNavigator: true,
                    showTabs: true,
                    showLineNumbers: true,
                    showInlineErrors: true,
                    wrapContent: true,
                    editorHeight: '82vh'
                }}
            >
                <div className="relative">
                    <SandpackLayout>
                        {activeTab === 'code' ? (
                            <>
                                <SandpackFileExplorer 
                                    style={{ 
                                        height: '82vh',
                                        backgroundColor: '#0f172a',
                                        borderRight: '1px solid #334155'
                                    }} 
                                />
                                <SandpackCodeEditor 
                                    style={{ 
                                        height: '82vh',
                                        backgroundColor: '#0f172a'
                                    }}
                                    showTabs
                                    showLineNumbers
                                    showInlineErrors
                                    wrapContent 
                                />
                            </>
                        ) : (
                            <SandpackPreview 
                                style={{ 
                                    height: '82vh',
                                    backgroundColor: '#0f172a'
                                }} 
                                showNavigator={true}
                                showOpenInCodeSandbox={false}
                                showRefreshButton={true}
                            />
                        )}
                    </SandpackLayout>
                </div>
            </SandpackProvider>

            {/* Loading Overlay */}
            {loading && (
                <div className='absolute inset-0 liquid-glass flex items-center justify-center z-50'>
                    <div className="liquid-glass p-6 rounded-2xl text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <Loader2Icon className='animate-spin-glow h-12 w-12 text-blue-400'/>
                                <div className="absolute inset-0 h-12 w-12 border-2 border-cyan-400/30 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <h3 className='text-white text-lg font-bold mb-2'>
                            Generating {environment} Project
                        </h3>
                        <p className="text-slate-400 text-sm">
                            AI is crafting your code...
                        </p>
                        <div className="flex justify-center gap-1 mt-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeView;