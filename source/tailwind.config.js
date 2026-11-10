/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        // the PowerPoint workspace around a slide
        canvas: "#E3E5EA",
        slide: "#FFFFFF",
        // consulting navy, used as ink and as the slide-show background
        ink: { DEFAULT: "#0D1B2E", soft: "#4C576A", faint: "#8A93A3" },
        night: { DEFAULT: "#081222", raised: "#0F1C30", line: "#1E2C44" },
        cobalt: { DEFAULT: "#2448E5", bright: "#4F6BFF", soft: "#DCE3FF" },
        // PowerPoint's smart-guide red, used only for alignment guides
        guide: "#EE4B36",
        hairline: "#C8CDD7",
        // shadcn tokens (kept so generated shadcn components drop in cleanly)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
      },
      fontFamily: {
        sans: ['"Archivo Variable"', "Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // a classic typographic scale: 13 / 15 / 17 / 21 / 28 / 40 / 56 / 80
        caption: ["0.8125rem", { lineHeight: "1.35rem" }],
        small: ["0.9375rem", { lineHeight: "1.5rem" }],
        body: ["1.0625rem", { lineHeight: "1.7rem" }],
        lead: ["1.3125rem", { lineHeight: "1.95rem" }],
        h4: ["1.75rem", { lineHeight: "2.2rem", letterSpacing: "-0.01em" }],
        h3: ["2.5rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
        h2: ["clamp(2.5rem, 5.2vw, 4.5rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        h1: ["clamp(3rem, 8.4vw, 8.25rem)", { lineHeight: "0.9", letterSpacing: "-0.035em" }],
      },
      borderRadius: { slide: "4px" },
      boxShadow: {
        slide: "0 1px 2px rgba(13,27,46,.06), 0 12px 32px -8px rgba(13,27,46,.18), 0 40px 80px -24px rgba(13,27,46,.22)",
        glass: "inset 0 1px 0 rgba(255,255,255,.5), 0 10px 30px -10px rgba(13,27,46,.25)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        blink: { "0%,45%": { opacity: "1" }, "50%,95%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        blink: "blink 1.05s step-end infinite",
      },
    },
  },
  plugins: [],
}
