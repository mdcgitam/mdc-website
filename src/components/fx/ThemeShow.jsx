import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { setTheme, THEME_REQUEST } from "../../lib/theme"

const DARK = "#07080a"
const LIGHT = "#f9fafb"

const star = (x, y, r) =>
    `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`

// A circle big enough to cover the viewport from any point on it.
function placeCover(el, x, y, color) {
    const r = Math.hypot(window.innerWidth, window.innerHeight)
    gsap.set(el, { left: x - r, top: y - r, width: r * 2, height: r * 2, background: color, scale: 0, opacity: 1 })
}

const centre = (el) => {
    const b = el.getBoundingClientRect()
    return [b.left + b.width / 2, b.top + b.height / 2]
}

// ── To dark: a wizard flies in on a broom, says "Nox!" and puts the lights out ──
function Wizard() {
    return (
        <svg viewBox="0 0 260 170" className="wz-bob w-full overflow-visible" aria-hidden>
            <g>
                {[[240, 96, 6], [256, 112, 4], [250, 78, 3.5], [270, 92, 4.5], [278, 120, 3], [292, 104, 3.5]].map(([x, y, r], i) => (
                    <path key={i} d={star(x, y, r)} fill="#ffe89a" className="ts-twinkle" style={{ animationDelay: `${i * 0.11}s` }} />
                ))}
            </g>
            {/* cape */}
            <path className="ts-flap" d="M146 60 C 176 58, 204 72, 222 98 C 196 90, 172 94, 152 102 Z" fill="#12121c" />
            {/* broom */}
            <line x1="18" y1="112" x2="222" y2="100" stroke="#7a4a22" strokeWidth="6" strokeLinecap="round" />
            <path d="M212 94 L 250 78 L 256 124 L 212 110 Z" fill="#c8963e" stroke="#9b6b25" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M214 97 L 250 86 M214 102 L 254 100 M214 106 L 252 114" stroke="#9b6b25" strokeWidth="1.2" />
            <rect x="204" y="93" width="10" height="17" rx="2" fill="#5b3616" />
            {/* robe + leg */}
            <path d="M100 106 C 97 82, 104 62, 118 56 C 133 51, 147 60, 151 78 L 160 106 Z" fill="#1b1b2a" />
            <path d="M112 104 L 94 130 L 104 134 L 126 108 Z" fill="#1b1b2a" />
            <ellipse cx="96" cy="134" rx="9" ry="4.5" fill="#2a1a10" />
            <circle cx="134" cy="104" r="4.5" fill="#f1c9a5" />
            {/* house scarf */}
            <path d="M106 56 C 114 60, 128 60, 136 55 L 138 62 C 128 67, 114 67, 104 62 Z" fill="#8b1a1a" />
            <path className="ts-flap" d="M132 58 C 150 52, 168 48, 190 54 L 188 62 C 168 58, 150 62, 134 64 Z" fill="#8b1a1a" />
            <path d="M150 54 L 152 63 M164 51 L 166 60 M178 51 L 179 60" stroke="#e0b030" strokeWidth="3" />
            {/* wand arm */}
            <path d="M116 62 L 86 72" stroke="#1b1b2a" strokeWidth="9" strokeLinecap="round" />
            <circle cx="84" cy="72" r="4.5" fill="#f1c9a5" />
            <line x1="84" y1="72" x2="54" y2="60" stroke="#4a2c14" strokeWidth="2.6" strokeLinecap="round" />
            <g className="wz-glow">
                <circle cx="53" cy="59.5" r="11" fill="#fff6c2" opacity="0.35" />
                <circle cx="53" cy="59.5" r="3.4" fill="#fffbe6" />
            </g>
            <circle className="wz-tip" cx="53" cy="59.5" r="1" fill="none" />
            {/* head */}
            <circle cx="116" cy="40" r="16" fill="#f1c9a5" />
            <path d="M99 40 C 96 24, 110 17, 122 19 C 134 20, 138 30, 134 38 L 130 31 L 126 36 L 121 29 L 115 34 L 110 28 L 104 34 Z" fill="#1a1410" />
            <path d="M113 33 l -2.5 3.5 h 2.5 l -2.5 3.5" stroke="#c0392b" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
            <circle cx="108" cy="43" r="5.2" fill="#ffffff22" stroke="#1f1f1f" strokeWidth="1.8" />
            <circle cx="121" cy="43" r="5.2" fill="#ffffff22" stroke="#1f1f1f" strokeWidth="1.8" />
            <line x1="113.2" y1="43" x2="115.8" y2="43" stroke="#1f1f1f" strokeWidth="1.6" />
            <circle cx="108" cy="43" r="1.3" fill="#1f1f1f" />
            <circle cx="121" cy="43" r="1.3" fill="#1f1f1f" />
            <path d="M110 51 q 4 3 8 0" stroke="#7a3b2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
    )
}

