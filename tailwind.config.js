/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-mode="dark"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        papersoft: "rgb(var(--c-papersoft) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        pink: "rgb(var(--c-pink) / <alpha-value>)",
        blue: "rgb(var(--c-blue) / <alpha-value>)",
        yellow: "rgb(var(--c-yellow) / <alpha-value>)",
        green: "rgb(var(--c-green) / <alpha-value>)",
        dangerc: "rgb(var(--c-dangerc) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 rgb(var(--c-ink))",
        "hard-lg": "8px 8px 0 rgb(var(--c-ink))",
      },
      borderWidth: { 3: "3px" },
    },
  },
  plugins: [],
};
