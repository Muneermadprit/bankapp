/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode:'class',
  theme: {
    extend: {
      
      animation: {
        fade: 'fadeIn 3000 ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },
      boxShadow: {
        'bulge': '0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 10px rgba(0, 0, 0, 0.3)',
        'deep': '0 15px 30px rgba(0, 0, 0, 0.6), 0 10px 15px rgba(0, 0, 0, 0.4)',
        'soft': '0 5px 10px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)',
      },
      colors:{
        primary:'#fea928',
        secondary:'#ed8900'

      },
      container:{
        center:true,
        padding:{
          DEFAULT:'1rem',
          sm:'3rem',
         

        }
      }
    },
  },
  plugins: [
    require('taos/plugin')
  ],
  safelist: [
    '!duration-[0ms]',
    '!delay-[0ms]',
    'html.js :where([class*="taos:"]:not(.taos-init))'
  ]
}

