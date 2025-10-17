/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'project-bg': '#DCFFDB',
        'project-text': '#D9D9D9',
        'gradient-start': '#34D073',
        'gradient-end': '#1DA076',
          'green': '#22c55e',
      },
      backgroundColor: {
        'primary': '#DCFFDB',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90.25deg, #34D073 0.21%, #1DA076 99.78%)',
        'gradient-primary-vertical': 'linear-gradient(180deg, #34D073 0%, #1DA076 100%)',
        'gradient-primary-radial': 'radial-gradient(circle, #34D073 0%, #1DA076 100%)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}