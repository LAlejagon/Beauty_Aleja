import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rosa: "#ec407a",
        // Añade los colores del diseño original
        primary: {
          500: "#6366F1",
          600: "#4F46E5",  
        },
        dark: "#1E293B", 
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // Asegúrate que esté activado
  },
} satisfies Config;