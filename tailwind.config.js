/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Habilitar el modo oscuro basado en clases
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      // Dispositivos específicos 2025
      'mobile-s': '320px',
      'mobile-m': '375px',
      'mobile-l': '425px',
      'tablet': '768px',
      'laptop': '1024px',
      'laptop-l': '1440px',
      'desktop': '1920px',
    },
    extend: {
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      fontSize: {
        'xs-mobile': ['12px', '16px'],
        'sm-mobile': ['14px', '20px'],
        'base-mobile': ['16px', '24px'],
      }
    },
  },
  plugins: [],
};
