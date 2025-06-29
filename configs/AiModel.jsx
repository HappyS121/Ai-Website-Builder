const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const openRouterApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

// Gemini Configuration
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 10192,
    responseMimeType: "application/json",
};

const EnhancePromptConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
    responseMimeType: "application/json",
};

// OpenRouter Configuration
const OPENROUTER_MODELS = {
    DEEPSEEK_CHAT: "deepseek/deepseek-chat-v3-0324:free",
    DEEPSEEK_R1: "deepseek/deepseek-r1-0528:free",
    GEMINI_FLASH: "google/gemini-2.0-flash-exp:free",
    QWEN: "qwen/qwen3-235b-a22b:free"
};

// OpenRouter API call function with timeout handling
const callOpenRouter = async (model, messages, config = {}) => {
    if (!openRouterApiKey) {
        throw new Error("OpenRouter API key not configured");
    }

    const requestBody = {
        model: model,
        messages: messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 4000,
        top_p: config.topP || 0.9,
        stream: false
    };

    // Add response format if specified
    if (config.responseFormat) {
        requestBody.response_format = config.responseFormat;
    }

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 120000); // Increased timeout to 120 seconds (2 minutes)

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterApiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "AI Website Builder"
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        // Clear timeout on successful response
        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        // Clear timeout in case of error
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timeout: The AI model took too long to respond. Please try again.');
        }
        throw error;
    }
};

// OpenRouter Chat Sessions
export const openRouterChatSessions = {
    deepseekChat: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.DEEPSEEK_CHAT, messages);
            return { response: { text: () => content } };
        }
    },
    deepseekR1: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.DEEPSEEK_R1, messages);
            return { response: { text: () => content } };
        }
    },
    geminiFlash: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.GEMINI_FLASH, messages);
            return { response: { text: () => content } };
        }
    },
    qwen: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.QWEN, messages);
            return { response: { text: () => content } };
        }
    }
};

// OpenRouter Code Generation Sessions
export const openRouterCodeSessions = {
    deepseekChat: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.DEEPSEEK_CHAT, messages, {
                temperature: 0.3,
                maxTokens: 8000,
                responseFormat: { type: 'json_object' }
            });
            return { response: { text: () => content } };
        }
    },
    deepseekR1: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.DEEPSEEK_R1, messages, {
                temperature: 0.3,
                maxTokens: 8000,
                responseFormat: { type: 'json_object' }
            });
            return { response: { text: () => content } };
        }
    },
    geminiFlash: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.GEMINI_FLASH, messages, {
                temperature: 0.3,
                maxTokens: 8000,
                responseFormat: { type: 'json_object' }
            });
            return { response: { text: () => content } };
        }
    },
    qwen: {
        sendMessage: async (prompt) => {
            const messages = [{ role: "user", content: prompt }];
            const content = await callOpenRouter(OPENROUTER_MODELS.QWEN, messages, {
                temperature: 0.3,
                maxTokens: 8000,
                responseFormat: { type: 'json_object' }
            });
            return { response: { text: () => content } };
        }
    }
};

// Original Gemini Sessions (keeping for backward compatibility)
export const chatSession = model.startChat({
    generationConfig,
    history: [],
});

