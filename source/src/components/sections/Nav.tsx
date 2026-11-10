import * as React from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { Download, Menu, X } from "lucide-react"
import { person } from "@/data/portfolio"
import { cn } from "@/lib/utils"
import { EASE, useSmoothScroll } from "@/components/primitives"

const LINKS = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

export default function Nav() {
  const { scrollTo } = useSmoothScroll()
  const [active, setActive] = React.useState<string>("")
  const [dark, setDark] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  // which section is under the nav, and is it a dark one
  React.useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 600 && !open)
      last = y
      const probe = 40
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"))
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) {
          setDark(el.dataset.tone === "dark")
          setActive(el.dataset.section || "")
          break
        }
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollTo(`#${id}`, { offset: id === "work" ? 0 : -20 })
  }

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: hidden ? 0 : 0.2 }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5"
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative flex w-full max-w-[880px] items-center justify-between gap-2 overflow-hidden rounded-full py-1.5 pl-2 pr-1.5 transition-colors duration-500",
            dark ? "glass-dark text-white" : "glass text-ink",
          )}
        >
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
            aria-label="Back to top"
          >
            <span className={cn("grid h-9 w-9 place-items-center rounded-full text-caption font-bold type-wide", dark ? "bg-white text-ink" : "bg-ink text-white")}>
              AS
            </span>
            <span className="hidden text-small font-semibold sm:inline">Asish Kumar Sahoo</span>
          </button>

          <ul className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-small transition-colors",
                    active === l.id ? "font-semibold" : dark ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {active === l.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 rounded-full", dark ? "bg-white/12" : "bg-ink/[0.07]")}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={person.resume}
              download={person.resumeFileName}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors",
                dark ? "bg-white text-ink hover:bg-cobalt-bright hover:text-white" : "bg-ink text-white hover:bg-cobalt",
              )}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Résumé</span>
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* reading progress along the bottom edge of the pill */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className={cn("absolute bottom-0 left-6 right-6 h-[2px] origin-left rounded-full", dark ? "bg-cobalt-bright" : "bg-cobalt")}
          />
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-night/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.ul
              initial={{ y: -20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="glass absolute inset-x-3 top-20 space-y-1 rounded-3xl p-3"
              onClick={(e) => e.stopPropagation()}
            >
              {LINKS.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1, ease: EASE }}>
                  <button type="button" onClick={() => go(l.id)} className="type-semiwide w-full rounded-2xl px-4 py-3 text-left text-h4 font-bold text-ink hover:bg-ink/5">
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
