export default {
    REACT_SUGGESTIONS: [
        'Create Todo App', 
        'Create a Budget Track App', 
        'Create a Login and Signup page',
        "Develop a Task Management App",
        "Create a Fully Responsive Blog Platform",
        "Design a Minimalistic Note-Taking App",
        "Develop a Customizable Landing Page",
        "Develop a Recipe Sharing Platform",
        "Create a Fitness Tracking App",
        "Develop a Personal Finance Management Tool",
        "Create a Language Learning App",
        "Build a Virtual Event Platform",
        "Create a Music Streaming Service"
    ],

    HTML_SUGGESTIONS: [
        'Create a Portfolio Website',
        'Build a Restaurant Landing Page',
        'Design a Photography Gallery',
        'Create a Business Website',
        'Build a Product Showcase Page',
        'Design a Travel Blog',
        'Create an Event Landing Page',
        'Build a Real Estate Website',
        'Design a Fashion Store',
        'Create a News Website',
        'Build a Gaming Landing Page',
        'Design a Fitness Gym Website'
    ],

    DEFAULT_FILE: {
        '/public/index.html':
        {
            code: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
            </html>`
        },
        '/App.css': {
            code: `@tailwind base;
            @tailwind components;
            @tailwind utilities;`
        },
        '/tailwind.config.js': {
            code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
        },
        '/postcss.config.js': {
  code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`
}

        },

    HTML_DEFAULT_FILE: {
        '/index.html': {
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles can go here */
    </style>
</head>
<body>
    <div id="app">
        <h1 class="text-4xl font-bold text-center mt-10">Welcome to My Website</h1>
        <p class="text-center mt-4 text-gray-600">This is a starter template.</p>
    </div>
    
    <script>
        // JavaScript code goes here
        console.log('Website loaded successfully!');
    </script>
</body>
</html>`
        },
        '/style.css': {
            code: `/* Custom CSS styles */
body {
    font-family: 'Inter', sans-serif;
}

/* Add your custom styles here */
.custom-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Responsive utilities */
@media (max-width: 768px) {
    .mobile-hidden {
        display: none;
    }
}`
        },
        '/script.js': {
            code: `// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Add your JavaScript code here
    initializeApp();
});

function initializeApp() {
    // Initialize your application
    console.log('App initialized');
}

// Utility functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}`
        }
    },

    DEPENDANCY: {
            "@google/generative-ai": "^0.21.0",
            "@heroicons/react": "^1.0.6",
    "@headlessui/react": "^1.7.17",
    "autoprefixer": "^10.0.0",
    "firebase": "^11.1.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "latest",
    "postcss": "^8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.0",
    "react-router-dom": "latest",
    "react-toastify": "^10.0.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid4": "^2.0.3",
    "uuidv4": "^6.2.13",
    "uuid": "^11.1.0",
    "@mui/material": "^6.4.6"
        }
    }