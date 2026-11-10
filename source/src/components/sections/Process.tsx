import * as React from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { Ascend, EASE, Reveal } from "@/components/primitives"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Find the one message",
    body: "Read the brief, the numbers and the audience, then write the action title before drawing anything. Each slide argues one point.",
    tags: ["Executive summaries", "Message hierarchy"],
  },
  {
    title: "Storyboard the sequence",
    body: "Sketch the order of slides and the evidence each one needs, so the story holds up before any design time is spent.",
    tags: ["Storyboarding", "Slide sequencing"],
  },
  {
    title: "Make the evidence visual",
    body: "Choose the chart that answers the question: think-cell and Excel charts, process flows, timelines, icon-led summaries.",
    tags: ["think-cell", "Information design"],
  },
  {
    title: "Hold the brand line",
    body: "Build on the client's template and slide library, check every figure against its source, and hand over a clean, consistent file.",
    tags: ["Brand compliance", "Quality control"],
  },
]

export default function Process() {
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="process" data-section="process" data-tone="light" aria-labelledby="process-title" className="relative bg-canvas px-5 pb-28 sm:px-8 sm:pb-36">
      <div className="mx-auto grid max-w-[1180px] gap-14 border-t border-ink/15 pt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Ascend as="h2" id="process-title" text="How a brief becomes a slide." className="type-wide text-h2 font-extrabold" />
            <p className="mt-6 max-w-[38ch] text-body text-ink-soft">
              The same four steps, whether the deadline is a board meeting in two weeks or a design test in forty minutes.
            </p>

            <div className="mt-12 hidden items-end gap-5 lg:flex" aria-hidden="true">
              <div className="relative h-[7.5rem] w-[8.5rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="type-wide absolute bottom-0 left-0 text-[7.5rem] font-extrabold leading-none tracking-[-0.06em] text-cobalt tabular"
                  >
                    {active + 1}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="pb-3 text-small text-ink-soft">of {steps.length}</p>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7">
          <div className="absolute bottom-0 left-[15px] top-0 w-px bg-ink/15" aria-hidden="true">
            <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-cobalt" />
          </div>
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              onViewportEnter={() => setActive(i)}
              onViewportLeave={(entry) => {
                // scrolling back up past a step makes the previous one current
                if (entry && entry.boundingClientRect.top > 0 && i > 0) setActive(i - 1)
              }}
              viewport={{ margin: "-40% 0px -50% 0px" }}
              className="relative pb-16 pl-14 last:pb-0 lg:min-h-[26vh]"
            >
              <span
                className={cn(
                  "absolute left-0 top-0.5 grid h-8 w-8 place-items-center rounded-full border text-caption font-bold tabular transition-colors duration-500",
                  i <= active ? "border-cobalt bg-cobalt text-white" : "border-ink/25 bg-canvas text-ink-soft",
                )}
              >
                {i + 1}
              </span>
              <Reveal x={30} y={0}>
              <h3 className="type-semiwide text-h4 font-bold">{s.title}</h3>
              <p className="mt-3 max-w-[48ch] text-lead text-ink-soft">{s.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <li key={t} className="rounded-full bg-white px-3 py-1 text-caption text-ink-soft shadow-[0_0_0_1px_rgba(13,27,46,.08)]">
                    {t}
                  </li>
                ))}
              </ul>
              </Reveal>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
