/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-black-700": "#121212",
        "secondary-black-600": "#1D1D1D",
        "primary-white": "#FFFFFF",
        "secondary-white": "#C4C5C5",
        "light-blue": "#0077FF",
        "primary-indigo": "#5453E0",
        "primary-success": "#20BD5F",
        "primary-Darkred": "#F44336",
        "primary-pink-500": "#E91E63",
        "primary-hr-color": "#323232",
        "primary-black-400": "#323232",
        "gradient-violet": "#6B6AC3",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
