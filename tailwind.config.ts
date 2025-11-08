import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./stores/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ch0435 inspired color palette
        primary: {
          purple: "#9b87f5",
          pink: "#f093fb",
          blue: "#4facfe",
          orange: "#ff6b35",
        },
        background: {
          cream: "#f5f1e8",
          dark: "#1a1a1a",
          overlay: "rgba(0, 0, 0, 0.6)",
        },
        text: {
          DEFAULT: "#1a1a1a",
          light: "#ffffff",
          muted: "#666666",
          subtle: "#8c94a3",
        },
        brand: {
          serein: "#4facfe",
          studio: "#1a1a1a",
          swing: "#f093fb",
        },
        border: {
          DEFAULT: "#e5e7ef",
          light: "rgba(255, 255, 255, 0.2)",
          orange: "#ff6b35",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-kr)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-inter)",
          "var(--font-noto-sans-kr)",
          "Futura",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1.5rem",
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.15)",
        "card-hover": "0 20px 40px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(155, 135, 245, 0.4)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      backgroundImage: {
        "gradient-purple-pink":
          "linear-gradient(135deg, #9b87f5 0%, #f093fb 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #4facfe 0%, #9b87f5 100%)",
        "gradient-overlay":
          "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(155, 135, 245, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(155, 135, 245, 0.6)",
          },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
