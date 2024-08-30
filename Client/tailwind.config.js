// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif']
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


      },

      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'scale-up-center': 'scale-up-center 0.8s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'slide-fwd-center': 'slide-fwd-center 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        
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
