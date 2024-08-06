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
        'sm': '640px',
        'md': '775px',
        'lg': '1024px',
      },
    },
  },
  plugins: [],
}

