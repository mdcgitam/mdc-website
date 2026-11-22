import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { setTheme, THEME_REQUEST } from "../../lib/theme"

const DARK = "#07080a"
const LIGHT = "#f9fafb"
const rand = (a, b) => a + Math.random() * (b - a)

// Full-screen 2D canvas at device resolution, drawn in CSS pixels.
function setupCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { ctx, W, H }
}

// Additive glowing particles.
function makeParticles() {
    const list = []
    return {
        add(p) { list.push({ age: 0, drag: 0.96, g: 0, ...p }) },
        step(ctx, dt) {
            ctx.globalCompositeOperation = "lighter"
            for (let i = list.length - 1; i >= 0; i--) {
                const p = list[i]
                p.age += dt
                if (p.age >= p.life) { list.splice(i, 1); continue }
                p.vx *= p.drag; p.vy = p.vy * p.drag + p.g * dt
                p.x += p.vx * dt; p.y += p.vy * dt
                const k = 1 - p.age / p.life
                const r = p.r * (0.4 + 0.6 * k)
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
                grd.addColorStop(0, `rgba(${p.c},${0.9 * k})`)
                grd.addColorStop(0.25, `rgba(${p.c},${0.35 * k})`)
                grd.addColorStop(1, `rgba(${p.c},0)`)
                ctx.fillStyle = grd
                ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2); ctx.fill()
            }
            ctx.globalCompositeOperation = "source-over"
        },
    }
}

function glowOrb(ctx, x, y, r, rgb, a = 1) {
    if (r <= 0.5 || a <= 0) return
    ctx.globalCompositeOperation = "lighter"
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${a})`)
    g.addColorStop(0.12, `rgba(${rgb},${0.9 * a})`)
    g.addColorStop(0.4, `rgba(${rgb},${0.25 * a})`)
    g.addColorStop(1, `rgba(${rgb},0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.globalCompositeOperation = "source-over"
}

