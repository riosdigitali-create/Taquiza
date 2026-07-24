/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "bg-black": "#0a0a0a",
        carbon: "#1a1a1a",
        white: "#ffffff",
        smoke: "#e5e5e5",
        ember: "#a8281f",
        gold: "#c9a227",
      },
      fontFamily: {
        heading: ["Bricolage Grotesque", "Manrope", "Inter", "sans-serif"],
        body: ["Manrope", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest2: "-0.04em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
