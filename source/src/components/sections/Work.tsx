import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards"
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero"
import { driveFolderUrl, projects, tunnelSlides, type Project } from "@/data/portfolio"
import { Ascend, EASE, Reveal } from "@/components/primitives"

type Open = (projectId: string, slide?: number) => void

function useFolderWidth() {
  const [w, setW] = React.useState(340)
  React.useEffect(() => {
    const f = () => setW(Math.max(260, Math.min(340, window.innerWidth - 56)))
    f()
    window.addEventListener("resize", f)
    return () => window.removeEventListener("resize", f)
  }, [])
  return w
}

function ProjectFolder({ project, i, open, width }: { project: Project; i: number; open: Open; width: number }) {
  const hasSlides = project.slides.length > 0
  const count = hasSlides ? project.slides.length : project.outline?.length ?? 0

  // the first four slides, with slide 1 at the front of the stack
  const files: FolderFile[] = React.useMemo(() => {
    if (hasSlides) {
      return project.slides
        .slice(0, 4)
        .map((sl, n) => ({ name: sl.title, meta: `Slide ${n + 1}`, image: sl.thumb }))
        .reverse()
    }
    return (project.outline ?? []).slice(0, 4).map((t, n) => ({ name: t, meta: `Slide ${n + 1}` })).reverse()
  }, [project, hasSlides])

  const onFile = (file: FolderFile) => {
    const idx = hasSlides ? project.slides.findIndex((s) => s.title === file.name) : 0
    open(project.id, Math.max(0, idx))
  }

  return (
    <Reveal delay={(i % 3) * 0.08} className="flex flex-col items-center">
      <GlassFolder
        label={project.folder}
        meta={`${count} slide${count === 1 ? "" : "s"}${hasSlides ? "" : ", on Drive"}`}
        tone="dark"
        art={hasSlides ? "none" : project.art}
        seed={project.seed}
        image={hasSlides ? project.slides[0].thumb : undefined}
        files={files}
        action="more"
        menu={[
          { label: "Open case study", onSelect: () => open(project.id, 0) },
          { label: "Open in Google Drive", onSelect: () => window.open(project.driveUrl, "_blank", "noopener") },
        ]}
        onFileSelect={onFile}
        width={width}
        appearDelay={(i % 3) * 140}
      />
      <div className="mt-6 w-full max-w-[340px]">
        <p className="text-caption text-white/50">{project.context}</p>
        <h3 className="type-semiwide mt-1.5 text-[1.4rem] font-bold leading-[1.15] tracking-[-0.015em] text-white">{project.title}</h3>
        <button
          type="button"
          onClick={() => open(project.id, 0)}
          className="link-underline mt-3 pb-0.5 text-small font-semibold text-cobalt-bright"
        >
          Open case study
        </button>
      </div>
    </Reveal>
  )
}

export default function Work({ open }: { open: Open }) {
  const width = useFolderWidth()
  const images = React.useMemo(
    () =>
      tunnelSlides.map(({ project, slide }) => {
        const p = projects.find((x) => x.id === project)!
        return { src: p.slides[slide].thumb, title: p.title }
      }),
    [],
  )

  return (
    <div id="work" data-section="work" data-tone="dark" className="relative bg-night">
      <PerspectiveTunnelHero
        images={images}
        eyebrow="Slides from six decks, 2022 to 2026"
        titleTop="Into the"
        titleBottom="work."
        caption="Keep scrolling to fly through the slides. Click any slide to open its deck."
        prompt="Scroll"
        length={340}
        onSelect={(i) => open(tunnelSlides[i].project, tunnelSlides[i].slide)}
      />

      <section aria-labelledby="work-title" className="relative overflow-hidden px-5 pb-28 pt-10 sm:px-8 sm:pb-36">
        <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" />
        <div className="relative mx-auto max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Ascend
              as="h2"
              id="work-title" text="The working folder, opened up."
              className="type-wide text-h2 font-extrabold text-white lg:col-span-7"
            />
            <Reveal delay={0.15} className="lg:col-span-5">
              <p className="max-w-[46ch] text-body text-white/70">
                Six decks: hiring exercises for AHEAD, Deloitte, Fractal and Odessa, plus two personal studies. Hover a folder to lift its
                slides, click it to fan them out, and pick a slide to see the full deck and the thinking behind it.
              </p>
              <a
                href={driveFolderUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline mt-5 inline-flex items-center gap-2 pb-0.5 text-small font-semibold text-white"
              >
                Browse the original folder in Google Drive <ExternalLink className="h-4 w-4" />
              </a>
            </Reveal>
          </div>

          <div className="mt-20 grid grid-cols-1 justify-items-center gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectFolder key={p.id} project={p} i={i} open={open} width={width} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="mt-16 text-center text-caption text-white/45"
          >
            Hover to lean, click to fan out, use the ··· key for more options.
          </motion.p>
        </div>
      </section>
    </div>
  )
}
