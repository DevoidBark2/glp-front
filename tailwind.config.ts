import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,html,css}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleFadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        }
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        fadeOut: "fadeOut 0.3s ease-in",
        scaleFadeIn: "scaleFadeIn 0.4s ease-out",
        scaleFadeOut: "scaleFadeOut 0.3s ease-in",
      },
    },
  },
  plugins: [],
  darkMode: 'class'
};
export default config;
