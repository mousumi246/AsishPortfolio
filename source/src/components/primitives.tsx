import * as React from "react"
import Lenis from "lenis"
import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

export const EASE = [0.2, 0.8, 0.2, 1] as const

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */

type ScrollApi = {
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void
  stop: () => void
  start: () => void
}

const ScrollCtx = React.createContext<ScrollApi>({
  scrollTo: (t) => {
    const el = typeof t === "string" ? document.querySelector(t) : t
    if (el instanceof HTMLElement) el.scrollIntoView({ behavior: "smooth" })
    else if (typeof t === "number") window.scrollTo({ top: t, behavior: "smooth" })
  },
  stop: () => {},
  start: () => {},
})

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const lenisRef = React.useRef<Lenis | null>(null)

  React.useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  const api = React.useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, opts) => {
        const l = lenisRef.current
        if (l) l.scrollTo(target as never, { offset: opts?.offset ?? 0, immediate: opts?.immediate })
        else {
          const el = typeof target === "string" ? document.querySelector(target) : target
          if (el instanceof HTMLElement) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
          else if (typeof target === "number") window.scrollTo({ top: target })
        }
      },
      stop: () => {
        lenisRef.current?.stop()
        document.documentElement.style.overflow = "hidden"
      },
      start: () => {
        lenisRef.current?.start()
        document.documentElement.style.overflow = ""
      },
    }),
    [reduce],
  )

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>
}

export const useSmoothScroll = () => React.useContext(ScrollCtx)

/* ------------------------------------------------------------------ */
/* Ascend: words rise out of a mask                                    */
/* ------------------------------------------------------------------ */

type AscendProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean
  by?: "word" | "char"
  id?: string
}

export function Ascend({ text, as = "h2", className, delay = 0, stagger = 0.06, immediate, by = "word", id }: AscendProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(" ")
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
  const piece: Variants = {
    hidden: { y: reduce ? 0 : "108%", rotate: reduce ? 0 : 4, opacity: reduce ? 0 : 1 },
    show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: reduce ? 0.3 : 0.95, ease: EASE } },
  }
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -12% 0px" } }

  return (
    <Tag id={id} className={className} aria-label={text} {...trigger} variants={container}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {by === "char"
            ? Array.from(w).map((c, ci) => (
                <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span variants={piece} className="inline-block origin-bottom-left">
                    {c}
                  </motion.span>
                </span>
              ))
            : (
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span variants={piece} className="inline-block origin-bottom-left">
                    {w}
                  </motion.span>
                </span>
              )}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Reveal: fade and shift into place                                   */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  blur = true,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  blur?: boolean
  as?: "div" | "li" | "section" | "article" | "p"
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, x: reduce ? 0 : x, filter: blur && !reduce ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

export function Typewriter({
  words,
  className,
  startDelay = 0,
  typeMs = 58,
  deleteMs = 28,
  holdMs = 1700,
}: {
  words: string[]
  className?: string
  startDelay?: number
  typeMs?: number
  deleteMs?: number
  holdMs?: number
}) {
  const reduce = useReducedMotion()
  const [text, setText] = React.useState("")
  const [started, setStarted] = React.useState(false)

  React.useEffect(() => {
    if (reduce) return
    const t = window.setTimeout(() => setStarted(true), startDelay)
    return () => window.clearTimeout(t)
  }, [reduce, startDelay])

  React.useEffect(() => {
    if (!started || reduce) return
    let i = 0
    let len = 0
    let deleting = false
    let timer = 0
    const tick = () => {
      const word = words[i % words.length]
      if (!deleting) {
        len++
        setText(word.slice(0, len))
        if (len === word.length) {
          deleting = true
          timer = window.setTimeout(tick, holdMs)
          return
        }
        timer = window.setTimeout(tick, typeMs + Math.random() * 40)
      } else {
        len--
        setText(word.slice(0, len))
        if (len === 0) {
          deleting = false
          i++
          timer = window.setTimeout(tick, 320)
          return
        }
        timer = window.setTimeout(tick, deleteMs)
      }
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [started, reduce, words, typeMs, deleteMs, holdMs])

  return (
    <span className={cn("relative", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">{reduce ? words[0] : text}</span>
      <span aria-hidden="true" className="ml-[2px] inline-block h-[1.05em] w-[2px] translate-y-[0.14em] animate-blink bg-cobalt" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic: the element leans toward the pointer                     */
/* ------------------------------------------------------------------ */

export function Magnetic({ children, strength = 0.28, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }
  return (
    <motion.span ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("inline-block", className)}>
      {children}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnProps = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: "solid" | "outline" | "glass" | "light"
  download?: string
  external?: boolean
  className?: string
  icon?: React.ReactNode
}

export function Button({ children, href, onClick, variant = "solid", download, external, className, icon }: BtnProps) {
  const styles = {
    solid: "bg-ink text-white hover:bg-cobalt",
    outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
    glass: "glass-dark text-white hover:bg-white/15",
    light: "bg-white text-ink hover:bg-cobalt hover:text-white",
  }[variant]
  const cls = cn(
    "group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-6 text-small font-semibold transition-colors duration-300",
    styles,
    className,
  )
  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {icon ? <span className="transition-transform duration-500 group-hover:translate-x-0.5">{icon}</span> : null}
    </>
  )
  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          className={cls}
          download={download}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          onClick={onClick}
        >
          {inner}
        </a>
      ) : (
        <button type="button" className={cls} onClick={onClick}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
