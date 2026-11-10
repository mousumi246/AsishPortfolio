import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react"
import type { Project } from "@/data/portfolio"
import { EASE, useSmoothScroll } from "@/components/primitives"
import { cn } from "@/lib/utils"

type Props = {
  project: Project | null
  startAt: number
  onClose: () => void
}

export default function CaseStudy({ project, startAt, onClose }: Props) {
  const { stop, start } = useSmoothScroll()
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const lastFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!project) return
    lastFocus.current = document.activeElement as HTMLElement
    stop()
    const t = window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      window.clearTimeout(t)
      start()
      lastFocus.current?.focus?.()
    }
  }, [project, stop, start])

  return (
    <AnimatePresence>
      {project ? <Panel key={project.id} project={project} startAt={startAt} onClose={onClose} closeRef={closeRef} /> : null}
    </AnimatePresence>
  )
}

function Panel({
  project,
  startAt,
  onClose,
  closeRef,
}: {
  project: Project
  startAt: number
  onClose: () => void
  closeRef: React.RefObject<HTMLButtonElement>
}) {
  const reduce = useReducedMotion()
  const hasSlides = project.slides.length > 0
  const total = hasSlides ? project.slides.length : 0
  const [[index, dir], setState] = React.useState<[number, number]>([Math.min(startAt, Math.max(0, total - 1)), 0])
  const stripRef = React.useRef<HTMLDivElement>(null)

  const go = React.useCallback(
    (d: number) => {
      if (!total) return
      setState(([i]) => [(i + d + total) % total, d])
    },
    [total],
  )
  const jump = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const root = document.getElementById("case-dialog")
        const f = Array.from(root?.querySelectorAll<HTMLElement>("button, a[href]") ?? []).filter((el) => !el.hasAttribute("disabled"))
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, onClose])

  // keep the active thumbnail in view
  React.useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "center" })
  }, [index, reduce])

  const slide = hasSlides ? project.slides[index] : null

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-stretch justify-center p-0 sm:p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-0 bg-night/75 backdrop-blur-xl" onClick={onClose} aria-hidden="true" />

      <motion.div
        id="case-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: 0.6, ease: EASE }}
        data-lenis-prevent
        className="glass-dark relative flex h-full w-full max-w-[1500px] flex-col overflow-y-auto overscroll-contain text-white sm:rounded-[28px] lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden"
      >
        {/* stage */}
        <div className="relative flex min-h-0 flex-col p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8">
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <p className="text-small text-white/60">{project.folder}</p>
            {hasSlides ? (
              <p className="tabular text-small text-white/60">
                {index + 1} / {total}
              </p>
            ) : null}
          </div>

          {hasSlides && slide ? (
            <>
              <div className="relative flex h-[60vw] max-h-[58vh] items-center justify-center overflow-hidden lg:h-auto lg:max-h-none lg:min-h-0 lg:flex-1">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.figure
                    key={index}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 90, scale: reduce ? 1 : 0.97, filter: "blur(6px)" }),
                      center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
                      exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -90, scale: reduce ? 1 : 0.97, filter: "blur(6px)" }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: EASE }}
                    drag={reduce ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -70) go(1)
                      else if (info.offset.x > 70) go(-1)
                    }}
                    className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing sm:inset-x-14"
                  >
                    <img
                      src={slide.src}
                      alt={slide.title}
                      draggable={false}
                      className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10"
                    />
                  </motion.figure>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className="glass-dark absolute left-2 top-1/2 z-10 sm:left-0 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full transition hover:scale-105 hover:bg-white/15"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="glass-dark absolute right-2 top-1/2 z-10 sm:right-0 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full transition hover:scale-105 hover:bg-white/15"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="min-w-0 truncate text-small text-white/85"
                  >
                    {slide.title}
                  </motion.p>
                </AnimatePresence>
                {slide.kind ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 text-caption",
                      slide.kind === "Source" ? "bg-white/10 text-white/70" : slide.kind === "Option" ? "bg-cobalt/30 text-white" : "bg-cobalt text-white",
                    )}
                  >
                    {slide.kind === "Source" ? "Source input" : slide.kind === "Option" ? "Alternative version" : "Final slide"}
                  </span>
                ) : null}
              </div>

              <div ref={stripRef} className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" data-lenis-prevent>
                {project.slides.map((sl, i) => (
                  <button
                    key={sl.src}
                    type="button"
                    data-i={i}
                    onClick={() => jump(i)}
                    aria-label={`Slide ${i + 1}: ${sl.title}`}
                    aria-current={i === index}
                    className={cn(
                      "relative aspect-video w-24 shrink-0 overflow-hidden rounded-[4px] ring-1 transition sm:w-28",
                      i === index ? "opacity-100 ring-2 ring-cobalt-bright" : "opacity-45 ring-white/10 hover:opacity-80",
                    )}
                  >
                    <img src={sl.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* decks too large to mirror here: an outline view and a link to the original */
            <div className="flex flex-1 flex-col justify-center py-4">
              <div className="mx-auto w-full max-w-2xl">
                <p className="mb-5 text-small text-white/60">Outline view</p>
                <ol className="space-y-2">
                  {project.outline?.map((t, i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
                    >
                      <span className="grid h-12 w-20 shrink-0 place-items-center rounded-[4px] bg-white text-caption font-bold text-ink tabular">{i + 1}</span>
                      <span className="text-body text-white/90">{t}</span>
                    </motion.li>
                  ))}
                </ol>
                {project.highlights ? (
                  <dl className="mt-8 grid grid-cols-3 gap-3">
                    {project.highlights.map((h) => (
                      <div key={h.label} className="rounded-xl border border-white/10 p-4">
                        <dt className="text-caption text-white/55">{h.label}</dt>
                        <dd className="type-semiwide mt-1 text-[clamp(1.2rem,2.4vw,1.9rem)] font-bold tabular">{h.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <a
                  href={project.driveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-small font-semibold text-ink transition hover:bg-cobalt-bright hover:text-white"
                >
                  Open the full deck in Google Drive <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* story */}
        <aside className="relative min-h-0 border-t lg:overflow-y-auto border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0" data-lenis-prevent>
          <p className="pr-12 text-small text-cobalt-bright">{project.context}</p>
          <h2 id="case-title" className="type-semiwide mt-3 text-[1.9rem] font-bold leading-[1.08] tracking-[-0.02em]">
            {project.title}
          </h2>
          <p className="mt-4 text-small text-white/75">{project.summary}</p>

          <h3 className="mt-8 text-small font-semibold">The brief</h3>
          <p className="mt-2 text-small text-white/70">{project.brief}</p>

          <h3 className="mt-8 text-small font-semibold">What I did</h3>
          <ul className="mt-3 space-y-3">
            {project.did.map((d) => (
              <li key={d} className="relative pl-5 text-small text-white/75">
                <span className="absolute left-0 top-[0.62rem] h-[2px] w-2.5 bg-cobalt-bright" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-small font-semibold">Tools</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((t) => (
              <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-caption text-white/80">
                {t}
              </li>
            ))}
          </ul>

          <a
            href={project.driveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="link-underline mt-8 inline-flex items-center gap-2 pb-0.5 text-small font-semibold text-white"
          >
            View the original file in Google Drive <ExternalLink className="h-4 w-4" />
          </a>
        </aside>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition hover:rotate-90 hover:bg-cobalt-bright hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  )
}
