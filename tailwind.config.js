/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter Tight', 'sans-serif'],
        russo: ['Russo One', 'sans-serif']
      }
    },
  },
  plugins: [],
}

