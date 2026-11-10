import * as React from "react"
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion"
import { ticker } from "@/data/portfolio"

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** A band of capabilities that drifts, and speeds up or reverses with the scroll. */
export default function Ticker() {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 })
  const factor = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const dir = React.useRef(1)
  const [paused, setPaused] = React.useState(false)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || paused) return
    let move = dir.current * -1.6 * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    base.set(base.get() + move)
  })

  const row = [...ticker, ...ticker]
  return (
    <div
      className="relative z-10 -mb-px overflow-hidden bg-[linear-gradient(180deg,#E3E5EA_50%,#081222_50%)] py-10 sm:py-14"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-label="Capabilities"
    >
      <div className="-mx-4 -rotate-[1.6deg] bg-cobalt py-4 text-white shadow-[0_20px_40px_-20px_rgba(13,27,46,.6)] sm:py-5">
        <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center" aria-hidden={k === 1}>
              {row.map((t, i) => (
                <span key={`${k}-${i}`} className="type-semiwide flex items-center text-[clamp(1.15rem,2.2vw,1.75rem)] font-semibold tracking-[-0.01em]">
                  <span className="px-6 sm:px-8">{t}</span>
                  <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="text-white/60">
                    <rect x="0.75" y="0.75" width="16.5" height="10.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
