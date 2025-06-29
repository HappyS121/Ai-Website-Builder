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
import { Loader2Icon, Download, Code, Eye, FolderOpen } from 'lucide-react';
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
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
            {/* Simple Header */}
            <div className='bg-gray-50 border-b border-gray-200 px-4 py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        {/* Tab Selector */}
                        <div className='flex bg-gray-100 rounded-lg p-1'>
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Environment Badge */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            environment === 'react' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-orange-100 text-orange-700'
                        }`}>
                            {environment === 'react' ? 'React' : 'HTML/CSS/JS'}
                        </div>

                        {/* File Count */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <FolderOpen className="h-4 w-4" />
                            <span>{Object.keys(files).length} files</span>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Download Button */}
                        <button
                            onClick={downloadFiles}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Export
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
                        surface1: '#ffffff',
                        surface2: '#f8f9fa',
                        surface3: '#e9ecef',
                        disabled: '#6c757d',
                        base: '#212529',
                        clickable: '#495057',
                        hover: '#343a40',
                        accent: '#0d6efd',
                        error: '#dc3545',
                        errorSurface: '#f8d7da',
                        warning: '#ffc107',
                        warningSurface: '#fff3cd'
                    },
                    syntax: {
                        plain: '#212529',
                        comment: '#6c757d',
                        keyword: '#0d6efd',
                        tag: '#198754',
                        punctuation: '#495057',
                        definition: '#fd7e14',
                        property: '#198754',
                        static: '#dc3545',
                        string: '#198754'
                    },
                    font: {
                        body: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                        mono: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                        size: '14px',
                        lineHeight: '1.6'
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
                    editorHeight: '80vh'
                }}
            >
                <div className="relative">
                    <SandpackLayout>
                        {activeTab === 'code' ? (
                            <>
                                <SandpackFileExplorer 
                                    style={{ 
                                        height: '80vh',
                                        backgroundColor: '#ffffff',
                                        borderRight: '1px solid #e9ecef'
                                    }} 
                                />
                                <SandpackCodeEditor 
                                    style={{ 
                                        height: '80vh',
                                        backgroundColor: '#ffffff'
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
                                    height: '80vh',
                                    backgroundColor: '#ffffff'
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
                <div className='absolute inset-0 bg-white/90 flex items-center justify-center z-50'>
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-lg">
                        <div className="flex items-center justify-center mb-4">
                            <Loader2Icon className='animate-spin h-8 w-8 text-blue-500'/>
                        </div>
                        <h3 className='text-gray-900 text-lg font-semibold mb-2'>
                            Generating {environment} Project
                        </h3>
                        <p className="text-gray-600 text-sm">
                            AI is creating your code...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeView;