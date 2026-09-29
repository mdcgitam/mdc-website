import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "../../lib/smooth"

// Each domain gets a small live scene. Scenes only animate while `active` (on screen).

export function SceneFrame({ title, color, children, className = "" }) {
    return (
        <div
            className={`force-dark relative overflow-hidden rounded-2xl border bg-[#07090e] ${className}`}
            style={{ borderColor: `${color}40`, boxShadow: `0 0 80px -20px ${color}66` }}
        >
            <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: `${color}26` }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${color}aa` }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${color}55` }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${color}2a` }} />
                <span className="ml-3 truncate font-mono text-[11px] text-white/50">{title}</span>
            </div>
            <div className="relative aspect-[4/3]">{children}</div>
        </div>
    )
}

// Runs a gsap timeline built by `build` inside `root`, playing only while active.
function useLoop(root, active, build) {
    const tl = useRef(null)
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            tl.current = build(gsap.timeline({ repeat: -1, paused: true }))
        }, root)
        return () => ctx.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (active) tl.current?.play()
        else tl.current?.pause()
    }, [active])
}

// ── DataVerse: points find their clusters ──────────────────────────────────
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

export function DataScene({ color, active }) {
    const ref = useRef(null)
    useEffect(() => {
        if (!active) return
        const c = ref.current
        const ctx = c.getContext("2d")
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const W = (c.width = c.clientWidth * dpr)
        const H = (c.height = c.clientHeight * dpr)
        const tints = [color, "#eceef1", "#ff7a59"]
        const centers = [[0.27, 0.36], [0.72, 0.3], [0.52, 0.74]]
        const pts = Array.from({ length: 140 }, (_, i) => ({ x: Math.random(), y: Math.random(), tx: 0, ty: 0, k: i % 3 }))
        let clustered = false
        let iter = 0
        const retarget = () => {
            clustered = !clustered
            iter = 0
            pts.forEach(p => {
                if (clustered) {
                    const [cx, cy] = centers[p.k]
                    p.tx = cx + gauss() * 0.11
                    p.ty = cy + gauss() * 0.11
                } else {
                    p.tx = 0.05 + Math.random() * 0.9
                    p.ty = 0.05 + Math.random() * 0.9
                }
            })
        }
        retarget()
        const id = setInterval(retarget, 2800)
        let raf
        const frame = () => {
            iter++
            ctx.clearRect(0, 0, W, H)
            // grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)"
            ctx.lineWidth = dpr
            for (let g = 1; g < 8; g++) {
                ctx.beginPath(); ctx.moveTo((g / 8) * W, 0); ctx.lineTo((g / 8) * W, H); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(0, (g / 8) * H); ctx.lineTo(W, (g / 8) * H); ctx.stroke()
            }
            pts.forEach(p => {
                p.x += (p.tx - p.x) * 0.05
                p.y += (p.ty - p.y) * 0.05
                if (clustered) {
                    const [cx, cy] = centers[p.k]
                    ctx.strokeStyle = tints[p.k] + "22"
                    ctx.beginPath(); ctx.moveTo(p.x * W, p.y * H); ctx.lineTo(cx * W, cy * H); ctx.stroke()
                }
                ctx.fillStyle = clustered ? tints[p.k] : "rgba(255,255,255,0.7)"
                ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 2.6 * dpr, 0, Math.PI * 2); ctx.fill()
            })
            if (clustered) {
                centers.forEach(([cx, cy], k) => {
                    ctx.strokeStyle = tints[k]
                    ctx.lineWidth = 2 * dpr
                    const s = 9 * dpr
                    ctx.beginPath()
                    ctx.moveTo(cx * W - s, cy * H - s); ctx.lineTo(cx * W + s, cy * H + s)
                    ctx.moveTo(cx * W + s, cy * H - s); ctx.lineTo(cx * W - s, cy * H + s)
                    ctx.stroke()
                })
                ctx.lineWidth = dpr
            }
            ctx.fillStyle = "rgba(255,255,255,0.55)"
            ctx.font = `${11 * dpr}px "JetBrains Mono", monospace`
            const loss = clustered ? (0.9 / (1 + iter * 0.08)).toFixed(3) : "—"
            ctx.fillText(`k=3  iter=${String(Math.min(iter, 999)).padStart(3, "0")}  loss=${loss}`, 14 * dpr, H - 14 * dpr)
            raf = requestAnimationFrame(frame)
        }
        frame()
        return () => {
            clearInterval(id)
            cancelAnimationFrame(raf)
        }
    }, [active, color])
    return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

// ── WebArc: a page builds itself, then ships ───────────────────────────────
export function WebScene({ color, active }) {
    const root = useRef(null)
    useLoop(root, active, (tl) =>
        tl.set(".wa-toast", { yPercent: 150, opacity: 0 })
            .from(".wa-nav", { scaleX: 0, transformOrigin: "left", duration: 0.5, ease: "expo.out" })
            .from(".wa-hero", { scaleY: 0, transformOrigin: "top", duration: 0.6, ease: "expo.out" }, "-=0.2")
            .from(".wa-line", { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.1, ease: "expo.out" }, "-=0.3")
            .from(".wa-btn", { scale: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
            .from(".wa-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "expo.out" }, "-=0.3")
            .fromTo(".wa-cursor", { left: "85%", top: "90%", opacity: 0 }, { left: "14%", top: "52%", opacity: 1, duration: 0.9, ease: "power3.inOut" })
            .to(".wa-btn", { scale: 0.88, duration: 0.1, yoyo: true, repeat: 1 })
            .to(".wa-toast", { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" })
            .to(root.current.children, { opacity: 0, duration: 0.4 }, "+=1.6")
    )
    return (
        <div ref={root} className="absolute inset-0 p-5">
            <div className="flex h-full flex-col gap-3">
                <div className="wa-nav flex h-7 items-center justify-between rounded-md bg-white/[0.06] px-3">
                    <span className="h-2 w-10 rounded-full" style={{ background: color }} />
                    <span className="flex gap-2">{[0, 1, 2].map(i => <span key={i} className="h-1.5 w-6 rounded-full bg-white/25" />)}</span>
                </div>
                <div className="wa-hero relative flex flex-[1.3] flex-col justify-center gap-2 rounded-md px-4" style={{ background: `linear-gradient(120deg, ${color}33, transparent)` }}>
                    <span className="wa-line h-3 w-3/5 rounded-full bg-white/80" />
                    <span className="wa-line h-3 w-2/5 rounded-full bg-white/50" />
                    <span className="wa-line h-1.5 w-1/2 rounded-full bg-white/20" />
                    <span className="wa-btn mt-2 h-6 w-20 rounded-full" style={{ background: color }} />
                </div>
                <div className="grid flex-1 grid-cols-3 gap-3">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="wa-card flex flex-col gap-1.5 rounded-md border border-white/10 bg-white/[0.03] p-2.5">
                            <span className="h-8 rounded" style={{ background: `${color}${["44", "30", "22"][i]}` }} />
                            <span className="h-1.5 w-4/5 rounded-full bg-white/25" />
                            <span className="h-1.5 w-3/5 rounded-full bg-white/15" />
                        </div>
                    ))}
                </div>
            </div>
            <svg className="wa-cursor absolute h-5 w-5 drop-shadow" viewBox="0 0 24 24" fill="white"><path d="M4 2l16 10-7 1.5L9.5 21z" /></svg>
            <div className="wa-toast absolute right-4 bottom-4 rounded-lg border border-white/10 bg-black/80 px-3 py-2 font-mono text-[11px] text-white backdrop-blur">
                <span style={{ color }}>✓</span> deployed · 42ms
            </div>
        </div>
    )
}

// ── Competitive Programming: code, tests, verdict ──────────────────────────
const CODE = [
    ["#include", " <bits/stdc++.h>"],
    ["int", " main() {"],
    ["  int", " n; cin >> n;"],
    ["  vector<long long>", " a(n), dp(n + 1);"],
    ["  for", " (auto &x : a) cin >> x;"],
    ["  sort", "(a.begin(), a.end());"],
    ["  for", " (int i = 0; i < n; i++)"],
    ["    dp[i + 1]", " = max(dp[i], dp[i] + a[i]);"],
    ["  cout", " << dp[n] << '\\n';"],
    ["}", ""],
]
const TESTS = 24

export function CPScene({ color, active }) {
    const [step, setStep] = useState(0)
    const stamp = useRef(null)
    const total = CODE.length + TESTS + 1

    useEffect(() => {
        if (!active) return
        const id = setInterval(() => setStep(s => (s >= total + 14 ? 0 : s + 1)), 110)
        return () => clearInterval(id)
    }, [active, total])

    const shown = Math.min(step, CODE.length)
    const passed = Math.max(0, Math.min(step - CODE.length, TESTS))
    const verdict = step > CODE.length + TESTS

    useEffect(() => {
        if (verdict && stamp.current) {
            gsap.fromTo(stamp.current, { scale: 2.4, rotate: -14, opacity: 0 }, { scale: 1, rotate: -8, opacity: 1, duration: 0.45, ease: "back.out(2.2)" })
        }
    }, [verdict])

    return (
        <div className="absolute inset-0 grid grid-rows-[1fr_auto] font-mono text-[11px] sm:text-xs">
            <pre className="overflow-hidden p-4 leading-[1.7] text-white/80">
                {CODE.slice(0, shown).map(([k, rest], i) => (
                    <div key={i}>
                        <span className="mr-4 inline-block w-4 text-right text-white/25">{i + 1}</span>
                        <span style={{ color }}>{k}</span>{rest}
                    </div>
                ))}
                {shown < CODE.length && <span className="animate-blink ml-8 inline-block h-3.5 w-2 translate-y-0.5" style={{ background: color }} />}
            </pre>
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center justify-between text-white/50">
                    <span>running tests…</span>
                    <span>{passed}/{TESTS}</span>
                </div>
                <div className="mt-2 grid grid-cols-12 gap-1">
                    {Array.from({ length: TESTS }, (_, i) => (
                        <span key={i} className="h-2 rounded-sm transition-colors duration-150" style={{ background: i < passed ? "#3ddc97" : "rgba(255,255,255,0.08)" }} />
                    ))}
                </div>
            </div>
            {verdict && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div ref={stamp} className="rounded-lg border-4 border-[#3ddc97] bg-black/70 px-6 py-3 text-center text-[#3ddc97] backdrop-blur-sm">
                        <p className="font-display text-3xl font-black tracking-tight sm:text-4xl">ACCEPTED</p>
                        <p className="mt-1 text-[11px] text-white/60">0.12s · 3.4MB · rank #1</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Design: pen tool → shape → palette ─────────────────────────────────────
const BLOB = "M200 60 C 290 60, 330 130, 300 190 C 270 250, 150 260, 110 200 C 70 140, 110 60, 200 60 Z"
const ANCHORS = [[200, 60], [300, 190], [110, 200]]
const HANDLES = [[[110, 60], [290, 60]], [[330, 130], [270, 250]], [[150, 260], [70, 140]]]

export function DesignScene({ color, active }) {
    const root = useRef(null)
    useLoop(root, active, (tl) =>
        tl.fromTo(".ds-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" })
            .from(".ds-anchor", { scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.35, ease: "back.out(3)" }, 0)
            .from(".ds-handle", { opacity: 0, duration: 0.3, stagger: 0.35 }, 0.1)
            .fromTo(".ds-fill", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to([".ds-handle", ".ds-anchor"], { opacity: 0, duration: 0.3 }, "<")
            .from(".ds-swatch", { y: 30, opacity: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2)" }, "-=0.3")
            .from(".ds-type", { opacity: 0, x: -20, duration: 0.6, ease: "expo.out" }, "-=0.2")
            .to(root.current.querySelectorAll("svg > *"), { opacity: 0, duration: 0.4 }, "+=1.6")
    )
    const swatches = [color, "#ffd166", "#ef476f", "#118ab2", "#eceef1"]
    return (
        <div ref={root} className="absolute inset-0">
            <svg viewBox="0 0 400 300" className="h-full w-full">
                <defs>
                    <linearGradient id="ds-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor={color} />
                        <stop offset="1" stopColor="#ef476f" />
                    </linearGradient>
                </defs>
                <g>
                    <path className="ds-fill" d={BLOB} fill="url(#ds-grad)" />
                    <path className="ds-path" d={BLOB} pathLength="1" strokeDasharray="1" fill="none" stroke="#fff" strokeWidth="1.5" />
                    {HANDLES.map((pair, i) => (
                        <g key={i} className="ds-handle" stroke="#ffffff88" strokeWidth="1">
                            <line x1={pair[0][0]} y1={pair[0][1]} x2={ANCHORS[i][0]} y2={ANCHORS[i][1]} />
                            <line x1={pair[1][0]} y1={pair[1][1]} x2={ANCHORS[i][0]} y2={ANCHORS[i][1]} />
                            <circle cx={pair[0][0]} cy={pair[0][1]} r="3" fill="#fff" />
                            <circle cx={pair[1][0]} cy={pair[1][1]} r="3" fill="#fff" />
                        </g>
                    ))}
                    {ANCHORS.map(([x, y], i) => <rect key={i} className="ds-anchor" x={x - 5} y={y - 5} width="10" height="10" fill="#07090e" stroke="#fff" strokeWidth="1.5" />)}
                </g>
                <g>
                    {swatches.map((s, i) => <rect key={s} className="ds-swatch" x={24 + i * 30} y={252} width="22" height="22" rx="6" fill={s} />)}
                </g>
                <g className="ds-type" fill="#fff">
                    <text x="378" y="272" textAnchor="end" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="38">Aa</text>
                    <text x="378" y="40" textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="#ffffff88">W 190 · H 200 · R 24</text>
                </g>
            </svg>
        </div>
    )
}

// ── Content: the words keep coming ─────────────────────────────────────────
const LINES = ["Every event has a story.", "We write the first draft.", "Captions. Threads. Recaps.", "Words that stick."]

export function ContentScene({ color, active }) {
    const [state, setState] = useState({ line: 0, n: 0, dir: 1 })
    useEffect(() => {
        if (!active) return
        const id = setInterval(() => {
            setState(({ line, n, dir }) => {
                const len = LINES[line].length
                if (dir === 1 && n < len) return { line, n: n + 1, dir }
                if (dir === 1) return { line, n: n + 1, dir: n > len + 18 ? -1 : 1 } // hold, then delete
                if (n > 0) return { line, n: Math.min(n, len) - 1, dir }
                return { line: (line + 1) % LINES.length, n: 0, dir: 1 }
            })
        }, 55)
        return () => clearInterval(id)
    }, [active])
    const text = LINES[state.line].slice(0, state.n)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    return (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
            <div className="flex gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                <span>draft</span><span>·</span><span>post #{128 + state.line}</span>
            </div>
            <p className="font-serif text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] text-white italic">
                {text}
                <span className="animate-blink ml-1 inline-block h-[0.9em] w-[3px] translate-y-1" style={{ background: color }} />
            </p>
            <div>
                <div className="space-y-2">
                    {[92, 78, 85, 40].map((w, i) => <span key={i} className="block h-1.5 rounded-full bg-white/10" style={{ width: `${w}%` }} />)}
                </div>
                <p className="mt-4 font-mono text-[11px] text-white/50">
                    <span style={{ color }}>{words}</span> words · reading time 1 min
                </p>
            </div>
        </div>
    )
}

// ── Public Relations: MDC at the centre of a network ───────────────────────
const NODES = ["Students", "Clubs", "Industry", "Faculty", "Alumni", "Sponsors"]

export function PRScene({ color, active }) {
    const root = useRef(null)
    const pos = NODES.map((_, i) => {
        const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
        return [200 + Math.cos(a) * 130, 150 + Math.sin(a) * 100]
    })
    useLoop(root, active, (tl) => {
        tl.from(".pr-hub", { scale: 0, svgOrigin: "200 150", duration: 0.6, ease: "back.out(2)" })
            .fromTo(".pr-edge", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, "-=0.2")
            .from(".pr-node", { scale: 0, opacity: 0, duration: 0.4, stagger: 0.12, ease: "back.out(3)", transformOrigin: "50% 50%" }, "<0.2")
        pos.forEach(([x, y], i) => {
            tl.fromTo(`.pr-pulse-${i}`, { attr: { cx: 200, cy: 150 }, opacity: 1 }, { attr: { cx: x, cy: y }, opacity: 0.2, duration: 0.8, ease: "power1.in" }, 1.8 + (i % 3) * 0.25 + Math.floor(i / 3) * 0.9)
        })
        tl.to(root.current.querySelectorAll("svg > g"), { opacity: 0, duration: 0.4 }, "+=1.2")
        return tl
    })
    return (
        <div ref={root} className="absolute inset-0">
            <svg viewBox="0 0 400 300" className="h-full w-full">
                <g>
                    {pos.map(([x, y], i) => (
                        <line key={i} className="pr-edge" x1="200" y1="150" x2={x} y2={y} pathLength="1" strokeDasharray="1" stroke={`${color}88`} strokeWidth="1.2" />
                    ))}
                    {pos.map((_, i) => <circle key={i} className={`pr-pulse-${i}`} cx="200" cy="150" r="4" fill={color} opacity="0" />)}
                </g>
                <g>
                    {pos.map(([x, y], i) => (
                        <g key={NODES[i]} className="pr-node">
                            <circle cx={x} cy={y} r="22" fill="#07090e" stroke="#ffffff55" />
                            <text x={x} y={y + 3} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="#fff">{NODES[i]}</text>
                        </g>
                    ))}
                </g>
                <g className="pr-hub">
                    <circle cx="200" cy="150" r="36" fill={color} />
                    <circle cx="200" cy="150" r="46" fill="none" stroke={color} strokeOpacity="0.35" />
                    <text x="200" y="156" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="18" fill="#07090e">MDC</text>
                </g>
            </svg>
        </div>
    )
}

// ── Photography: the iris opens, the shutter fires ─────────────────────────
function hexagon(r, rot) {
    return Array.from({ length: 6 }, (_, i) => {
        const a = rot + (i / 6) * Math.PI * 2
        return `${200 + Math.cos(a) * r},${150 + Math.sin(a) * r}`
    }).join(" ")
}

export function PhotoScene({ color, active, img }) {
    const root = useRef(null)
    const hole = useRef(null)
    const [shot, setShot] = useState(42)
    useLoop(root, active, (tl) => {
        const iris = { r: 0, rot: 0 }
        const draw = () => hole.current?.setAttribute("points", hexagon(iris.r, iris.rot))
        return tl.set(iris, { r: 0, rot: 0, onComplete: draw })
            .to(iris, { r: 260, rot: 1.2, duration: 1.3, ease: "expo.inOut", onUpdate: draw })
            .fromTo(".ph-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.5, ease: "power2.out" }, "+=0.6")
            .add(() => setShot(s => s + 1), "<")
            .from(".ph-meta", { opacity: 0, y: 8, duration: 0.4, stagger: 0.06 }, "<")
            .to(iris, { r: 0, rot: 2.4, duration: 1, ease: "expo.inOut", onUpdate: draw }, "+=1.6")
    })
    return (
        <div ref={root} className="absolute inset-0">
            <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
                <defs>
                    <mask id="ph-iris">
                        <rect width="400" height="300" fill="white" />
                        <polygon ref={hole} points={hexagon(0, 0)} fill="black" />
                    </mask>
                </defs>
                <rect width="400" height="300" fill="#07090e" mask="url(#ph-iris)" />
                {/* viewfinder */}
                <g stroke="#ffffffaa" strokeWidth="1.2" fill="none">
                    <path d="M20 40 V20 H40 M360 20 H380 V40 M380 260 V280 H360 M40 280 H20 V260" />
                    <circle cx="200" cy="150" r="10" />
                </g>
            </svg>
            <div className="ph-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 font-mono text-[11px] text-white">
                <span className="ph-meta"><span style={{ color }}>●</span> IMG_{String(shot).padStart(4, "0")}</span>
                <span className="ph-meta">f/1.8 · 1/250 · ISO 400</span>
            </div>
        </div>
    )
}
