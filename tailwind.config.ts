import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0F',
          50: '#F5F5F7',
          100: '#E8E8EE',
          200: '#C8C8D8',
          300: '#9898B0',
          400: '#6868888',
          500: '#48485F',
          600: '#303045',
          700: '#1E1E2D',
          800: '#121220',
          900: '#0A0A0F',
        },
        accent: {
          DEFAULT: '#6C63FF',
          50: '#F0EFFE',
          100: '#DDD9FD',
          200: '#BCB5FB',
          300: '#9A90F9',
          400: '#7D75F8',
          500: '#6C63FF',
          600: '#4D43F5',
          700: '#3228E0',
          800: '#2720B8',
          900: '#201995',
        },
        sage: {
          DEFAULT: '#3ECF8E',
          50: '#EDFBF4',
          100: '#D2F5E4',
          200: '#A5EBC9',
          300: '#73DEAD',
          400: '#55D49E',
          500: '#3ECF8E',
          600: '#29B876',
          700: '#1E9A5F',
          800: '#187B4C',
          900: '#12623C',
        },
        amber: {
          DEFAULT: '#F59E0B',
          warning: '#FCD34D',
        },
        rose: {
          error: '#F43F5E',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 40px rgba(108, 99, 255, 0.25)',
        'glow-sm': '0 0 20px rgba(108, 99, 255, 0.15)',
        'glow-sage': '0 0 30px rgba(62, 207, 142, 0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
