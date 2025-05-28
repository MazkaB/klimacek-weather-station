/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for Klimacek
        klimacek: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Weather-specific colors
        weather: {
          sunny: '#fbbf24',
          cloudy: '#9ca3af',
          rainy: '#3b82f6',
          windy: '#6b7280',
          hot: '#ef4444',
          cold: '#06b6d4',
        },
        // Sensor colors
        sensor: {
          temperature: '#f97316',
          humidity: '#3b82f6',
          light: '#eab308',
          rain: '#2563eb',
          wind: '#6b7280',
          solar: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      height: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem', 
        '128': '32rem',
      },
      width: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Custom plugin for weather-specific utilities
    function({ addUtilities, theme }) {
      const weatherUtilities = {
        '.weather-card': {
          '@apply bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300': {},
        },
        '.sensor-badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.gradient-text': {
          'background': 'linear-gradient(45deg, #3B82F6, #10B981)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass-morphism': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        }
      };
      
      addUtilities(weatherUtilities);
    }
  ],
  // Dark mode configuration
  darkMode: 'class',
  
  // Safelist for dynamic classes
  safelist: [
    'bg-blue-500',
    'bg-green-500', 
    'bg-orange-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-gray-500',
    'text-blue-600',
    'text-green-600',
    'text-orange-600',
    'text-purple-600',
    'text-red-600',
    'text-yellow-600',
    'text-indigo-600',
    'text-gray-600',
    {
      pattern: /bg-(blue|green|orange|purple|red|yellow|indigo|gray)-(100|500)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /text-(blue|green|orange|purple|red|yellow|indigo|gray)-(600|700)/,
      variants: ['hover', 'focus'],
    }
  ]
};