import { useLayoutEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { gsap, prefersReducedMotion, lockScroll } from "../../lib/smooth"
import { finishIntro } from "../../lib/intro"

const LABELS = { "/": "Home", "/about": "About", "/domains": "Domains", "/events": "Events", "/team": "Team", "/tenure": "Team", "/contact": "Contact" }
// CP, WebArc, DataVerse — the three domains that run our events.
const COLORS = ["#4a80ff", "#3ddc97", "#9dbdff"]
const ROLL = ["Competitive Programming", "WebArc", "DataVerse"]

function gridSize() {
    const cols = window.innerWidth < 640 ? 6 : 12
    return { cols, rows: Math.ceil((cols * window.innerHeight) / window.innerWidth) }
}

// Hyperspace streaks from the centre of the screen. `warp.speed` is tweened by the timeline.
function startWarp(canvas, warp) {
    const ctx = canvas.getContext("2d")
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = (canvas.width = window.innerWidth * dpr)
    const h = (canvas.height = window.innerHeight * dpr)
    const stars = Array.from({ length: 320 }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        c: Math.random() < 0.25 ? "#ffffff" : COLORS[(Math.random() * COLORS.length) | 0],
    }))
    let raf
    const frame = () => {
        ctx.clearRect(0, 0, w, h)
        const f = w * 0.5
        for (const s of stars) {
            const pz = s.z
            s.z -= warp.speed * 6 * dpr
            if (s.z < 1) {
                s.z = w
                continue
            }
            const x = (s.x / s.z) * f + w / 2
            const y = (s.y / s.z) * f + h / 2
            const px = (s.x / pz) * f + w / 2
            const py = (s.y / pz) * f + h / 2
            ctx.strokeStyle = s.c
            ctx.globalAlpha = Math.min(1, (1 - s.z / w) * 1.4)
            ctx.lineWidth = Math.max(0.6, (1 - s.z / w) * 2.4) * dpr
            ctx.beginPath()
            ctx.moveTo(px, py)
            ctx.lineTo(x, y)
            ctx.stroke()
        }
        raf = requestAnimationFrame(frame)
    }
    frame()
    return () => cancelAnimationFrame(raf)
}

// Every page load gets the full show; every route change gets a short encore.
export default function Preloader() {
    const { pathname } = useLocation()
    const [reduced] = useState(prefersReducedMotion)
    const [booted, setBooted] = useState(reduced)
    const [grid] = useState(gridSize)
    const root = useRef(null)
    const canvas = useRef(null)
    const label = LABELS[pathname] || "MDC"
    const word = booted ? label : "MDC"
    const last = pathname === "/" ? "GITAM · Visakhapatnam" : `→ ${label}`

    // First load.
    useLayoutEffect(() => {
        if (reduced) {
            finishIntro()
            return
        }
        lockScroll(true)
        let locked = true
        const release = () => {
            if (locked) lockScroll(false)
            locked = false
        }
        const warp = { speed: 0.4 }
        const stopWarp = startWarp(canvas.current, warp)
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    stopWarp()
                    gsap.set(root.current, { display: "none" })
                    setBooted(true)
                },
            })
            tl.set(".pl-tile", { scale: 1.02 })
                .to(warp, { speed: 2.5, duration: 2.2, ease: "power1.in" }, 0)
                .fromTo(".pl-ch", { yPercent: 130, rotate: 10 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }, 0.25)
                .fromTo(".pl-sub", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.7)
                .fromTo(".pl-stripe", { x: "-130vw", skewX: -20 }, { x: "130vw", duration: 1.1, ease: "expo.inOut", stagger: 0.09 }, 1.0)
            ROLL.forEach((_, i) => {
                tl.to(".pl-roll", { yPercent: -100 * (i + 1), duration: 0.45, ease: "expo.inOut" }, 0.95 + i * 0.3)
            })
            tl.to(warp, { speed: 60, duration: 0.7, ease: "expo.in" }, 2.1)
                .to(".pl-ch", { scale: 1.6, opacity: 0, filter: "blur(12px)", duration: 0.55, ease: "expo.in", stagger: 0.05 }, 2.2)
                .to(".pl-sub", { opacity: 0, duration: 0.3 }, 2.2)
                .add(() => {
                    release()
                    finishIntro()
                }, 2.75)
                .to(canvas.current, { opacity: 0, duration: 0.4 }, 2.75)
                .to(".pl-tile", {
                    scale: 0,
                    rotate: 90,
                    duration: 0.7,
                    ease: "power3.in",
                    stagger: { grid: [grid.rows, grid.cols], from: "center", amount: 0.55 },
                }, 2.7)
        }, root)
        return () => {
            stopWarp()
            release()
            ctx.revert()
        }
    }, [reduced, grid])

    // Route changes, once booted.
    useLayoutEffect(() => {
        if (!booted || reduced) return
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ onComplete: () => gsap.set(root.current, { display: "none" }) })
            tl.set(root.current, { display: "block" })
                .set(canvas.current, { opacity: 0 })
                .set(".pl-sub", { opacity: 0 })
                .set(".pl-tile", { scale: 1.02, rotate: 0 })
                .fromTo(".pl-ch", { yPercent: 130, rotate: 10, scale: 1, opacity: 1, filter: "blur(0px)" }, { yPercent: 0, rotate: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 }, 0)
                .fromTo(".pl-stripe", { x: "-130vw", skewX: -20 }, { x: "130vw", duration: 0.8, ease: "expo.inOut", stagger: 0.06 }, 0.05)
                .to(".pl-ch", { yPercent: -130, rotate: -6, duration: 0.4, ease: "expo.in", stagger: 0.03 }, 0.65)
                .to(".pl-tile", {
                    scale: 0,
                    rotate: 90,
                    duration: 0.5,
                    ease: "power3.in",
                    stagger: { grid: [grid.rows, grid.cols], from: "center", amount: 0.4 },
                }, 0.75)
        }, root)
        return () => ctx.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    if (reduced) return null

    return (
        <div ref={root} className="fixed inset-0 z-[200] overflow-hidden" aria-hidden>
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}>
                {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
                    <div key={i} className="pl-tile bg-bg" />
                ))}
            </div>

            <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

            {COLORS.map(c => (
                <div key={c} className="pl-stripe absolute -top-1/4 left-[30vw] h-[150%] w-[22vw]" style={{ background: c, transform: "translateX(-130vw) skewX(-20deg)" }} />
            ))}

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex overflow-hidden px-[2vw] pb-[0.08em]">
                    {word.split("").map((ch, i) => (
                        <span key={`${word}-${i}`} className="pl-ch inline-block font-display text-[clamp(4.5rem,22vw,20rem)] leading-[0.85] font-bold tracking-[-0.06em] text-fg">
                            {ch}
                        </span>
                    ))}
                </div>
                <div className="pl-sub mt-6 h-5 overflow-hidden font-mono text-[11px] uppercase tracking-[0.3em] text-fg-muted sm:text-xs">
                    <div className="pl-roll">
                        {[...ROLL, last].map(r => (
                            <div key={r} className="flex h-5 items-center justify-center">{r}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
