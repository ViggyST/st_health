/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          accent: '#E8604C',
          'bg-primary': '#0D0D0F',
          'bg-surface': '#141416',
          'bg-card': '#1A1A1E',
          'bg-elevated': '#222226',
        },
        borderRadius: {
          DEFAULT: '12px',
        }
      },
    },
    plugins: [],
  }