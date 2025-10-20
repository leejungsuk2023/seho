import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 세호 브랜드 컬러
        primary: {
          DEFAULT: "#FF6B6B",
          50: "#FFE9E9",
          100: "#FFD4D4",
          200: "#FFAAAA",
          300: "#FF7F7F",
          400: "#FF5555",
          500: "#FF6B6B", // Main
          600: "#FF4040",
          700: "#FF1616",
          800: "#EB0000",
          900: "#B80000",
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          50: "#E8F9F8",
          100: "#D1F3F0",
          200: "#A3E7E2",
          300: "#75DBD3",
          400: "#47CFC5",
          500: "#4ECDC4", // Main
          600: "#3BA49D",
          700: "#2C7B76",
          800: "#1D524E",
          900: "#0E2927",
        },
        background: "#F7F9FC",
        text: {
          DEFAULT: "#2D3748",
          light: "#718096",
          lighter: "#A0AEC0",
        },
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

