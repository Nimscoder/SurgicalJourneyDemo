import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef8f0",
          100: "#fdeed9",
          200: "#fadab4",
          300: "#f6be86",
          400: "#f19a58",
          500: "#eb7a33",
          600: "#d95f22",
          700: "#b5461c",
          800: "#8f3619",
          900: "#722f17",
        },
      },
      boxShadow: {
        shell: "0 25px 80px -30px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "fade-in-up": "fadeInUp 500ms ease-out both",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "soft-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
