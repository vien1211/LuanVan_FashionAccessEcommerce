// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif'],
      playfair: ['"Playfair Display"', 'sans-serif'],
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
    },
    extend: {
      width: {
        main: "1220px", 
      },
      backgroundColor: {
        main: "#6D8777",
      },
      colors: {
        main: "#6D8777",
      },

      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))',

        'layout': '200px minmax(900px, 1fr) 100px',
      },
      
      keyframes: {
        'scale-up-center': {
          '0%': {
            '-webkit-transform': 'scale(0.5)',
            transform: 'scale(0.5)',
          },
          '100%': {
            '-webkit-transform': 'scale(1)',
            transform: 'scale(1)',
          },
        },

        'slide-fwd-center': {
          '0%': {
            '-webkit-transform': 'translateZ(0)',
                    transform: 'translateZ(0)',
          },
          '100%': {
            '-webkit-transform': 'translateZ(160px)',
                    transform: 'translateZ(160px)',
          },
        },

        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-90deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
        CartInRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounce2: {
          '0%': { transform: 'translateY(0)'},
          '100%': { transform: 'translateY(0)'},
          '50%': { transform: 'translateY(-16px)'},
        },
        'pulse-animation': {
          '0%': { boxShadow: '0 0 0 0 rgba(163, 247, 196, 0.5)' },
          '70%': { boxShadow: '0 0 0 20px rgba(163, 247, 196, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(163, 247, 196, 0)' },
        },

      },
      
      
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'scale-up-center': 'scale-up-center 0.8s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'slide-fwd-center': 'slide-fwd-center 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'fadeIn': 'fadeIn 1.5s ease-in',
        'slideInLeft': 'slideInLeft 1.5s ease-in-out',
        'slideInRight': 'slideInRight 1.5s ease-in-out',
        'slideInUp': 'slideInUp 1.5s ease-out',
        'rotateIn': 'rotateIn 1.5s ease-out',
        'CartInRight': 'CartInRight 0.5s ease-in-out',
        'bounce2': 'bounce2 5s infinite linear',
        'pulse-animation': 'pulse-animation 2s infinite'
      },
      
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("@tailwindcss/forms")({
      
      strategy: 'class', 
    }),
  ],
}
