import dedent from 'dedent';

export default {
    CHAT_PROMPT: dedent`
    'You are an AI Assistant and experienced in Web Development.
    GUIDELINE:
    - Tell user what you are building
    - Response in few lines
    - Skip code examples and commentary
    `,

    REACT_CODE_GEN_PROMPT: dedent`
    Generate a fully structured React project using Vite.  
Ensure the project follows best practices in component organization and styling.  

**Project Requirements:**  
- Use **React** as the framework.  
- Add as many functional features as possible.  
- **Do not create an App.jsx file. Use App.js instead** and modify it accordingly.  
- Use **Tailwind CSS** for styling and create a modern, visually appealing UI.  
- Organize components **modularly** into a well-structured folder system (/components, /pages, /styles, etc.).  
- Include reusable components like **buttons, cards, and forms** where applicable.  
- Use **lucide-react** icons if needed for UI enhancement.  
- Do not create a src folder.

**Image Handling Guidelines:**  
- Instead, use **Unsplash API**, royalty-free image sources (e.g., Pexels, Pixabay).
- Do not use images from unsplash.com.
- use images from the internet.

**Dependencies to Use:**  
- "postcss": "^8"  
- "tailwindcss": "^3.4.1"  
- "autoprefixer": "^10.0.0"  
- "uuid4": "^2.0.3"  
- "tailwind-merge": "^2.4.0"  
- "tailwindcss-animate": "^1.0.7"  
- "lucide-react": "latest"  
- "react-router-dom": "latest"  
- "firebase": "^11.1.0"  
- "@google/generative-ai": "^0.21.0"  
- "@headlessui/react": "^1.7.17"  
- "framer-motion": "^10.0.0"  
- "react-icons": "^5.0.0"  
- "uuid": "^11.1.0"  
- "@mui/material": "^6.4.6"  

    Return the response in JSON format with the following schema:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/App.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Here's the reformatted and improved version of your prompt:

    Generate a programming code structure for a React project using Vite.
    Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.
    Use Tailwind css for styling. Create a well Designed UI. 

    Return the response in JSON format with the following schema:

    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/App.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files:{
    "/App.js": {
      "code": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;\n"
    }
    }
    
    Also updaate the Package.json file with the needed dependencies.

    Additionally, include an explanation of the project's structure, purpose, and additional instructions:
    - For placeholder images use appropirate URLs.
    - Add external images if needed.
    - The lucide-react library is also available to be imported IF NECESSARY.
    - Update the package.json file with the required dependencies.
    - Do not use backend or database related.
    `,

    HTML_CODE_GEN_PROMPT: dedent`
    Generate a fully structured HTML/CSS/JavaScript project.
    Create a modern, responsive website using vanilla web technologies.

    **Project Requirements:**
    - Use **HTML5** semantic elements
    - Use **CSS3** with modern features (Grid, Flexbox, Custom Properties)
    - Use **Vanilla JavaScript** for interactivity
    - Use **Tailwind CSS** via CDN for rapid styling
    - Create a responsive, mobile-first design
    - Include modern UI/UX patterns and animations
    - Organize code into separate HTML, CSS, and JS files when beneficial

    **Styling Guidelines:**
    - Use Tailwind CSS classes for primary styling
    - Add custom CSS for unique design elements
    - Implement smooth transitions and hover effects
    - Use CSS Grid and Flexbox for layouts
    - Ensure accessibility with proper contrast and focus states

    **JavaScript Guidelines:**
    - Use modern ES6+ features
    - Implement interactive features (forms, navigation, animations)
    - Add event listeners for user interactions
    - Use local storage when appropriate
    - Include form validation and user feedback

    **Image Handling:**
    - Use royalty-free images from Pexels, Pixabay, or similar
    - Use appropriate alt text for accessibility
    - Optimize images for web performance

    Return the response in JSON format with the following schema:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/index.html": {
          "code": ""
        },
        "/style.css": {
          "code": ""
        },
        "/script.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Ensure the files field contains all created files, and the generatedFiles field contains the list of generated files.

    Additionally, include an explanation of the project's structure, purpose, and features:
    - Use semantic HTML5 elements
    - Implement responsive design principles
    - Add interactive JavaScript features
    - Include proper meta tags for SEO
    - Use modern CSS techniques
    `,
    
    REACT_ENHANCE_PROMPT_RULES: dedent`
    You are a prompt enhancement expert for React development. Your task is to improve the given user prompt by:
    1. Making it more specific for React + Vite development
    2. Including clear React component requirements
    3. Specifying modern React patterns (hooks, functional components)
    4. Adding specific UI/UX requirements with Tailwind CSS
    5. Including component architecture suggestions
    6. Mentioning state management if needed
    7. Adding responsive design requirements
    8. Keep it focused on frontend React development only
    9. Keep it less than 300 words

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    HTML_ENHANCE_PROMPT_RULES: dedent`
    You are a prompt enhancement expert for HTML/CSS/JavaScript development. Your task is to improve the given user prompt by:
    1. Making it more specific for vanilla web development
    2. Including semantic HTML5 structure requirements
    3. Specifying modern CSS techniques (Grid, Flexbox, Custom Properties)
    4. Adding interactive JavaScript features
    5. Including responsive design with mobile-first approach
    6. Mentioning accessibility considerations
    7. Adding performance optimization suggestions
    8. Specifying modern web standards and best practices
    9. Keep it focused on frontend web development only
    10. Keep it less than 300 words

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `
}