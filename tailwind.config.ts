import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          bg: "#FAF8F5",
          surface: "#F4F0E8",
          card: "#FFFFFF",
          border: "#E9E5DD",
          dark: "#141311",
          muted: "#736E66",
          accent: "#EA580C",
          accentHover: "#C2410C",
          accentLight: "#FFF4ED",
          accentGlow: "rgba(234, 88, 12, 0.15)",
          success: "#16A34A",
          successLight: "#F0FDF4",
          warning: "#CA8A04",
          warningLight: "#FEFCE8",
          info: "#0284C7",
          infoLight: "#F0F9FF",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        pulseSubtle: "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
