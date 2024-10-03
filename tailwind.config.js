/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Correct paths for Vue
  ],
  theme: {
    extend: {
      colors:{
        custom:'#FAFAFA',
      },
    },
  },
  plugins: [],
}
