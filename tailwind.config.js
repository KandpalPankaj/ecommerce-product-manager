/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      maxHeight: {
        "80vh": "80vh",
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      cursor: {
        grab: "grab",
        grabbing: "grabbing",
      },
      transitionProperty: {
        all: "all",
      },
      zIndex: {
        50: "50",
      },
    },
  },
  plugins: [],
};
