import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./ui/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    boxShadow: {
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      primary: "0px 20px 20px -15px",
    },
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["active", "hover"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-themer")({
      defaultTheme: {
        extend: {
          colors: {
            gray: {
              50: "#f9fafb",
              100: "#f3f4f6",
              200: "#e5e7eb",
              300: "#d1d5db",
              400: "#9ca3af",
              500: "#6b7280",
              600: "#4b5563",
              700: "#374151",
              800: "#1f2937",
              900: "#18181b",
              950: "#030712",
            },
            primary: {
              DEFAULT: "#fb923c",
              400: "#fdba74",
              500: "#fb923c",
              600: "#f97316",
            },
          },
        },
      },
      themes: [
        {
          name: "dark",
          boxShadow: {
            md: "0 4px 6px -1px rgba(256, 256, 256, 0.1), 0 2px 4px -1px rgba(256, 256, 256, 0.06)",
            primary: "0px 20px 20px -15px",
          },
          extend: {
            colors: {
              gray: {
                50: "#030712",
                100: "#18181b",
                200: "#1f2937",
                300: "#374151",
                400: "#4b5563",
                500: "#6b7280",
                600: "#9ca3af",
                700: "#d1d5db",
                800: "#e5e7eb",
                900: "#f3f4f6",
                950: "#f9fafb",
              },
              primary: {
                DEFAULT: "#2563eb",
                400: "#3b82f6",
                500: "#2563eb",
                600: "#1d4ed8",
              },
            },
          },
        },
      ],
    }),
  ],
};

export default config;
