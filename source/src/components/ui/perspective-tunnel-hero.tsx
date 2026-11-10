"use client";

/**
 * Perspective Tunnel Hero — adapted for this portfolio.
 *
 * Changes from the original 21st.dev component, and why:
 * - Progress is driven by page scroll (a tall section with a sticky stage)
 *   instead of a wheel listener that called preventDefault(). The original
 *   trapped the page: you could not scroll past it with a mouse, and touch
 *   devices never fire wheel events, so it never moved on phones.
 * - Images, copy and the click handler are props, so the tunnel flies
 *   through real slides and each card opens its deck.
 * - Cards are 16:9 (slides), and the palette follows the site tokens.
 */

import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    useScroll,
    MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type TunnelImage = { src: string; title: string; caption?: string };

const DEFAULT_IMAGES: TunnelImage[] = [
    { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=900&q=80", title: "Chroma I" },
    { src: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=900&q=80", title: "Prism III" },
    { src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&q=80", title: "Ether IV" },
    { src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=900&q=80", title: "Quantum V" },
    { src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=900&q=80", title: "Nebula VI" },
    { src: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=900&q=80", title: "Cyber VII" },
];

interface TunnelCardData {
    item: TunnelImage;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

function layoutCards(images: TunnelImage[]): TunnelCardData[] {
    return images.map((item, i) => {
        const goldenAngle = i * 137.5 * (Math.PI / 180);
        return {
            item,
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX: 0.27 + (i % 3) * 0.075,
            radiusFactorY: 0.24 + (i % 2) * 0.08,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 5) * 1.5),
            index: i,
        };
    });
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
    onSelect?: (index: number) => void;
}

function TunnelCard({ card, progress, pointer, total, stage, onSelect }: TunnelCardProps) {
    const staggerSpan = 0.5;
    // start slightly "before" the section so the first cards are already in
    // flight when the stage arrives, instead of an empty screen
    const start = (card.index / total) * (1 - staggerSpan + 0.1) - 0.1;
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1300 : -1800;
    const nearZ = stage.isMobile ? 320 : 480;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.16, 0.8, 0.97], [0, 1, 1, 0]);
    // cards nearest the camera become clickable, the rest stay out of the way
    const pointerEvents = useTransform(localProgress, (v) => (v > 0.25 && v < 0.85 ? "auto" : "none"));

    const cardWidth = stage.isMobile
        ? Math.max(200, Math.min(300, stage.width * 0.62))
        : Math.max(260, Math.min(420, stage.width * 0.25));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 16 : 42;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onSelect?.(card.index)}
            style={{ width: cardWidth, transform, opacity, pointerEvents, zIndex: card.index + 1 }}
            className="absolute left-1/2 top-1/2 aspect-video cursor-pointer select-none will-change-transform"
        >
            <div className="group relative h-full w-full overflow-hidden rounded-[6px] bg-night-raised shadow-2xl shadow-black/70 ring-1 ring-white/15 transition-all duration-500 hover:ring-2 hover:ring-cobalt-bright">
                <img
                    src={card.item.src}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night/90 via-night/40 to-transparent px-3 pb-2.5 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-left text-caption font-medium text-white">{card.item.title}</span>
                    <span className="shrink-0 text-caption text-white/70">Open deck</span>
                </div>
            </div>
        </motion.button>
    );
}

export interface PerspectiveTunnelHeroProps {
    images?: TunnelImage[];
    eyebrow?: string;
    titleTop?: string;
    titleBottom?: string;
    caption?: string;
    prompt?: string;
    /** Section height in viewport heights. More height = slower flight. */
    length?: number;
    onSelect?: (index: number) => void;
    id?: string;
}

export default function PerspectiveTunnelHero({
    images = DEFAULT_IMAGES,
    eyebrow = "Warp drive sequence",
    titleTop = "Into the",
    titleBottom = "ether.",
    caption = "Scroll to fly through the spatial 3D corridor.",
    prompt = "Scroll to explore",
    length = 360,
    onSelect,
    id,
}: PerspectiveTunnelHeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const cards = useRef(layoutCards(images)).current;

    const [stage, setStage] = useState<StageDimensions>({ width: 1440, height: 900, isMobile: false });

    useEffect(() => {
        const update = () =>
            setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.0001 });

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.78, 1, 1.3]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.08, 0.86, 1], [0.7, 1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
    const ringScale = useTransform(smoothProgress, [0, 1], [0.85, 1.6]);

    return (
        <section id={id} ref={sectionRef} className="relative" style={{ height: `${length}vh` }}>
            <div
                className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-night text-white"
                style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
            >
                {/* grid and glow */}
                <div className="dot-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_55%,transparent_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,72,229,0.28)_0%,transparent_65%)]" />

                {/* depth rings */}
                <motion.div style={{ scale: ringScale }} className="pointer-events-none absolute h-[46vmin] w-[46vmin] rounded-full border border-cobalt-bright/25" />
                <motion.div style={{ scale: ringScale }} className="pointer-events-none absolute h-[78vmin] w-[78vmin] rounded-full border border-dashed border-white/10" />

                {/* anchor typography */}
                <motion.div
                    style={{ scale: titleScale, opacity: titleOpacity }}
                    className="pointer-events-none z-0 flex max-w-2xl flex-col items-center px-6 text-center"
                >
                    <p className="mb-5 text-small text-cobalt-bright">{eyebrow}</p>
                    <h2 className="type-wide bg-gradient-to-b from-white via-white to-white/35 bg-clip-text pb-2 text-[clamp(3.2rem,9vw,8rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-transparent">
                        {titleTop}
                        <br />
                        {titleBottom}
                    </h2>
                    <p className="mt-6 max-w-[38ch] text-body text-white/65">{caption}</p>
                </motion.div>

                <motion.div
                    style={{ opacity: promptOpacity }}
                    className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-caption text-white/55"
                >
                    <span>{prompt}</span>
                    <div className="h-8 w-px bg-gradient-to-b from-cobalt-bright to-transparent" />
                </motion.div>

                {/* 3D z-space plane */}
                <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                    {cards.map((card) => (
                        <TunnelCard
                            key={card.index}
                            card={card}
                            progress={smoothProgress}
                            pointer={pointer}
                            total={cards.length}
                            stage={stage}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
