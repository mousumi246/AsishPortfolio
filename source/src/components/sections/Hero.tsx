import * as React from "react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { person } from "@/data/portfolio"
import { Ascend, Button, EASE, Typewriter, useSmoothScroll } from "@/components/primitives"
import { cn } from "@/lib/utils"

/** Eight selection handles, like a selected object in PowerPoint. */
function Handles({ show, rotate = false, className }: { show: boolean; rotate?: boolean; className?: string }) {
  const pts = ["0% 0%", "50% 0%", "100% 0%", "100% 50%", "100% 100%", "50% 100%", "0% 100%", "0% 50%"]
  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={cn("pointer-events-none absolute -inset-[5px] border border-[#8A93A3]", className)}
    >
      {pts.map((p) => {
        const [x, y] = p.split(" ")
        return (
          <span
            key={p}
            className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6B7484] bg-white"
            style={{ left: x, top: y }}
          />
        )
      })}
      {rotate ? (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[22px]">
          <span className="block h-[11px] w-[11px] rounded-full border border-[#6B7484] bg-white" />
        </span>
      ) : null}
    </motion.div>
  )
}

function Chip({
  children,
  className,
  px,
  py,
  depth,
  delay,
}: {
  children: React.ReactNode
  className?: string
  px: MotionValue<number>
  py: MotionValue<number>
  depth: number
  delay: number
}) {
  const x = useTransform(px, (v) => v * depth)
  const y = useTransform(py, (v) => v * depth)
  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.8, ease: EASE }}
      className={cn("glass absolute z-20 rounded-2xl px-4 py-3", className)}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const slideRef = React.useRef<HTMLDivElement>(null)
  const photoRef = React.useRef<HTMLDivElement>(null)
  const [phase, setPhase] = React.useState<"guides" | "snapped" | "done">(reduce ? "done" : "guides")
  const [photoHover, setPhotoHover] = React.useState(false)
  const [guide, setGuide] = React.useState({ top: 0, left: 0, right: 0, bottom: 0 })

  // pointer position inside the slide: drives the crosshair, rulers and parallax
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const [inside, setInside] = React.useState(false)
  const [ruler, setRuler] = React.useState({ x: 0, y: 0 })
  const pxRaw = useMotionValue(0)
  const pyRaw = useMotionValue(0)
  const px = useSpring(pxRaw, { stiffness: 80, damping: 18 })
  const py = useSpring(pyRaw, { stiffness: 80, damping: 18 })
  const photoRotX = useTransform(py, (v) => v * -4)
  const photoRotY = useTransform(px, (v) => v * 5)

  React.useEffect(() => {
    if (reduce) return
    const t1 = window.setTimeout(() => setPhase("snapped"), 1500)
    const t2 = window.setTimeout(() => setPhase("done"), 3000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [reduce])

  // where the alignment guides sit: the edges of the picture placeholder
  React.useLayoutEffect(() => {
    const measure = () => {
      const s = slideRef.current?.getBoundingClientRect()
      const p = photoRef.current?.getBoundingClientRect()
      if (!s || !p) return
      setGuide({ top: p.top - s.top, left: p.left - s.left, right: p.right - s.left, bottom: p.bottom - s.top })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (slideRef.current) ro.observe(slideRef.current)
    return () => ro.disconnect()
  }, [])

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !slideRef.current) return
    const r = slideRef.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    mx.set(x)
    my.set(y)
    pxRaw.set((x / r.width - 0.5) * 2)
    pyRaw.set((y / r.height - 0.5) * 2)
    // a 13.33 in wide slide, as PowerPoint measures a 16:9 deck
    setRuler({ x: (x / r.width) * 13.33, y: (y / r.height) * 7.5 })
  }

  const showGuides = phase !== "done"

  return (
    <section
      id="top"
      data-section="top"
      data-tone="light"
      className="relative overflow-hidden bg-canvas pb-10 pt-24 sm:pt-28"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6">
        <div
          className="relative mx-auto lg:pl-6 lg:pt-6"
          style={{ width: "min(100%, calc((100svh - 150px) * 1.7778 + 24px))" }}
        >
          {/* rulers */}
          <div aria-hidden="true" className="ruler-x absolute left-6 right-0 top-0 hidden h-5 border-b border-hairline bg-white/50 lg:block">
            <motion.span style={{ x: mx }} className={cn("absolute bottom-0 h-full w-px bg-guide transition-opacity", inside ? "opacity-100" : "opacity-0")} />
            <span className={cn("absolute right-2 top-0.5 text-[10px] tabular text-ink-soft transition-opacity", inside ? "opacity-100" : "opacity-0")}>
              {ruler.x.toFixed(2)} in
            </span>
          </div>
          <div aria-hidden="true" className="ruler-y absolute bottom-0 left-0 top-6 hidden w-5 border-r border-hairline bg-white/50 lg:block">
            <motion.span style={{ y: my }} className={cn("absolute right-0 h-px w-full bg-guide transition-opacity", inside ? "opacity-100" : "opacity-0")} />
          </div>

          {/* the slide */}
          <motion.div
            ref={slideRef}
            onPointerMove={onMove}
            onPointerEnter={() => setInside(true)}
            onPointerLeave={() => {
              setInside(false)
              pxRaw.set(0)
              pyRaw.set(0)
            }}
            initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative rounded-slide bg-slide shadow-slide lg:aspect-video"
          >
            {/* crosshair that follows the pointer */}
            <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 hidden overflow-hidden transition-opacity duration-300 lg:block", inside ? "opacity-100" : "opacity-0")}>
              <motion.div style={{ x: mx }} className="absolute inset-y-0 left-0 w-0 border-l border-dashed border-guide/45" />
              <motion.div style={{ y: my }} className="absolute inset-x-0 top-0 h-0 border-t border-dashed border-guide/45" />
            </div>

            {/* alignment guides that flash as the picture snaps into place */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
              {[
                { key: "t", style: { top: guide.top, left: 0, right: 0 }, cls: "h-0 border-t", axis: "x" },
                { key: "b", style: { top: guide.bottom, left: 0, right: 0 }, cls: "h-0 border-t", axis: "x" },
                { key: "l", style: { left: guide.left, top: 0, bottom: 0 }, cls: "w-0 border-l", axis: "y" },
              ].map((g, i) => (
                <motion.div
                  key={g.key}
                  initial={{ opacity: 0, [g.axis === "x" ? "scaleX" : "scaleY"]: 0 }}
                  animate={{ opacity: showGuides ? 1 : 0, [g.axis === "x" ? "scaleX" : "scaleY"]: 1 }}
                  transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease: EASE }}
                  style={g.style}
                  className={cn("absolute origin-left border-dashed border-guide", g.cls, g.axis === "y" && "origin-top")}
                />
              ))}
            </div>

            <div className="relative grid h-full grid-cols-1 gap-10 p-6 pb-16 sm:p-10 sm:pb-16 lg:grid-cols-12 lg:gap-8 lg:p-[4.2%] lg:pb-[5.5%]">
              {/* left: title and story */}
              <div className="flex flex-col justify-between gap-8 lg:col-span-7">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
                  className="text-small text-ink-soft"
                >
                  {person.role} in {person.location.split(",")[0]}
                </motion.p>

                <div>
                  <h1 aria-label={person.name} className="type-wide font-extrabold leading-[0.86] tracking-[-0.045em] text-ink" style={{ fontSize: "clamp(3rem, min(7vw, 11.5vh), 8.5rem)" }}>
                    {["Asish", "Kumar", "Sahoo"].map((w, i) => (
                      <Ascend key={w} as="span" text={w} by="char" immediate delay={0.4 + i * 0.14} stagger={0.035} className="block" />
                    ))}
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.25, duration: 0.8, ease: EASE }}
                    className="mt-7 max-w-[34ch] text-lead text-ink sm:text-[1.5rem] sm:leading-[2rem]"
                  >
                    I turn <Typewriter words={person.typewriter} startDelay={1700} className="font-semibold text-cobalt" />
                    <br className="hidden sm:block" /> into executive-ready slides.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.55, duration: 0.8, ease: EASE }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <Button onClick={() => scrollTo("#work")} icon={<ArrowDown className="h-4 w-4" />}>
                    See the work
                  </Button>
                  <Button href={person.resume} download={person.resumeFileName} variant="outline" icon={<Download className="h-4 w-4" />}>
                    Download résumé
                  </Button>
                </motion.div>
              </div>

              {/* right: the picture placeholder */}
              <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
                <motion.div
                  ref={photoRef}
                  onPointerEnter={() => setPhotoHover(true)}
                  onPointerLeave={() => setPhotoHover(false)}
                  initial={reduce ? false : { opacity: 0, x: 70, y: -40, rotate: -6, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  transition={{ delay: 0.75, type: "spring", stiffness: 120, damping: 14, mass: 0.9 }}
                  style={{ rotateX: photoRotX, rotateY: photoRotY, transformPerspective: 900 }}
                  className="relative aspect-[4/5] w-[min(78vw,360px)] lg:h-full lg:w-auto lg:max-w-full"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-[#C9D1DE]">
                    <motion.img
                      src={person.portrait}
                      alt={`Portrait of ${person.name}`}
                      initial={{ scale: 1.15, filter: "blur(10px)" }}
                      animate={{ scale: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.9, duration: 1.4, ease: EASE }}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
                  </div>
                  <Handles show={phase === "guides" || phase === "snapped" || photoHover} rotate />

                  <Chip px={px} py={py} depth={-14} delay={1.9} className="-left-6 top-[12%] sm:-left-16">
                    <p className="text-caption text-ink-soft">2024 – 2026</p>
                    <p className="text-small font-semibold">Visual Analyst, McKinsey</p>
                  </Chip>
                  <Chip px={px} py={py} depth={18} delay={2.05} className="-right-3 bottom-[16%] sm:-right-8">
                    <p className="text-caption text-ink-soft">2026</p>
                    <p className="text-small font-semibold">Consultant, Deloitte</p>
                  </Chip>
                </motion.div>
              </div>
            </div>

            {/* slide footer, the way consulting decks carry a source line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.8 }}
              className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-6 text-caption text-ink-faint sm:inset-x-10 lg:inset-x-[4.2%] lg:bottom-[3.2%]"
            >
              <span>Source: 3+ years of decks for McKinsey &amp; Company, Deloitte and Halonix teams</span>
              <span className="tabular">1</span>
            </motion.div>
          </motion.div>

          {/* PowerPoint's notes pane, holding the summary */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8, ease: EASE }}
            className="mt-3 flex flex-col gap-1 rounded-slide border border-hairline bg-white/55 px-5 py-4 sm:flex-row sm:gap-8 sm:px-6"
          >
            <span className="shrink-0 pt-0.5 text-caption text-ink-faint">Speaker notes</span>
            <p className="max-w-[88ch] text-small text-ink-soft">{person.summary}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
