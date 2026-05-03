export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          bg: {
            base:    '#0D0D0F',
            surf1:   '#161618',
            surf2:   '#1C1C1F',
            surf3:   '#242428',
          },
          accent:    '#00F19F',
          txt: {
            primary:   '#F2F0EA',
            secondary: '#8A8A8A',
            muted:     '#4A4A4A',
          },
          status: {
            green:  '#4ADE80',
            red:    '#E8604C',
            amber:  '#F59E0B',
            blue:   '#60A5FA',
            yellow: '#FACC15',
          }
        },
        fontFamily: {
          metric: ['Barlow', 'system-ui', 'sans-serif'],
          body:   ['DM Sans', 'system-ui', 'sans-serif'],
        },
        borderRadius: {
          sm:   '8px',
          md:   '12px',
          lg:   '16px',
          xl:   '20px',
          full: '9999px',
        }
      },
    },
    plugins: [],
  }