export default {
    SUGGESTIONS: {
        REACT: [
            'Create Todo App with React Hooks',
            'Build a Budget Tracker with Charts',
            'Develop a Task Management Dashboard',
            'Create a Responsive Blog Platform',
            'Design a Note-Taking App with Categories',
            'Build a Recipe Sharing Platform',
            'Create a Fitness Tracking App',
            'Develop a Personal Finance Tool',
            'Build a Language Learning App',
            'Create a Music Streaming Interface',
            'Develop an E-commerce Product Page',
            'Build a Social Media Dashboard'
        ],
        HTML: [
            'Create a Portfolio Website',
            'Build a Restaurant Landing Page',
            'Design a Business Website',
            'Create a Photography Gallery',
            'Build a Travel Blog Template',
            'Design a Product Showcase Page',
            'Create a Contact Form Page',
            'Build a News Website Layout',
            'Design a Real Estate Listing',
            'Create an Event Landing Page',
            'Build a Corporate Website',
            'Design a Creative Agency Site'
        ]
    },

    // Keep old SUGGSTIONS for backward compatibility
    SUGGSTIONS: [
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

    DEFAULT_FILE: {
        REACT: {
            '/public/index.html': {
                code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
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

export default config;`
            }
        },
        HTML: {
            '/index.html': {
                code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to Your HTML Project</h1>
    </div>
    <script src="script.js"></script>
</body>
</html>`
            },
            '/styles.css': {
                code: `/* Custom CSS styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Add your custom styles here */`
            },
            '/script.js': {
                code: `// JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('HTML Project loaded successfully!');
    
    // Add your JavaScript code here
});`
            }
        }
    },

    DEPENDANCY: {
        REACT: {
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
        },
        HTML: {
            // HTML projects don't need npm dependencies
            // They use CDN links for libraries
        }
    }
}