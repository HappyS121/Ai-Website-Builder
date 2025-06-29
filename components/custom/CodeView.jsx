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
import { Loader2Icon, Download, FileText, Eye, Save } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files,setFiles]=useState(Lookup?.DEFAULT_FILE);
    const [environment, setEnvironment] = useState('react');
    const [selectedFile, setSelectedFile] = useState('/index.html');
    const [editingContent, setEditingContent] = useState('');
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
            setEditingContent(mergedFiles['/index.html']?.code || mergedFiles['/index.html'] || '');
        }
    }

    // Update editing content when selected file changes
    useEffect(() => {
        if (selectedFile && files[selectedFile]) {
            const content = typeof files[selectedFile] === 'string' 
                ? files[selectedFile] 
                : files[selectedFile]?.code || '';
            setEditingContent(content);
        }
    }, [selectedFile, files]);

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

    // Save edited content
    const saveFileContent = async () => {
        if (!selectedFile || !editingContent) return;

        const updatedFiles = {
            ...files,
            [selectedFile]: { code: editingContent }
        };
        
        setFiles(updatedFiles);

        // Save to database
        try {
            await UpdateFiles({
                workspaceId: id,
                files: updatedFiles
            });
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    // Generate combined HTML for preview
    const generatePreviewHTML = () => {
        const htmlContent = files['/index.html']?.code || files['/index.html'] || '';
        const cssContent = files['/style.css']?.code || files['/style.css'] || '';
        const jsContent = files['/script.js']?.code || files['/script.js'] || '';

        // Inject CSS and JS into HTML
        let previewHTML = htmlContent;
        
        // Add CSS
        if (cssContent) {
            const cssTag = `<style>${cssContent}</style>`;
            if (previewHTML.includes('</head>')) {
                previewHTML = previewHTML.replace('</head>', `${cssTag}\n</head>`);
            } else {
                previewHTML = `<head>${cssTag}</head>${previewHTML}`;
            }
        }

        // Add JS
        if (jsContent) {
            const jsTag = `<script>${jsContent}</script>`;
            if (previewHTML.includes('</body>')) {
                previewHTML = previewHTML.replace('</body>', `${jsTag}\n</body>`);
            } else {
                previewHTML = `${previewHTML}<script>${jsContent}</script>`;
            }
        }

        return previewHTML;
    };
    
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
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {isHtmlProject && activeTab === 'code' && (
                            <button
                                onClick={saveFileContent}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                            </button>
                        )}
                        <button
                            onClick={downloadFiles}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </div>

            {isHtmlProject ? (
                // Custom HTML editor interface similar to Sandpack
                <div className="relative bg-[#1e1e1e] h-[80vh]">
                    {activeTab === 'code' ? (
                        <div className="flex h-full">
                            {/* File Explorer - Similar to Sandpack */}
                            <div className="w-64 bg-[#252526] border-r border-gray-600 flex flex-col">
                                <div className="p-3 border-b border-gray-600 bg-[#2d2d30]">
                                    <h3 className="text-white font-medium text-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Explorer
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {Object.keys(files).map((filename) => (
                                        <div
                                            key={filename}
                                            onClick={() => setSelectedFile(filename)}
                                            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                                                selectedFile === filename
                                                    ? 'bg-[#37373d] text-white border-l-2 border-blue-500'
                                                    : 'text-gray-300 hover:bg-[#2a2d2e]'
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

                            {/* Code Editor - Similar to Sandpack */}
                            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                                {/* File Tab */}
                                <div className="bg-[#2d2d30] border-b border-gray-600 px-4 py-2 flex items-center justify-between">
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

                                {/* Editable Code Content */}
                                <div className="flex-1 overflow-hidden">
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="w-full h-full p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm leading-relaxed resize-none outline-none border-none"
                                        style={{
                                            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                            tabSize: 2
                                        }}
                                        placeholder="Start typing your code..."
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Enhanced Preview - Similar to Sandpack
                        <div className="h-full flex flex-col bg-[#1e1e1e]">
                            {/* Preview Header */}
                            <div className="bg-[#2d2d30] border-b border-gray-600 px-4 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300 text-sm font-medium">Browser</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="flex-1 bg-white">
                                <iframe
                                    srcDoc={generatePreviewHTML()}
                                    className="w-full h-full border-0"
                                    title="HTML Preview"
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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