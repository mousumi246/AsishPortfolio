import * as React from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { education, experience, recognition } from "@/data/portfolio"
import { Ascend, EASE, Reveal } from "@/components/primitives"

export default function Experience() {
  const ref = React.useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const draw = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })

  return (
    <section id="experience" data-section="experience" data-tone="light" aria-labelledby="exp-title" className="relative bg-slide px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Ascend as="h2" id="exp-title" text="Where the slides were made." className="type-wide text-h2 font-extrabold lg:col-span-8" />
          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="max-w-[40ch] text-body text-ink-soft">Three teams, from B2B sales to two global consultancies.</p>
          </Reveal>
        </div>

        <ol ref={ref} className="relative mt-20">
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-ink/10 md:left-[220px] md:block" aria-hidden="true">
            <motion.div style={{ scaleY: draw }} className="h-full w-full origin-top bg-ink" />
          </div>

          {experience.map((job) => (
            <li key={job.org} className="relative grid gap-4 border-t border-ink/10 py-12 first:border-t-0 first:pt-0 md:grid-cols-[220px_1fr] md:gap-0">
              <Reveal x={-20} y={0} className="md:pr-10">
                <p className="text-small font-semibold tabular text-ink">{job.dates}</p>
                <p className="mt-1 text-caption text-ink-faint">{job.place}</p>
              </Reveal>

              <motion.span
                aria-hidden="true"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -30% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                className="absolute left-[214px] top-[0.4rem] hidden h-3 w-3 rounded-full border-2 border-white bg-cobalt shadow-[0_0_0_1px_#2448E5] md:block [li:not(:first-child)_&]:top-[3.4rem]"
              />

              <div className="md:pl-12">
                <Ascend as="h3" text={job.org} className="type-wide text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.03em]" />
                <Reveal delay={0.1}>
                  <p className="mt-2 text-lead text-cobalt">{job.role}</p>
                </Reveal>
                <ul className="mt-6 max-w-[64ch] space-y-3">
                  {job.points.map((pt, k) => (
                    <Reveal as="li" key={pt} delay={0.15 + k * 0.06} y={14} className="relative pl-6 text-body text-ink-soft">
                      <span className="absolute left-0 top-[0.8rem] h-[2px] w-3 bg-ink/40" aria-hidden="true" />
                      {pt}
                    </Reveal>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* recognition and education */}
        <div className="mt-24 grid gap-14 border-t border-ink/10 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="type-semiwide text-h4 font-bold">Recognition</h3>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {recognition.map((r, i) => (
                <motion.li
                  key={r.title}
                  initial={{ opacity: 0, y: 24, rotateX: -18 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                  style={{ transformPerspective: 800 }}
                  className="group rounded-2xl bg-canvas p-6 transition-colors duration-300 hover:bg-ink hover:text-white"
                >
                  <p className="type-semiwide text-lead font-bold">{r.title}</p>
                  <p className="mt-2 text-small text-ink-soft transition-colors duration-300 group-hover:text-white/70">{r.detail}</p>
                </motion.li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <h3 className="type-semiwide text-h4 font-bold">Education</h3>
            <p className="mt-8 text-lead font-semibold">{education.degree}</p>
            <p className="mt-1 text-small text-ink-soft">
              {education.school}, {education.years}
            </p>
            <ul className="mt-6 space-y-2.5">
              {education.extra.map((e) => (
                <li key={e} className="relative pl-6 text-small text-ink-soft">
                  <span className="absolute left-0 top-[0.7rem] h-[2px] w-3 bg-ink/40" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-small text-ink-soft">
              <span className="font-semibold text-ink">Languages: </span>
              {education.languages.join(", ")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
