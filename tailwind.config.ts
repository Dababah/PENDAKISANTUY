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
        forest: {
          50: "#f2f7f2",
          100: "#e0ece0",
          200: "#c2d9c3",
          300: "#96be98",
          400: "#649b67",
          500: "#427d46",
          600: "#316235",
          700: "#284f2c",
          800: "#214025",
          900: "#1c3520",
        },
        earth: {
          50: "#fdf8f0",
          100: "#faecd8",
          200: "#f4d6af",
          300: "#ecb87d",
          400: "#e29249",
          500: "#d97426",
          600: "#c45c1c",
          700: "#a34519",
          800: "#83391b",
          900: "#6b3019",
        },
        stone: {
          50: "#f8f7f4",
          100: "#efeee8",
          200: "#dddbd1",
          300: "#c5c1b2",
          400: "#aaa390",
          500: "#958d78",
          600: "#86796a",
          700: "#706459",
          800: "#5e544c",
          900: "#4e4540",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
