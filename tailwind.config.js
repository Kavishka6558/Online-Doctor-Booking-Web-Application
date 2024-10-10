/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#0081FB",
        yellowColor: "#FEB60D",
        lightBlueColor: "#ADD8E6",
        headingColor: "#181A1E",
        textColor : "#4E545F",
      },
    },
  },
  plugins: [],
}