function WizardShow({ onDone }) {
    const root = useRef(null)
    useLayoutEffect(() => {
        const W = window.innerWidth
        const H = window.innerHeight
        const size = Math.min(340, W * 0.7)
        const x = W / 2 - size / 2
        const y = H * 0.42 - size * 0.35
        const ctx = gsap.context(() => {
            gsap.timeline({ onComplete: onDone })
                .set(".wz", { x: W + 60, y: H * 0.12, rotate: -8 })
                .to(".wz", { x, y, rotate: 0, duration: 1.15, ease: "power2.out" })
                .to(".wz-bob", { y: -7, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0)
                .fromTo(".wz-bubble", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.6)" }, 1.1)
                .add(() => {
                    const [cx, cy] = centre(root.current.querySelector(".wz-tip"))
                    placeCover(root.current.querySelector(".ts-cover"), cx, cy, DARK)
                }, 1.75)
                .to(".wz-glow", { scale: 0, opacity: 0, svgOrigin: "53 59.5", duration: 0.3, ease: "power2.in" }, 1.75)
                .to(".ts-cover", { scale: 1, duration: 0.85, ease: "expo.in" }, 1.8)
                .add(() => setTheme("night"), 2.65)
                .to(".wz-bubble", { scale: 0, opacity: 0, duration: 0.25 }, 2.7)
                .to(".ts-cover", { opacity: 0, duration: 0.5 }, 2.75)
                .to(".wz", { x: -size - 80, y: y - H * 0.25, rotate: -10, duration: 1, ease: "power2.in" }, 2.8)
        }, root)
        return () => ctx.revert()
    }, [onDone])

    return (
        <div ref={root} className="pointer-events-none fixed inset-0 z-[300] overflow-hidden" aria-hidden>
            <div className="ts-cover absolute rounded-full" style={{ transform: "scale(0)" }} />
            <div className="wz absolute top-0 left-0" style={{ width: "min(340px, 70vw)" }}>
                <div className="wz-bubble absolute -top-[38%] left-[2%] origin-bottom-right rounded-2xl border-2 border-[#1b1b2a] bg-white px-4 py-1.5 font-serif text-4xl text-[#1b1b2a] italic shadow-lg">
                    Nox!
                    <span className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-r-2 border-b-2 border-[#1b1b2a] bg-white" />
                </div>
                <Wizard />
            </div>
        </div>
    )
}

// ── To light: an armoured suit jets in and fires a repulsor beam ──────────
function IronSuit() {
    return (
        <svg viewBox="0 0 140 232" className="im-bob w-full overflow-visible" aria-hidden>
            <defs>
                <linearGradient id="im-flame" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fffbe0" />
                    <stop offset="0.35" stopColor="#ffc15e" />
                    <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* thrusters */}
            <path className="ts-flame" d="M47 196 H 61 L 54 230 Z" fill="url(#im-flame)" />
            <path className="ts-flame" d="M79 196 H 93 L 86 230 Z" fill="url(#im-flame)" style={{ animationDelay: "0.07s" }} />
            {/* legs */}
            <path d="M50 124 H 61 L 62 196 H 46 Z" fill="#b3181f" />
            <path d="M79 124 H 90 L 94 196 H 78 Z" fill="#b3181f" />
            <rect x="49" y="150" width="12" height="10" rx="2" fill="#d9a620" />
            <rect x="80" y="150" width="12" height="10" rx="2" fill="#d9a620" />
            <rect x="46" y="184" width="16" height="12" rx="2" fill="#8f1218" />
            <rect x="78" y="184" width="16" height="12" rx="2" fill="#8f1218" />
            {/* left arm */}
            <path d="M38 62 L 32 116" stroke="#c21d25" strokeWidth="13" strokeLinecap="round" />
            <path d="M33 98 L 32 116" stroke="#d9a620" strokeWidth="13" strokeLinecap="round" />
            {/* torso */}
            <rect x="62" y="48" width="16" height="10" fill="#8f1218" />
            <path d="M44 58 C 44 52, 96 52, 96 58 L 92 118 C 90 128, 50 128, 48 118 Z" fill="#c21d25" />
            <path d="M58 92 H 82 L 80 116 H 60 Z" fill="#d9a620" />
            <path d="M59 100 H 81 M60 108 H 80" stroke="#a47c12" strokeWidth="1.2" />
            <rect x="50" y="118" width="40" height="8" rx="2" fill="#8f1218" />
            <circle cx="70" cy="74" r="14" fill="#7dd3fc" opacity="0.25" className="ts-pulse" />
            <circle cx="70" cy="74" r="8" fill="#dffaff" stroke="#7dd3fc" strokeWidth="2.5" />
            {/* right arm: pivots at the shoulder to aim */}
            <g className="im-arm">
                <path d="M102 62 L 104 112" stroke="#c21d25" strokeWidth="13" strokeLinecap="round" />
                <path d="M104 96 L 104 114" stroke="#d9a620" strokeWidth="13" strokeLinecap="round" />
                <circle className="im-charge" cx="104" cy="123" r="15" fill="#9be7ff" opacity="0" />
                <circle className="im-palm" cx="104" cy="123" r="5" fill="#e6fbff" />
            </g>
            <circle cx="38" cy="62" r="10" fill="#c21d25" />
            <circle cx="102" cy="62" r="10" fill="#c21d25" />
            {/* helmet */}
            <path d="M52 30 C 52 12, 88 12, 88 30 L 86 48 C 84 54, 56 54, 54 48 Z" fill="#c21d25" />
            <path d="M58 26 H 82 L 81 44 C 79 50, 61 50, 59 44 Z" fill="#e0b12a" />
            <rect x="61" y="31" width="7.5" height="3" rx="1" fill="#e6fbff" className="ts-pulse" />
            <rect x="71.5" y="31" width="7.5" height="3" rx="1" fill="#e6fbff" className="ts-pulse" />
            <path d="M64 44 H 76" stroke="#a47c12" strokeWidth="1.5" />
        </svg>
    )
}

function IronShow({ onDone }) {
    const root = useRef(null)
    useLayoutEffect(() => {
        const W = window.innerWidth
        const H = window.innerHeight
        const size = Math.min(210, H * 0.3, W * 0.34)
        const x = Math.max(16, W * 0.12)
        const y = H * 0.5 - size * 0.9
        const ctx = gsap.context(() => {
            gsap.timeline({ onComplete: onDone })
                .set(".im", { x: -size - 40, y: H * 0.85, rotate: 38 })
                .to(".im", { x, y, rotate: 0, duration: 1.1, ease: "power3.out" })
                .to(".im-bob", { y: -6, duration: 0.4, yoyo: true, repeat: 7, ease: "sine.inOut" }, 0)
                .to(".im-arm", { rotate: -90, svgOrigin: "102 62", duration: 0.3, ease: "back.out(1.8)" }, 1.05)
                .to(".im-charge", { opacity: 0.8, scale: 1.4, svgOrigin: "104 123", duration: 0.35, ease: "power2.in" }, 1.3)
                .add(() => {
                    const [px, py] = centre(root.current.querySelector(".im-palm"))
                    gsap.set(".im-beam", { left: px, top: py - 7, width: W - px + 60 })
                    placeCover(root.current.querySelector(".ts-cover"), px, py, LIGHT)
                }, 1.65)
                .fromTo(".im-beam", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.18, ease: "power2.out" }, 1.65)
                .to(".im", { x: x - 14, duration: 0.08, yoyo: true, repeat: 3 }, 1.66)
                .to(".ts-cover", { scale: 1, duration: 0.8, ease: "expo.in" }, 1.85)
                .add(() => setTheme("classic"), 2.65)
                .to(".im-beam", { opacity: 0, duration: 0.3 }, 2.65)
                .to(".im-charge", { opacity: 0, duration: 0.3 }, 2.65)
                .to(".ts-cover", { opacity: 0, duration: 0.5 }, 2.75)
                .to(".im-arm", { rotate: 0, svgOrigin: "102 62", duration: 0.3 }, 2.75)
                .to(".im", { x: W + size, y: -size * 2, rotate: 30, duration: 0.9, ease: "power2.in" }, 2.9)
        }, root)
        return () => ctx.revert()
    }, [onDone])

    return (
        <div ref={root} className="pointer-events-none fixed inset-0 z-[300] overflow-hidden" aria-hidden>
            <div className="ts-cover absolute rounded-full" style={{ transform: "scale(0)" }} />
            <div
                className="im-beam absolute h-3.5 origin-left rounded-full"
                style={{
                    transform: "scaleX(0)",
                    background: "linear-gradient(90deg, #ffffff, #c9f4ff 40%, #7dd3fc)",
                    boxShadow: "0 0 18px 6px rgba(125, 211, 252, 0.9), 0 0 70px 22px rgba(56, 189, 248, 0.55)",
                }}
            />
            <div className="im absolute top-0 left-0" style={{ width: "min(210px, 30vh, 34vw)" }}>
                <IronSuit />
            </div>
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

    if (show === "night") return <WizardShow onDone={done} />
    if (show === "classic") return <IronShow onDone={done} />
    return null
}
