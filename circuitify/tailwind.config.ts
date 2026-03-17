import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf4",
          100: "#d6f5e3",
          200: "#b0eacc",
          300: "#7ddaae",
          400: "#48c28c",
          500: "#26a872",
          600: "#18875b",
          700: "#146c4b",
          800: "#13563d",
          900: "#114734",
          950: "#08281e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
