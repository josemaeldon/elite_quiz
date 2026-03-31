/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "secondary-color": "var(--secondary-color)",
        "primary-color": "var(--primary-color)",
        "bg-success": "bg-green",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "text-color": "#0b012c",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      container: {
        // important: true,
        center: "true",
        paddingBottom: "500px",
        marginBottom: "200px",
        padding: {
          DEFAULT: "0.7rem",
          sm: "0.75rem",
          lg: "0.75rem",
          xl: "0.75rem",
        },
        screens: {
          xs: "100%",
          sm: "100%",
          md: "720px",
          lg: "960px",
          xl: "1150px",
          xxl: "1440px",
        },
      },
      screens: {
        "max-320": {
          max: "320px",
        },
        "max-399": {
          max: "399px",
        },
        "max-767": {
          max: "767px",
        },
        "max-991": {
          max: "991px",
        },
        "max-960": {
          max: "960px",
        },
        "max-1200": {
          max: "1199px",
        },
        "max-479": {
          max: "479px",
        },
        "max-575": {
          max: "575px",
        },
        "min-1025": {
          min: "1025px",
        },
        "between-400-575": {
          min: "400px",
          max: "575px",
        },
        "between-480-575": {
          min: "480px",
          max: "575px",
        },
        "between-576-767": {
          min: "576px",
          max: "767px",
        },
        "between-767-910": {
          min: "767px",
          max: "910px",
        },
        "between-992-1199": {
          min: "992px",
          max: "1199px",
        },
        "between-1200-1399": {
          min: "1200px",
          max: "1399px",
        },
      },
      boxShadow: {
        dialogShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        closeBtnShadow: "10px 10px lightblue",
        dropdownShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        updown: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-10px)",
          },
        },
        zoominout: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.67)" },
          "100%": { transform: "scale(1)" },
        },
        headerSlideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        updown: "updown 1s ease-in-out infinite alternate",
        zoominout: "zoominout 4s ease-in infinite alternate",
        headerSlideDown: "headerSlideDown 0.8s ease forwards",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      transitionDuration: {
        0: "0ms",
        2000: "2000ms",
        600: "0.6s",
      },
      transitionTimingFunction: {
        "header-ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
      },
      transitionDelay: {
        200: "0.2s",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
