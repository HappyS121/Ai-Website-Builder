import { createContext, useContext, useState } from "react";

const EnvironmentContext = createContext();

export const useEnvironment = () => {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error('useEnvironment must be used within an EnvironmentProvider');
    }
    return context;
};

export const EnvironmentProvider = ({ children }) => {
    const [selectedEnvironment, setSelectedEnvironment] = useState('react');

    return (
        <EnvironmentContext.Provider value={{
            selectedEnvironment,
            setSelectedEnvironment
        }}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const DEVELOPMENT_ENVIRONMENTS = {
    REACT: {
        name: "React + Vite",
        key: "react",
        description: "Modern React development with Vite bundler",
        icon: "⚛️",
        features: ["Components", "Hooks", "JSX", "Tailwind CSS"]
    },
    HTML: {
        name: "HTML + CSS + JS",
        key: "html",
        description: "Vanilla web development with modern features",
        icon: "🌐",
        features: ["HTML5", "CSS3", "JavaScript", "Responsive Design"]
    }
};