/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your file paths
  ],
  theme: {
    extend: {
      fontFamily: {
        plusJakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],

}

