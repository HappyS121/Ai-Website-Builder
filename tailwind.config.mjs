/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Custom colors for the modern theme
  			'electric-blue': {
  				400: '#60a5fa',
  				500: '#3b82f6',
  				600: '#2563eb'
  			},
  			'neon-cyan': '#00ffff',
  			'turquoise': {
  				400: '#22d3ee',
  				500: '#06d6a0',
  				600: '#059669'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'float': 'float 6s ease-in-out infinite',
  			'float-delayed': 'float-delayed 8s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
  			'pulse-glow-turquoise': 'pulse-glow-turquoise 3s ease-in-out infinite',
  			'gradient-x': 'gradient-x 15s ease infinite',
  			'gradient-y': 'gradient-y 15s ease infinite',
  			'gradient-xy': 'gradient-xy 15s ease infinite',
  			'spin-glow': 'spin-glow 2s linear infinite',
  			'shimmer': 'shimmer 3s infinite'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': { 
  					transform: 'translateY(0px) rotate(0deg)' 
  				},
  				'33%': { 
  					transform: 'translateY(-10px) rotate(1deg)' 
  				},
  				'66%': { 
  					transform: 'translateY(5px) rotate(-1deg)' 
  				}
  			},
  			'float-delayed': {
  				'0%, 100%': { 
  					transform: 'translateY(0px) rotate(0deg)' 
  				},
  				'33%': { 
  					transform: 'translateY(8px) rotate(-1deg)' 
  				},
  				'66%': { 
  					transform: 'translateY(-12px) rotate(1deg)' 
  				}
  			},
  			'pulse-glow': {
  				'0%, 100%': { 
  					boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' 
  				},
  				'50%': { 
  					boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' 
  				}
  			},
  			'pulse-glow-turquoise': {
  				'0%, 100%': { 
  					boxShadow: '0 0 20px rgba(6, 214, 160, 0.3)' 
  				},
  				'50%': { 
  					boxShadow: '0 0 40px rgba(6, 214, 160, 0.6)' 
  				}
  			},
  			'gradient-x': {
  				'0%, 100%': {
  					transform: 'translateX(-50%)'
  				},
  				'50%': {
  					transform: 'translateX(50%)'
  				}
  			},
  			'gradient-y': {
  				'0%, 100%': {
  					transform: 'translateY(-50%)'
  				},
  				'50%': {
  					transform: 'translateY(50%)'
  				}
  			},
  			'gradient-xy': {
  				'0%, 100%': {
  					transform: 'translate(-50%, -50%)'
  				},
  				'25%': {
  					transform: 'translate(50%, -50%)'
  				},
  				'50%': {
  					transform: 'translate(50%, 50%)'
  				},
  				'75%': {
  					transform: 'translate(-50%, 50%)'
  				}
  			},
  			'spin-glow': {
  				from: { 
  					transform: 'rotate(0deg)',
  					filter: 'hue-rotate(0deg)'
  				},
  				to: { 
  					transform: 'rotate(360deg)',
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			shimmer: {
  				'0%': { 
  					transform: 'translateX(-100%) skewX(-15deg)' 
  				},
  				'100%': { 
  					transform: 'translateX(200%) skewX(-15deg)' 
  				}
  			}
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  			mono: ['JetBrains Mono', 'Fira Code', 'monospace']
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		borderWidth: {
  			'3': '3px'
  		}
  	}
  },
  plugins: [
  	require("tailwindcss-animate"),
  	require('tailwind-scrollbar-hide')
  ],
};