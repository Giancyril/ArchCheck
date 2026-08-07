import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Color Palette ──────────────────────────────────────────────────────
      colors: {
        // Base — near-black slate surfaces
        base: {
          bg:      "#09090b",   // zinc-950 page background
          surface: "#18181b",   // zinc-900 card surfaces
          border:  "#27272a",   // zinc-800 borders
          hover:   "#3f3f46",   // zinc-700 hover borders
        },
        // Primary accent — cyan/teal
        accent: {
          DEFAULT: "#06b6d4",   // cyan-500
          hover:   "#0891b2",   // cyan-600
          dim:     "#083344",   // cyan-950 muted bg
          text:    "#67e8f9",   // cyan-300 readable on dark
        },
        // Severity palette
        severity: {
          critical: "#f43f5e",  // rose-500
          "critical-bg": "#1f0e14",
          warning:  "#f59e0b",  // amber-500
          "warning-bg": "#1c1408",
          info:     "#3b82f6",  // blue-500
          "info-bg": "#0c1424",
        },
        // Text hierarchy
        text: {
          1: "#fafafa",  // zinc-50  — primary
          2: "#a1a1aa",  // zinc-400 — secondary
          3: "#52525b",  // zinc-600 — muted/placeholder
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      fontSize: {
        xs:  ["0.75rem",  { lineHeight: "1rem" }],
        sm:  ["0.875rem", { lineHeight: "1.25rem" }],
        base:["1rem",     { lineHeight: "1.5rem" }],
        lg:  ["1.125rem", { lineHeight: "1.75rem" }],
        xl:  ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":["1.5rem",  { lineHeight: "2rem" }],
        "3xl":["1.875rem",{ lineHeight: "2.25rem" }],
      },

      // ── Spacing (4px / 8px grid) ───────────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "18":  "4.5rem",
        "88":  "22rem",
        "120": "30rem",
      },

      // ── Border Radius ──────────────────────────────────────────────────────
      borderRadius: {
        sm:  "0.375rem",   // 6px
        md:  "0.5rem",     // 8px
        lg:  "0.75rem",    // 12px
        xl:  "1rem",       // 16px
        "2xl":"1.5rem",    // 24px
      },

      // ── Animations ─────────────────────────────────────────────────────────
      animation: {
        "fade-in":    "fadeIn 0.2s ease forwards",
        "slide-up":   "slideUp 0.25s ease forwards",
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      // ── Box Shadows ────────────────────────────────────────────────────────
      boxShadow: {
        glow: "0 0 20px rgba(6, 182, 212, 0.15)",
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