export const GenAiCode = model.startChat({
    generationConfig: CodeGenerationConfig,
    history: [
        {
            role: "user",
            parts: [
              {text: "create a to do app: Generate a Project in React. Create multiple components, organizing them in a folder structure.\n\n    Return the response in JSON format with the following schema:\n    {\n      \"projectTitle\": \"\",\n      \"explanation\": \"\",\n      \"files\": {\n        \"/App.js\": {\n          \"code\": \"\"\n        },\n        ...\n      },\n      \"generatedFiles\": []\n    }\n\n    Here's the reformatted and improved version of your prompt:\n\n    Generate a programming code structure for a React project using Vite.\n    Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.\n    Use Tailwind css for styling.\n\n    Return the response in JSON format with the following schema:\n\n    {\n      \"projectTitle\": \"\",\n      \"explanation\": \"\",\n      \"files\": {\n        \"/App.js\": {\n          \"code\": \"\"\n        },\n        ...\n      },\n      \"generatedFiles\": []\n    }\n\n    Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files:{\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\n\\nfunction App() {\\n  return (\\n    <div>\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n\"\n    }\n    }\n    \n\n    Additionally, include an explanation of the project's structure, purpose, and additional instructions:\n    - For placeholder images, please use https://archive.org/download/\n    - Add Emoji icons whenever needed to give a good user experience\n    - The lucide-react library is also available to be imported IF NECESSARY."},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "{\n  \"projectTitle\": \"React To-Do App\",\n  \"explanation\": \"This project creates a simple to-do application using React and Tailwind CSS. The application is structured with components organized into a dedicated 'components' folder. This structure promotes code reusability and maintainability. The application will allow users to add tasks to a list, mark them as complete, and remove them. Emoji icons are included to enhance the user experience, but lucide-react icons are not needed for this implementation. The placeholder images will be used for user profile for example (not this case).\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\nimport TodoList from './components/TodoList';\\nimport AddTodo from './components/AddTodo';\\n\\nfunction App() {\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen flex flex-col items-center\\\">\\n      <h1 className=\\\"text-3xl font-bold text-center mt-8 mb-4\\\">To-Do List 📝</h1>\\n      <div className=\\\"bg-white p-6 rounded-md shadow-md w-full max-w-md\\\">\\n          <AddTodo />\\n          <TodoList />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/TodoList.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\n\\nfunction TodoList() {\\n  const [todos, setTodos] = useState(() => {\\n    const savedTodos = localStorage.getItem('todos');\\n    return savedTodos ? JSON.parse(savedTodos) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('todos', JSON.stringify(todos));\\n  }, [todos]);\\n\\n  const toggleComplete = (id) => {\\n    setTodos(todos.map(todo =>\\n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\\n    ));\\n  };\\n\\n  const removeTodo = (id) => {\\n    setTodos(todos.filter(todo => todo.id !== id));\\n  };\\n\\n  return (\\n    <ul className=\\\"mt-4\\\">\\n      {todos.map(todo => (\\n        <li key={todo.id} className={`flex justify-between items-center py-2 border-b border-gray-200 ${todo.completed ? 'line-through text-gray-500' : ''}`}>\\n          <span onClick={() => toggleComplete(todo.id)} className=\\\"cursor-pointer flex-1\\\">{todo.text}</span>\\n          <div>\\n            <button onClick={() => removeTodo(todo.id)} className=\\\"ml-2 text-red-500 hover:text-red-700 focus:outline-none\\\">❌</button>\\n          </div>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TodoList;\"\n    },\n    \"/components/AddTodo.js\": {\n      \"code\": \"import React, { useState } from 'react';\\n\\nfunction AddTodo() {\\n  const [text, setText] = useState('');\\n  const [todos, setTodos] = useState(() => {\\n    const savedTodos = localStorage.getItem('todos');\\n    return savedTodos ? JSON.parse(savedTodos) : [];\\n  });\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if(text.trim() === '') return;\\n    const newTodo = { id: Date.now(), text: text, completed: false };\\n    setTodos([...todos, newTodo]);\\n    setText('');\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"flex\\\">\\n      <input\\n        type=\\\"text\\\"\\n        placeholder=\\\"Add a todo...\\\"        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n        className=\\\"border p-2 rounded-l-md flex-1 focus:outline-none focus:ring focus:border-blue-300\\\"\\n      />\\n      <button type=\\\"submit\\\" className=\\\"bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none\\\">➕</button>\\n    </form>\\n  );\\n}\\n\\nexport default AddTodo;\"\n    }\n  },\n    \"generatedFiles\": [\n        \"/App.js\",\n        \"/components/TodoList.js\",\n        \"/components/AddTodo.js\"\n    ]\n}"},
            ],
          },
    ],
});

export const enhancePromptSession = model.startChat({
    generationConfig: EnhancePromptConfig,
    history: [],
});

// Export available models for UI selection
export const AVAILABLE_MODELS = {
    GEMINI: {
        name: "Gemini 2.0 Flash",
        provider: "Google",
        key: "gemini"
    },
    DEEPSEEK_CHAT: {
        name: "DeepSeek Chat V3",
        provider: "OpenRouter",
        key: "deepseek-chat"
    },
    DEEPSEEK_R1: {
        name: "DeepSeek R1",
        provider: "OpenRouter", 
        key: "deepseek-r1"
    },
    GEMINI_OPENROUTER: {
        name: "Gemini 2.0 Flash (OpenRouter)",
        provider: "OpenRouter",
        key: "gemini-openrouter"
    },
    QWEN: {
        name: "Qwen 3 235B",
        provider: "OpenRouter",
        key: "qwen"
    }
};