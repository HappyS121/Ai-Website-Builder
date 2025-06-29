"use client"
import React, { use, useContext } from 'react';
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
import Prompt from '@/data/Prompt';
import { useEffect } from 'react';
import { UpdateFiles } from '@/convex/workspace';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Code, Eye, FolderOpen, Zap } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files,setFiles]=useState({});
    const [environment, setEnvironment] = useState('react');
    const {messages,setMessages}=useContext(MessagesContext);
    const { selectedModel } = useModel();
    const UpdateFiles=useMutation(api.workspace.UpdateFiles);
    const convex=useConvex();
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        id&&GetFiles();
    }, [id])

    const GetFiles=async()=>{
        const result=await convex.query(api.workspace.GetWorkspace,{
            workspaceId:id
        });
        
        // Set environment from workspace
        const workspaceEnvironment = result?.environment || 'react';
        setEnvironment(workspaceEnvironment);
        
        // Get default files based on environment
        const defaultFiles = workspaceEnvironment === 'html' 
            ? Lookup.DEFAULT_FILE.HTML 
            : Lookup.DEFAULT_FILE.REACT;
        
        // Preprocess and validate files before merging
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = {...defaultFiles, ...processedFiles};
        setFiles(mergedFiles);
    }

    // Add file preprocessing function
    const preprocessFiles = (files) => {
        const processed = {};
        Object.entries(files).forEach(([path, content]) => {
            // Ensure the file has proper content structure
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

    const GenerateAiCode=async()=>{
        setLoading(true);
        const PROMPT=JSON.stringify(messages);
        
        try {
            const result=await axios.post('/api/gen-ai-code',{
                prompt:PROMPT,
                model: selectedModel,
                environment: environment
            });
            
            // Preprocess AI-generated files
            const processedAiFiles = preprocessFiles(result.data?.files || {});
            
            // Get default files based on environment
            const defaultFiles = environment === 'html' 
                ? Lookup.DEFAULT_FILE.HTML 
                : Lookup.DEFAULT_FILE.REACT;
            
            const mergedFiles = {...defaultFiles, ...processedAiFiles};
            setFiles(mergedFiles);

            // Only call UpdateFiles if we have files to update
            if (result.data?.files && Object.keys(result.data.files).length > 0) {
                await UpdateFiles({
                    workspaceId:id,
                    files:result.data?.files
                });
            }
        } catch (error) {
            console.error('Error generating code:', error);
        }
        setLoading(false);
    }
    
    const downloadFiles = async () => {
        try {
            // Create a new JSZip instance
            const zip = new JSZip();
            
            // Add each file to the zip
            Object.entries(files).forEach(([filename, content]) => {
                // Handle the file content based on its structure
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        // If it's an object without code property, stringify it
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                // Only add the file if we have content
                if (fileContent) {
                    // Remove leading slash if present
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            // Add package.json with dependencies only for React projects
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

            // Generate the zip file
            const blob = await zip.generateAsync({ type: "blob" });
            
            // Create download link and trigger download
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

    // Get Sandpack template based on environment
    const getSandpackTemplate = () => {
        return environment === 'html' ? 'static' : 'react';
    };

    // Get dependencies based on environment
    const getDependencies = () => {
        return environment === 'html' ? {} : Lookup.DEPENDANCY.REACT;
    };

    const tabs = [
        { id: 'code', name: 'Code', icon: Code },
        { id: 'preview', name: 'Preview', icon: Eye }
    ];

    return (
        <div className='relative bg-gradient-to-br from-slate-900 to-slate-800 w-full h-full flex flex-col'>
            {/* Ultra Compact Header */}
            <div className='bg-slate-800/20 border-b border-slate-700/20 backdrop-blur-xl px-3 py-1.5 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        {/* Ultra Compact Tab Selector */}
                        <div className='flex items-center bg-slate-900/30 p-0.5 rounded-md border border-slate-700/20'>
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                                        }`}
                                    >
                                        <IconComponent className="h-3 w-3" />
                                        <span className="hidden sm:inline">{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Ultra Compact Environment Badge */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${
                            environment === 'react' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                            <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                            <span className="hidden sm:inline text-xs">
                                {environment === 'react' ? 'React' : 'HTML'}
                            </span>
                        </div>

                        {/* File Count - Hidden on small screens */}
                        <div className="hidden md:flex items-center gap-1 text-slate-400 text-xs">
                            <FolderOpen className="h-3 w-3" />
                            <span>{Object.keys(files).length}</span>
                        </div>
                    </div>
                    
                    {/* Ultra Compact Actions */}
                    <div className="flex items-center gap-1.5">
                        {/* Status - Hidden on small screens */}
                        <div className="hidden lg:flex items-center gap-1 text-emerald-400 text-xs">
                            <Zap className="h-3 w-3" />
                            <span>Live</span>
                        </div>
                        
                        {/* Ultra Compact Download Button */}
                        <button
                            onClick={downloadFiles}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1"
                        >
                            <Download className="h-3 w-3" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Code Editor - Takes remaining space */}
            <div className="flex-1 min-h-0">
                <SandpackProvider 
                    files={files}
                    template={getSandpackTemplate()}
                    theme={{
                        colors: {
                            surface1: '#1e293b',
                            surface2: '#334155',
                            surface3: '#475569',
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
                        editorHeight: '100%'
                    }}
                >
                    <div className="h-full">
                        <SandpackLayout>
                            {activeTab === 'code' ? (
                                <>
                                    <SandpackFileExplorer 
                                        style={{ 
                                            height: '100%',
                                            backgroundColor: '#1e293b',
                                            borderRight: '1px solid #334155'
                                        }} 
                                    />
                                    <SandpackCodeEditor 
                                        style={{ 
                                            height: '100%',
                                            backgroundColor: '#1e293b'
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
                                        height: '100%',
                                        backgroundColor: '#1e293b'
                                    }} 
                                    showNavigator={true}
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            )}
                        </SandpackLayout>
                    </div>
                </SandpackProvider>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className='absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50'>
                    <div className="glass-morphism p-6 sm:p-8 rounded-2xl text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <Loader2Icon className='animate-spin h-10 w-10 sm:h-12 sm:w-12 text-blue-400'/>
                                <div className="absolute inset-0 h-10 w-10 sm:h-12 sm:w-12 border-2 border-cyan-400/30 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <h3 className='text-white text-lg sm:text-xl font-semibold mb-2'>
                            Generating {environment} Project
                        </h3>
                        <p className="text-slate-400 text-sm sm:text-base">
                            AI is crafting your code...
                        </p>
                        <div className="flex justify-center gap-1 mt-4">
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