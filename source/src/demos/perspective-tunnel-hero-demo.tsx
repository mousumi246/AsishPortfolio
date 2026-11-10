// Demo for the tunnel. The component is now a tall, scroll-driven section, so
// the demo gives it the full width and some page to scroll past.
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero"

export default function DemoOne() {
  return (
    <main className="w-full bg-night">
      <PerspectiveTunnelHero />
      <div className="flex h-[60vh] items-center justify-center text-white/60">The page carries on after the tunnel.</div>
    </main>
  )
}
