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
        background: "#080c14",
        surface:    "#0c1624",
        border:     "#1a2840",
        accent:     "#00e676",
        accentHover:"#00c853",
        accentDark: "#00a846",
        success:    "#10B981",
        warning:    "#F59E0B",
        danger:     "#EF4444",
        text:       "#F8FAFC",
        muted:      "#64748B",
      },
      backgroundImage: {
        'glow-cyan':  'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.18) 0%, transparent 70%)',
        'glow-green': 'radial-gradient(circle at 50% 50%, rgba(0,230,118,0.18) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-green': '0 0 40px rgba(0,230,118,0.2)',
        'glow-sm':    '0 0 20px rgba(0,230,118,0.12)',
        'glow-btn':   '0 4px 30px rgba(0,230,118,0.35)',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
