import * as React from "react"
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { BriefcaseBusiness, Check, Copy, Download, Mail, Phone } from "lucide-react"
import { person } from "@/data/portfolio"
import { Ascend, Button, EASE, Reveal, useSmoothScroll } from "@/components/primitives"

export default function Contact() {
  const { scrollTo } = useSmoothScroll()
  const [copied, setCopied] = React.useState(false)
  const gx = useMotionValue(50)
  const gy = useMotionValue(40)
  const sx = useSpring(gx, { stiffness: 40, damping: 18 })
  const sy = useSpring(gy, { stiffness: 40, damping: 18 })
  const bg = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, rgba(79,107,255,.35), transparent 60%)`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
    } catch {
      const t = document.createElement("textarea")
      t.value = person.email
      document.body.appendChild(t)
      t.select()
      document.execCommand("copy")
      t.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section
      id="contact"
      data-section="contact"
      data-tone="dark"
      aria-labelledby="contact-title"
      className="grain relative overflow-hidden bg-night px-5 pb-10 pt-28 text-white sm:px-8 sm:pt-36"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        gx.set(((e.clientX - r.left) / r.width) * 100)
        gy.set(((e.clientY - r.top) / r.height) * 100)
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} aria-hidden="true" />
      <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1180px]">
        <Ascend
          as="h2"
          id="contact-title" text="Thank you."
          by="char"
          stagger={0.05}
          className="type-wide text-[clamp(4rem,14vw,13rem)] font-extrabold leading-[0.85] tracking-[-0.05em]"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <p className="max-w-[30ch] text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.25] text-white/85">
              Have a deck that needs to land in the room? Send the brief.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${person.email}`} variant="light" icon={<Mail className="h-4 w-4" />}>
                Email Asish
              </Button>
              <Button href={person.resume} download={person.resumeFileName} variant="glass" icon={<Download className="h-4 w-4" />}>
                Download résumé
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-6">
            <div className="glass-dark rounded-[24px] p-2">
              <ul className="divide-y divide-white/10">
                <li className="flex items-center justify-between gap-3 px-4 py-4">
                  <a href={`mailto:${person.email}`} className="flex min-w-0 items-center gap-3 hover:text-cobalt-bright">
                    <Mail className="h-5 w-5 shrink-0 text-white/50" aria-hidden="true" />
                    <span className="truncate text-body">{person.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    className="relative inline-flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-white/10 px-3 text-caption font-semibold transition hover:bg-white/20"
                    aria-live="polite"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span key="ok" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="inline-flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Copied
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="inline-flex items-center gap-1.5">
                          <Copy className="h-3.5 w-3.5" /> Copy email
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
                <li>
                  <a href={person.phoneHref} className="flex items-center gap-3 px-4 py-4 hover:text-cobalt-bright">
                    <Phone className="h-5 w-5 text-white/50" aria-hidden="true" />
                    <span className="text-body tabular">{person.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={person.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 px-4 py-4 hover:text-cobalt-bright">
                    <BriefcaseBusiness className="h-5 w-5 text-white/50" aria-hidden="true" />
                    <span className="text-body">LinkedIn profile</span>
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <footer className="mt-28 flex flex-col gap-6 border-t border-white/10 pt-8 text-caption text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {person.name}, {person.location}</p>
          <motion.button
            type="button"
            onClick={() => scrollTo(0)}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-left text-white/70 hover:text-white"
          >
            End of slide show. Click to return to the top.
          </motion.button>
        </footer>
      </div>
    </section>
  )
}