// Soft-edged disc that floods the screen with a colour, led by a glowing rim.
function flood(ctx, x, y, r, color, rim) {
    if (r <= 0) return
    const g = ctx.createRadialGradient(x, y, r * 0.7, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, color + "00")
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    if (!rim) return
    ctx.globalCompositeOperation = "lighter"
    for (const [w, a] of [[r * 0.09, 0.18], [r * 0.035, 0.4], [3, 0.9]]) {
        ctx.strokeStyle = `rgba(${rim},${a})`
        ctx.lineWidth = w
        ctx.beginPath(); ctx.arc(x, y, r * 0.86, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.globalCompositeOperation = "source-over"
}

function useRaf(draw) {
    useEffect(() => {
        let raf, last = performance.now()
        const loop = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000)
            last = t
            draw(dt)
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [draw])
}

// ── To dark: a point of wand-light traces a flourish, then "Nox" snuffs it out ──
const GOLD = ["255,236,170", "255,206,110", "255,170,80", "255,250,225"]

function NoxShow({ onDone }) {
    const root = useRef(null)
    const canvas = useRef(null)
    const S = useRef(null)

    useLayoutEffect(() => {
        const { ctx, W, H } = setupCanvas(canvas.current)
        const cx = W / 2, cy = H * 0.44
        // Bezier flourish entering from the lower left, swooping over the top and curling into the centre.
        const P = [[-0.06 * W, 0.92 * H], [0.18 * W, 0.02 * H], [0.84 * W, 0.08 * H], [cx, cy]]
        const at = (t) => {
            const u = 1 - t
            const f = (i) => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]
            return [f(0), f(1)]
        }
        const s = (S.current = { ctx, W, H, cx, cy, at, t: 0, dim: 0, orb: 10, orbA: 1, ink: 0, trail: [], sparks: makeParticles(), emit: 1 })

        const ctxG = gsap.context(() => {
            gsap.timeline({ onComplete: onDone })
                .to(s, { dim: 0.86, duration: 0.8, ease: "power2.out" }, 0)
                .to(s, { t: 1, duration: 1.35, ease: "power2.inOut" }, 0.05)
                .to(s, { orb: Math.min(W, H) * 0.16, duration: 0.5, ease: "power2.out" }, 1.3)
                .fromTo(".nx-word", { opacity: 0, y: 18, filter: "blur(10px)", letterSpacing: "0.5em" },
                    { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.18em", duration: 0.8, ease: "expo.out" }, 1.35)
                // snuff: the light collapses and darkness pours out of it
                .to(s, { orb: 0, orbA: 0, emit: 0, duration: 0.35, ease: "power3.in" }, 2.0)
                .add(() => {
                    for (let i = 0; i < 90; i++) {
                        const a = rand(0, Math.PI * 2), v = rand(80, 420)
                        s.sparks.add({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(0.8, 2.4), life: rand(0.5, 1.1), c: GOLD[(Math.random() * 4) | 0], drag: 0.93 })
                    }
                }, 2.3)
                .to(s, { ink: Math.hypot(W, H) * 1.15, duration: 0.85, ease: "expo.in" }, 2.15)
                .to(".nx-word", { opacity: 0, filter: "blur(12px)", duration: 0.4 }, 2.55)
                .add(() => setTheme("night"), 3.0)
                .to(root.current, { opacity: 0, duration: 0.55, ease: "power1.out" }, 3.05)
        }, root)
        return () => ctxG.revert()
    }, [onDone])

    useRaf(useCallback((dt) => {
        const s = S.current
        if (!s) return
        const { ctx, W, H } = s
        ctx.clearRect(0, 0, W, H)
        // dim the page so the light reads
        const v = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, Math.hypot(W, H) * 0.6)
        v.addColorStop(0, `rgba(10,10,22,${s.dim * 0.92})`)
        v.addColorStop(1, `rgba(3,3,6,${s.dim})`)
        ctx.fillStyle = v
        ctx.fillRect(0, 0, W, H)

        const [x, y] = s.at(s.t)
        if (s.emit > 0) {
            s.trail.push([x, y])
            if (s.trail.length > 46) s.trail.shift()
            for (let i = 0; i < 5; i++) {
                s.sparks.add({ x: x + rand(-3, 3), y: y + rand(-3, 3), vx: rand(-60, 60), vy: rand(-70, 30), g: 140, r: rand(0.6, 2.2), life: rand(0.5, 1.3), c: GOLD[(Math.random() * 4) | 0] })
            }
        } else if (s.trail.length) {
            s.trail.shift()
        }
        // tapering light ribbon
        ctx.globalCompositeOperation = "lighter"
        ctx.lineCap = "round"
        for (let i = 1; i < s.trail.length; i++) {
            const k = i / s.trail.length
            ctx.strokeStyle = `rgba(255,214,130,${0.55 * k * s.orbA})`
            ctx.lineWidth = 0.5 + k * 5
            ctx.shadowColor = "rgba(255,190,90,0.9)"
            ctx.shadowBlur = 18 * k
            ctx.beginPath(); ctx.moveTo(...s.trail[i - 1]); ctx.lineTo(...s.trail[i]); ctx.stroke()
        }
        ctx.shadowBlur = 0
        ctx.globalCompositeOperation = "source-over"

        s.sparks.step(ctx, dt)
        glowOrb(ctx, x, y, s.orb * 1.8 + 14, "255,200,110", s.orbA)
        flood(ctx, s.cx, s.cy, s.ink, DARK, "120,90,200")
    }, []))

    return (
        <div ref={root} className="pointer-events-none fixed inset-0 z-[300] overflow-hidden" aria-hidden>
            <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
            <p
                className="nx-word absolute inset-x-0 top-[58%] text-center font-serif text-[clamp(3rem,9vw,6.5rem)] italic"
                style={{
                    opacity: 0,
                    background: "linear-gradient(180deg, #fff8e1 0%, #ffd58a 55%, #c8893a 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: "drop-shadow(0 0 22px rgba(255,190,90,0.55))",
                }}
            >
                Nox
            </p>
        </div>
    )
}

// ── To light: a holographic repulsor HUD charges its core and fires ───────────
const CYAN = "125,211,252"

function Hud() {
    const ticks = Array.from({ length: 72 }, (_, i) => i)
    return (
        <svg viewBox="-200 -200 400 400" className="h-full w-full overflow-visible" fill="none" stroke={`rgb(${CYAN})`}>
            <g className="hd-r1">
                <circle r="186" strokeWidth="1" strokeDasharray="70 18 6 18" opacity="0.7" />
                <circle r="176" strokeWidth="0.6" opacity="0.35" />
            </g>
            <g className="hd-r2">
                {ticks.map(i => (
                    <line key={i} x1="0" y1={-150} x2="0" y2={i % 6 === 0 ? -136 : -143} strokeWidth={i % 6 === 0 ? 2 : 1} opacity={i % 6 === 0 ? 0.95 : 0.5} transform={`rotate(${i * 5})`} />
                ))}
            </g>
            <g className="hd-r3">
                <circle r="112" strokeWidth="6" strokeDasharray="120 56" opacity="0.55" />
                <circle r="100" strokeWidth="1" strokeDasharray="2 6" opacity="0.8" />
            </g>
            <g className="hd-r4">
                <path d="M -70 0 A 70 70 0 0 1 0 -70" strokeWidth="3" />
                <path d="M 70 0 A 70 70 0 0 1 0 70" strokeWidth="3" />
                {[0, 90, 180, 270].map(a => <path key={a} d="M 0 -84 L -6 -96 H 6 Z" fill={`rgb(${CYAN})`} stroke="none" transform={`rotate(${a})`} />)}
            </g>
            <circle className="hd-core" r="34" fill={`rgba(${CYAN},0.18)`} strokeWidth="2" />
            <line x1="-200" y1="0" x2="-120" y2="0" strokeWidth="0.8" opacity="0.5" />
            <line x1="120" y1="0" x2="200" y2="0" strokeWidth="0.8" opacity="0.5" />
        </svg>
    )
}

function RepulsorShow({ onDone }) {
    const root = useRef(null)
    const canvas = useRef(null)
    const pct = useRef(null)
    const S = useRef(null)

    useLayoutEffect(() => {
        const { ctx, W, H } = setupCanvas(canvas.current)
        const cx = W / 2, cy = H / 2
        const R = Math.min(W, H) * 0.32
        const s = (S.current = { ctx, W, H, cx, cy, R, charge: 0, core: 0, dim: 0, waves: [], cover: 0, sparks: makeParticles(), pull: 0 })
        const power = { v: 0 }

        const ctxG = gsap.context(() => {
            const spin = [
                gsap.to(".hd-r1", { rotate: 360, duration: 9, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
                gsap.to(".hd-r2", { rotate: -360, duration: 14, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
                gsap.to(".hd-r3", { rotate: 360, duration: 5, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
                gsap.to(".hd-r4", { rotate: -360, duration: 3, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
            ]
            gsap.timeline({ onComplete: onDone })
                .to(s, { dim: 0.78, duration: 0.5 }, 0)
                .fromTo(".hd", { scale: 0.55, opacity: 0, filter: "blur(8px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, 0)
                .fromTo(".hd-read", { opacity: 0, x: (i) => (i ? 16 : -16) }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out", stagger: 0.08 }, 0.25)
                // charge
                .to(s, { charge: 1, pull: 1, duration: 1.25, ease: "power2.in" }, 0.35)
                .to(spin, { timeScale: 5, duration: 1.25, ease: "power2.in" }, 0.35)
                .to(".hd-core", { scale: 1.35, transformOrigin: "50% 50%", duration: 1.25, ease: "power2.in" }, 0.35)
                .to(power, {
                    v: 100, duration: 1.25, ease: "power2.in",
                    onUpdate: () => { if (pct.current) pct.current.textContent = String(Math.round(power.v)).padStart(3, "0") },
                }, 0.35)
                // fire
                .add(() => {
                    s.pull = 0
                    s.waves.push({ r: R * 0.2, w: 26, a: 1, v: 2600 }, { r: R * 0.1, w: 12, a: 0.8, v: 1700 }, { r: 0, w: 6, a: 0.6, v: 1100 })
                    for (let i = 0; i < 140; i++) {
                        const a = rand(0, Math.PI * 2), v = rand(300, 1400)
                        s.sparks.add({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(0.8, 2.6), life: rand(0.35, 0.9), c: Math.random() < 0.4 ? "255,255,255" : CYAN, drag: 0.94 })
                    }
                }, 1.62)
                .fromTo(".hd-flash", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 1.62)
                .to(".hd-flash", { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.7)
                .to(".hd", { scale: 1.9, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power2.in" }, 1.62)
                .to(".hd-read", { opacity: 0, duration: 0.2 }, 1.62)
                .to(s, { core: 1, duration: 0.1 }, 1.62)
                .to(s, { cover: Math.hypot(W, H) * 1.15, duration: 0.8, ease: "expo.in" }, 1.75)
                .add(() => setTheme("classic"), 2.6)
                .to(root.current, { opacity: 0, duration: 0.55, ease: "power1.out" }, 2.65)
        }, root)
        return () => ctxG.revert()
    }, [onDone])

    useRaf(useCallback((dt) => {
        const s = S.current
        if (!s) return
        const { ctx, W, H, cx, cy, R } = s
        ctx.clearRect(0, 0, W, H)
        ctx.fillStyle = `rgba(2,6,12,${s.dim})`
        ctx.fillRect(0, 0, W, H)

        // energy drawn into the core while charging
        if (s.pull > 0) {
            const n = 2 + Math.round(s.charge * 6)
            for (let i = 0; i < n; i++) {
                const a = rand(0, Math.PI * 2), d = R * rand(1.1, 1.8)
                const sp = rand(1.6, 2.4) * d
                s.sparks.add({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: -Math.cos(a) * sp, vy: -Math.sin(a) * sp, r: rand(0.6, 1.8), life: 0.42, c: Math.random() < 0.3 ? "255,255,255" : CYAN, drag: 1 })
            }
        }
        s.sparks.step(ctx, dt)
        glowOrb(ctx, cx, cy, R * (0.35 + s.charge * 0.9), CYAN, 0.35 + s.charge * 0.65)

        // shockwaves
        ctx.globalCompositeOperation = "lighter"
        for (let i = s.waves.length - 1; i >= 0; i--) {
            const w = s.waves[i]
            w.r += w.v * dt
            w.a -= dt * 0.9
            if (w.a <= 0) { s.waves.splice(i, 1); continue }
            ctx.strokeStyle = `rgba(${CYAN},${w.a})`
            ctx.lineWidth = w.w * w.a
            ctx.shadowColor = `rgba(${CYAN},1)`
            ctx.shadowBlur = 30
            ctx.beginPath(); ctx.arc(cx, cy, w.r, 0, Math.PI * 2); ctx.stroke()
        }
        ctx.shadowBlur = 0
        ctx.globalCompositeOperation = "source-over"

        flood(ctx, cx, cy, s.cover, LIGHT, CYAN)
    }, []))

    return (
        <div ref={root} className="pointer-events-none fixed inset-0 z-[300] overflow-hidden" aria-hidden>
            <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
            <div
                className="hd absolute top-1/2 left-1/2 h-[64vmin] w-[64vmin] -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: 0, filter: "drop-shadow(0 0 6px rgba(125,211,252,0.9)) drop-shadow(0 0 24px rgba(56,189,248,0.5))" }}
            >
                <Hud />
            </div>
            <div className="absolute top-1/2 left-1/2 w-[min(94vw,112vmin)] -translate-x-1/2 -translate-y-1/2">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#bfeaff] sm:text-xs" style={{ textShadow: "0 0 10px rgba(125,211,252,0.8)" }}>
                    <div className="hd-read space-y-1" style={{ opacity: 0 }}>
                        <p>Repulsor</p>
                        <p className="text-[#7dd3fc]/70">Sys · Online</p>
                    </div>
                    <div className="hd-read space-y-1 text-right" style={{ opacity: 0 }}>
                        <p>Power <span ref={pct} className="tabular-nums">000</span>%</p>
                        <p className="text-[#7dd3fc]/70">Mode · Light</p>
                    </div>
                </div>
            </div>
            <div className="hd-flash absolute inset-0 bg-white" style={{ opacity: 0 }} />
        </div>
    )
}

// Listens for theme requests and plays the matching show before switching.
export default function ThemeShow() {
    const [show, setShow] = useState(null)
    const busy = useRef(false)

    useEffect(() => {
        const onRequest = (e) => {
            if (prefersReducedMotion()) return // let requestTheme switch instantly
            e.preventDefault()
            if (busy.current) return
            busy.current = true
            setShow(e.detail)
        }
        window.addEventListener(THEME_REQUEST, onRequest)
        return () => window.removeEventListener(THEME_REQUEST, onRequest)
    }, [])

    const done = useCallback(() => {
        busy.current = false
        setShow(null)
    }, [])

    if (show === "night") return <NoxShow onDone={done} />
    if (show === "classic") return <RepulsorShow onDone={done} />
    return null
}
