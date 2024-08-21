/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        '2xs': '0px',
        'xs': '360px',
        'sm': '700px',
        'md': '900px',
        'lg': '1200px',
      },
    },
  },
  plugins: [],
}

