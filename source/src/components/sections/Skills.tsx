import * as React from "react"
import { motion } from "framer-motion"
import { capabilities } from "@/data/portfolio"
import { Ascend, EASE, Reveal } from "@/components/primitives"

function Row({ area, items, i }: { area: string; items: string[]; i: number }) {
  const ref = React.useRef<HTMLLIElement>(null)
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`)
    ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <motion.li
      ref={ref}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
      className="group relative grid gap-5 overflow-hidden border-t border-ink/12 px-1 py-8 md:grid-cols-[280px_1fr] md:gap-10 md:px-4"
    >
      {/* spotlight that follows the pointer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(36,72,229,.09), transparent 60%)" }}
      />
      <h3 className="type-semiwide relative text-lead font-bold transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-2">
        {area}
      </h3>
      <ul className="relative flex flex-wrap gap-2">
        {items.map((it, k) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 + k * 0.03, ease: EASE }}
            className="rounded-full bg-white px-3.5 py-1.5 text-small text-ink shadow-[0_0_0_1px_rgba(13,27,46,.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-white"
          >
            {it}
          </motion.li>
        ))}
      </ul>
    </motion.li>
  )
}

export default function Skills() {
  return (
    <section id="skills" data-section="skills" data-tone="light" aria-labelledby="skills-title" className="relative bg-canvas px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Ascend as="h2" id="skills-title" text="What goes into the deck." className="type-wide text-h2 font-extrabold lg:col-span-8" />
          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="max-w-[40ch] text-body text-ink-soft">Design craft, consulting communication and the tools that consulting teams actually use.</p>
          </Reveal>
        </div>
        <ul className="mt-16 border-b border-ink/12">
          {capabilities.map((c, i) => (
            <Row key={c.area} area={c.area} items={c.items} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
