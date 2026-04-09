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
          bg: "#0a0e14",
          card: "#151b27",
          border: "#1f2937",
          accent: "#2d3e52",
        },
        accent: {
          green: "#00ff88",
          blue: "#00d4ff",
          red: "#ff4757",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 136, 0.15)",
        "glow-blue": "0 0 20px rgba(0, 212, 255, 0.15)",
        "glow-red": "0 0 20px rgba(255, 71, 87, 0.15)",
      },
    },
  },
  plugins: [],
}
