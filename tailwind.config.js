/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0b0f19",
          sidebar: "#0d121f",
          card: "#111827",
          panel: "#162032",
          border: "#1e293b",
          "border-light": "#334155",
          accent: "#38bdf8",
          primary: "#0284c7",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          purple: "#a855f7",
          text: "#f1f5f9",
          muted: "#94a3b8",
          dim: "#64748b"
        }
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      }
    },
  },
  plugins: [],
};
