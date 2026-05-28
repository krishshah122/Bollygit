import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080608",
        surface: "#120f10",
        gold: "#d4a017",
        "gold-light": "#f0c040",
        red: "#c0392b",
        cream: "#f5e6c8",
        muted: "#6b5a4e",
        border: "#2a1f1a"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-lato)", "sans-serif"],
        hindi: ["var(--font-devanagari)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      boxShadow: {
        glow: "0 0 20px #d4a01766",
        poster: "0 30px 80px #00000070"
      },
      animation: {
        flicker: "flicker 4s infinite",
        grain: "grain 1.4s steps(2) infinite",
        clapper: "clapper 1.2s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease both",
        pop: "pop 0.35s ease"
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", textShadow: "0 0 24px #d4a01755" },
          "8%": { opacity: "0.92" },
          "10%": { opacity: "1" },
          "55%": { opacity: "0.96" },
          "56%": { opacity: "0.88" },
          "58%": { opacity: "1" }
        },
        grain: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "25%": { transform: "translate3d(-2%, 1%, 0)" },
          "50%": { transform: "translate3d(1%, -2%, 0)" },
          "75%": { transform: "translate3d(2%, 2%, 0)" },
          "100%": { transform: "translate3d(-1%, 0, 0)" }
        },
        clapper: {
          "0%, 100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
