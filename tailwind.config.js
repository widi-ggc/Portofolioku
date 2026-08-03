/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F3EA",
        papersoft: "#FFFDF8",
        ink: "#161217",
        pink: "#FF3FA4",
        blue: "#2F4CFF",
        yellow: "#FFD400",
        green: "#00C08B",
        dangerc: "#E63950",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 #161217",
        "hard-lg": "8px 8px 0 #161217",
      },
      borderWidth: { 3: "3px" },
    },
  },
  plugins: [],
};
