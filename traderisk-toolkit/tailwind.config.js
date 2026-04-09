/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f1419",
          card: "#1a1f2e",
          border: "#2a3042",
        },
        accent: {
          green: "#00ff88",
          blue: "#00d4ff",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 136, 0.2)",
        "glow-blue": "0 0 20px rgba(0, 212, 255, 0.2)",
      },
    },
  },
  plugins: [],
}
