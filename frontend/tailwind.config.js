/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agro-green': '#2E7D32',
        'agro-light': '#E8F5E9',
        'agro-dark': '#1B5E20',
        'agro-brown': '#795548',
        'agro-sky': '#E1F5FE',
      }
    },
  },
  plugins: [],
}

