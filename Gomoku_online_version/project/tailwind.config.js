/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pop': 'pop 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};