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
import { useEnvironment } from '@/context/EnvironmentContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useEffect } from 'react';
import { UpdateFiles } from '@/convex/workspace';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, FileText, Eye } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files,setFiles]=useState(Lookup?.DEFAULT_FILE);
    const [environment, setEnvironment] = useState('react');
    const [selectedFile, setSelectedFile] = useState('/index.html');
    const {messages,setMessages}=useContext(MessagesContext);
    const { selectedModel } = useModel();
    const { selectedEnvironment } = useEnvironment();
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
        
        // Set environment from workspace data
        const workspaceEnvironment = result?.environment || 'react';
        setEnvironment(workspaceEnvironment);
        
        // Use appropriate default files based on environment
        const defaultFiles = workspaceEnvironment === 'html' ? Lookup.HTML_DEFAULT_FILE : Lookup.DEFAULT_FILE;
        
        // Preprocess and validate files before merging
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = {...defaultFiles, ...processedFiles};
        setFiles(mergedFiles);

        // Set default selected file based on environment
        if (workspaceEnvironment === 'html') {
            setSelectedFile('/index.html');
        }
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
        const PROMPT=JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
        
        try {
            const result=await axios.post('/api/gen-ai-code',{
                prompt:PROMPT,
                model: selectedModel,
                environment: environment
            });
            
            // Preprocess AI-generated files
            const processedAiFiles = preprocessFiles(result.data?.files || {});
            const defaultFiles = environment === 'html' ? Lookup.HTML_DEFAULT_FILE : Lookup.DEFAULT_FILE;
            const mergedFiles = {...defaultFiles, ...processedAiFiles};
            setFiles(mergedFiles);

            await UpdateFiles({
                workspaceId:id,
                files:result.data?.files
            });
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
                    dependencies: Lookup.DEPENDANCY,
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

    // Get file extension for syntax highlighting
    const getFileLanguage = (filename) => {
        if (filename.endsWith('.html')) return 'html';
        if (filename.endsWith('.css')) return 'css';
        if (filename.endsWith('.js')) return 'javascript';
        if (filename.endsWith('.jsx')) return 'jsx';
        if (filename.endsWith('.json')) return 'json';
        return 'text';
    };

    // Determine if we should use Sandpack or custom HTML editor
    const isHtmlProject = environment === 'html';

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 border'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 justify-center
                        w-[140px] gap-3 rounded-full'>
                            <h2 onClick={() => setActiveTab('code')}
                                className={`text-sm cursor-pointer 
                            ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>
                                Code</h2>

                            <h2 onClick={() => setActiveTab('preview')}
                                className={`text-sm cursor-pointer 
                            ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>
                                Preview</h2>
                        </div>
                        
                        {/* Environment indicator */}
                        <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
                            <span className="text-xs text-gray-400">Environment:</span>
                            <span className="text-xs font-medium text-blue-400">
                                {environment === 'html' ? 'HTML/CSS/JS' : 'React + Vite'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Download Button */}
                    <button
                        onClick={downloadFiles}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200"
                    >
                        <Download className="h-4 w-4" />
                        <span>Download Files</span>
                    </button>
                </div>
            </div>

            {isHtmlProject ? (
                // Enhanced HTML editor interface
                <div className="relative bg-[#1e1e1e] h-[80vh]">
                    {activeTab === 'code' ? (
                        <div className="flex h-full">
                            {/* File Explorer */}
                            <div className="w-64 bg-[#252526] border-r border-gray-700 flex flex-col">
                                <div className="p-3 border-b border-gray-700">
                                    <h3 className="text-white font-medium text-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Files
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {Object.keys(files).map((filename) => (
                                        <div
                                            key={filename}
                                            onClick={() => setSelectedFile(filename)}
                                            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                                                selectedFile === filename
                                                    ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-500'
                                                    : 'text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${
                                                filename.endsWith('.html') ? 'bg-orange-500' :
                                                filename.endsWith('.css') ? 'bg-blue-500' :
                                                filename.endsWith('.js') ? 'bg-yellow-500' :
                                                'bg-gray-500'
                                            }`} />
                                            <span>{filename.replace('/', '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code Editor */}
                            <div className="flex-1 flex flex-col">
                                {/* File Tab */}
                                <div className="bg-[#2d2d30] border-b border-gray-700 px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            selectedFile.endsWith('.html') ? 'bg-orange-500' :
                                            selectedFile.endsWith('.css') ? 'bg-blue-500' :
                                            selectedFile.endsWith('.js') ? 'bg-yellow-500' :
                                            'bg-gray-500'
                                        }`} />
                                        <span className="text-gray-300 text-sm font-medium">
                                            {selectedFile.replace('/', '')}
                                        </span>
                                    </div>
                                </div>

                                {/* Code Content */}
                                <div className="flex-1 overflow-auto">
                                    <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
                                        <code className="block">
                                            {typeof files[selectedFile] === 'string' 
                                                ? files[selectedFile] 
                                                : files[selectedFile]?.code || '// File content not available'
                                            }
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Enhanced Preview
                        <div className="h-full flex flex-col">
                            {/* Preview Header */}
                            <div className="bg-[#2d2d30] border-b border-gray-700 px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-300 text-sm font-medium">Preview</span>
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="flex-1 bg-white">
                                <iframe
                                    srcDoc={files['/index.html']?.code || files['/index.html']}
                                    className="w-full h-full border-0"
                                    title="HTML Preview"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Sandpack for React projects
                <SandpackProvider 
                files={files}
                template="react" 
                theme={'dark'}
                customSetup={{
                    dependencies: {
                        ...Lookup.DEPENDANCY
                    },
                    entry: '/index.js'
                }}
                options={{
                    externalResources: ['https://cdn.tailwindcss.com'],
                    bundlerTimeoutSecs: 120,
                    recompileMode: "immediate",
                    recompileDelay: 300
                }}
                >
                    <div className="relative">
                        <SandpackLayout>
                            {activeTab=='code'?<>
                                <SandpackFileExplorer style={{ height: '80vh' }} />
                                <SandpackCodeEditor 
                                style={{ height: '80vh' }}
                                showTabs
                                showLineNumbers
                                showInlineErrors
                                wrapContent />
                            </>:
                            <>
                                <SandpackPreview 
                                    style={{ height: '80vh' }} 
                                    showNavigator={true}
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            </>}
                        </SandpackLayout>
                    </div>
                </SandpackProvider>
            )}

            {loading&&<div className='p-10 bg-gray-900 opacity-80 absolute top-0 
            rounded-lg w-full h-full flex items-center justify-center'>
                <Loader2Icon className='animate-spin h-10 w-10 text-white'/>
                <h2 className='text-white'> Generating files...</h2>
            </div>}
        </div>
    );
}

export default CodeView;