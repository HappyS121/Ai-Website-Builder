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
import { Loader2Icon, Download, Code, Eye, Play } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState({});
    const [environment, setEnvironment] = useState('react');
    const { messages } = useContext(MessagesContext);
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
            a.download = `${environment}-project.zip`;
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
        { id: 'preview', name: 'Preview', icon: Play }
    ];

    return (
        <div className='h-full liquid-glass rounded-2xl overflow-hidden flex flex-col'>
            {/* Minimal Header */}
            <div className='border-b border-blue-500/10 px-4 py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        {/* Tab Selector */}
                        <div className='flex bg-slate-800/50 rounded-lg p-1'>
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <IconComponent className="h-3.5 w-3.5" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Environment */}
                        <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                            environment === 'react' 
                                ? 'bg-blue-500/10 text-blue-400' 
                                : 'bg-orange-500/10 text-orange-400'
                        }`}>
                            {environment === 'react' ? 'React' : 'HTML/CSS/JS'}
                        </div>

                        {/* File Count */}
                        <div className="text-xs text-slate-500">
                            {Object.keys(files).length} files
                        </div>
                    </div>
                    
                    {/* Download */}
                    <button
                        onClick={downloadFiles}
                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all duration-200"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0">
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
                            body: 'Inter, sans-serif',
                            mono: 'JetBrains Mono, monospace',
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
                        showNavigator: false,
                        showTabs: false,
                        showLineNumbers: true,
                        showInlineErrors: true,
                        wrapContent: true,
                        editorHeight: 'auto'
                    }}
                >
                    <SandpackLayout>
                        {activeTab === 'code' ? (
                            <>
                                <SandpackFileExplorer 
                                    style={{ 
                                        height: '100%',
                                        backgroundColor: '#0f172a',
                                        borderRight: '1px solid #334155'
                                    }} 
                                />
                                <SandpackCodeEditor 
                                    style={{ 
                                        height: '100%',
                                        backgroundColor: '#0f172a'
                                    }}
                                    showTabs={false}
                                    showLineNumbers
                                    showInlineErrors
                                    wrapContent 
                                />
                            </>
                        ) : (
                            <SandpackPreview 
                                style={{ 
                                    height: '100%',
                                    backgroundColor: '#0f172a'
                                }} 
                                showNavigator={false}
                                showOpenInCodeSandbox={false}
                                showRefreshButton={false}
                            />
                        )}
                    </SandpackLayout>
                </SandpackProvider>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className='absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl'>
                    <div className="text-center">
                        <Loader2Icon className='animate-spin h-8 w-8 text-blue-400 mb-3 mx-auto'/>
                        <p className='text-white text-sm font-medium'>
                            Generating {environment} code...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeView;