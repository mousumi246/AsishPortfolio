import * as React from "react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, animate } from "framer-motion"
import { MoveHorizontal } from "lucide-react"
import { projects } from "@/data/portfolio"
import { Ascend, Button, EASE, Reveal } from "@/components/primitives"

const notes = [
  { title: "A title that states the finding", body: "“Strong momentum. Higher wins. Bigger deals.” replaces a topic label, so the board reads the conclusion first." },
  { title: "Four numbers, each against Q1", body: "Clients won, deal size, win rate and the lead over Competitor A sit in a single row of tiles." },
  { title: "One chart for the trend", body: "Win rate and the competitor's rate share one chart, so the crossover is the thing you see." },
  { title: "A takeaway in plain words", body: "A closing panel says what it means for the business, for anyone who skims." },
]

export default function Redesign({ open }: { open: (id: string, slide?: number) => void }) {
  const reduce = useReducedMotion()
  const ahead = projects.find((p) => p.id === "ahead")!
  const before = ahead.slides.find((s) => s.title.startsWith("Market momentum"))!
  const after = ahead.slides.find((s) => s.title.startsWith("Strong momentum"))!

  const frameRef = React.useRef<HTMLDivElement>(null)
  const pos = useMotionValue(50) // percent
  const smooth = useSpring(pos, { stiffness: 300, damping: 34 })
  const clip = useTransform(smooth, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(smooth, (v) => `${v}%`)
  const [dragging, setDragging] = React.useState(false)
  const [value, setValue] = React.useState(50)

  React.useEffect(() => smooth.on("change", (v) => setValue(Math.round(v))), [smooth])

  // a one-time sweep when it scrolls into view, to show that it moves
  const onView = () => {
    if (reduce) return
    animate(pos, [50, 82, 18, 50], { duration: 2.4, ease: "easeInOut", delay: 0.4 })
  }

  const setFromClient = (clientX: number) => {
    const r = frameRef.current?.getBoundingClientRect()
    if (!r) return
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <section data-section="work" data-tone="light" aria-labelledby="redesign-title" className="relative overflow-hidden bg-canvas px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Ascend as="h2" id="redesign-title" text="Same data, different meeting." className="type-wide text-h2 font-extrabold lg:col-span-7" />
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-[46ch] text-body text-ink-soft">
              AHEAD handed over a year of sales figures as a table. Drag across the slide to compare it with the version built for the board.
            </p>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, clipPath: reduce ? "inset(0 0 0 0)" : "inset(12% 8% 12% 8% round 12px)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 4px)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.1, ease: EASE }}
          onViewportEnter={onView}
          className="mt-14"
        >
          <div
            ref={frameRef}
            className="relative aspect-video w-full touch-pan-y select-none overflow-hidden rounded-slide bg-white shadow-slide"
            onPointerDown={(e) => {
              setDragging(true)
              ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
              setFromClient(e.clientX)
            }}
            onPointerMove={(e) => dragging && setFromClient(e.clientX)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            <img src={after.src} alt={`After: ${after.title}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="lazy" />
            <motion.img
              src={before.src}
              alt={`Before: ${before.title}`}
              style={{ clipPath: clip }}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              loading="lazy"
            />

            <span className="glass pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1.5 text-caption font-semibold text-ink">The data, as a table</span>
            <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink px-3 py-1.5 text-caption font-semibold text-white">The board slide</span>

            <motion.div style={{ left }} className="absolute inset-y-0 -translate-x-1/2">
              <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-cobalt" />
              <div
                role="slider"
                tabIndex={0}
                aria-label="Compare before and after"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={`${value}% of the original table showing`}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") pos.set(Math.max(0, pos.get() - 5))
                  if (e.key === "ArrowRight") pos.set(Math.min(100, pos.get() + 5))
                }}
                className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-cobalt text-white shadow-[0_8px_24px_-6px_rgba(36,72,229,.7)] ring-4 ring-white transition-transform active:scale-95"
              >
                <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.08} className="border-t border-ink/15 pt-5">
              <h3 className="text-body font-semibold">{n.title}</h3>
              <p className="mt-2 text-small text-ink-soft">{n.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <Button variant="outline" onClick={() => open("ahead", 0)}>
            See all three AHEAD slides
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
