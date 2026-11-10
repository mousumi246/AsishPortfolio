import * as React from "react"
import { projects } from "@/data/portfolio"
import { SmoothScroll } from "@/components/primitives"
import Nav from "@/components/sections/Nav"
import Hero from "@/components/sections/Hero"
import Ticker from "@/components/sections/Ticker"
import Work from "@/components/sections/Work"
import Redesign from "@/components/sections/Redesign"
import Process from "@/components/sections/Process"
import Experience from "@/components/sections/Experience"
import Skills from "@/components/sections/Skills"
import Contact from "@/components/sections/Contact"
import CaseStudy from "@/components/sections/CaseStudy"

export default function App() {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [startAt, setStartAt] = React.useState(0)

  const open = React.useCallback((id: string, slide = 0) => {
    setStartAt(slide)
    setOpenId(id)
  }, [])

  const project = projects.find((p) => p.id === openId) ?? null

  return (
    <SmoothScroll>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to work
      </a>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Work open={open} />
        <Redesign open={open} />
        <Process />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <CaseStudy project={project} startAt={startAt} onClose={() => setOpenId(null)} />
    </SmoothScroll>
  )
}
