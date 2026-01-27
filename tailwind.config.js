/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      screens: {
        md: { raw: '(min-height: 800px)' },
      },
      colors: {
        custom_background: '#292928',
        custom_accent: '#FF5500',
        custom_complement: '#3E3632',
        custom_border: '#1F1612',
      },
    },
  },
  plugins: [],
};
