import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Eyebrow } from "../ui/primitives"
import { SplitReveal } from "../fx/effects"
import { useEvents, formatDate, domainLabel, partnerOf } from "../../lib/events"
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/smooth"
import { ChevronLeft, ChevronRight } from "../ui/Icons"

// Rings, inner → outer. The busiest domain gets the widest ring.
const RINGS = [
    { key: "EB", label: "MDC Core", short: "Core", color: "#eceef1" },
    { key: "DataVerse", label: "DataVerse", short: "DataVerse", color: "#9dbdff" },
    { key: "WebArcs", label: "WebArc", short: "WebArc", color: "#3ddc97" },
    { key: "CP", label: "Competitive Programming", short: "CP", color: "#4a80ff" },
]
const R_IN = 176
const R_STEP = 72
const R_TICKS = 448
const R_ARC = 152 // progress arc hugging the centre photo
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const MONTH_START_DAYS = [0, 31, 62, 92, 123, 153, 184, 215, 243, 274, 304, 335]
const DAY = 86400000
const TOUR_MS = 2800
const IDLE_BEFORE_TOUR_MS = 7000

// Collaborations are run by the core team, so they sit on the Core ring.
const ringOf = (e) => (partnerOf(e) ? "EB" : e.domain)
const academicStart = (d) => new Date(d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1, 6, 1)
const academicYear = (d) => {
    const y = academicStart(d).getFullYear()
    return `${y}-${String(y + 1).slice(2)}`
}
// Jul 1 sits at 12 o'clock; the year runs clockwise.
const angleOf = (d) => ((d - academicStart(d)) / DAY / 365) * Math.PI * 2 - Math.PI / 2
const polar = (r, a) => [Math.cos(a) * r, Math.sin(a) * r]
const toDeg = (a) => ((a + Math.PI / 2) * 180) / Math.PI // clockwise from 12 o'clock

// Smooth path through points (Catmull-Rom → cubic Bézier).
function smoothPath(pts) {
    if (pts.length < 2) return ""
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] || p2
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
    }
    return d
}

// Arc from 12 o'clock clockwise to angle `a`.
function arcPath(r, a) {
    const sweep = toDeg(a)
    if (sweep <= 0.5) return ""
    const [x, y] = polar(r, a)
    return `M 0 ${-r} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}`
}

export default function EventOrbit() {
    const { events, loading } = useEvents()
    const navigate = useNavigate()
    const root = useRef(null)
    const beam = useRef(null)
    const lastTouch = useRef(0)
    const [year, setYear] = useState("all")
    const [focusRing, setFocusRing] = useState(null)
    const [picked, setPicked] = useState(null) // { year, index }
    const [inView, setInView] = useState(false)
    const [reduced] = useState(prefersReducedMotion)

    const dated = useMemo(() => events.filter(e => e.dateObj && RINGS.some(r => r.key === ringOf(e))), [events])
    const years = useMemo(() => [...new Set(dated.map(e => academicYear(e.dateObj)))].sort().reverse(), [dated])

    // Place every event on its ring; nudge collisions outward so none overlap.
    const nodes = useMemo(() => {
        const taken = []
        return dated
            .filter(e => year === "all" || academicYear(e.dateObj) === year)
            .sort((a, b) => a.dateObj - b.dateObj)
            .map((e, i) => {
                const ring = RINGS.findIndex(r => r.key === ringOf(e))
                const a = angleOf(e.dateObj)
                let r = R_IN + ring * R_STEP
                let [x, y] = polar(r, a)
                while (taken.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 17)) {
                    r += 13
                    ;[x, y] = polar(r, a)
                }
                taken.push([x, y])
                return { e, i, ring, a, x, y, color: RINGS[ring].color, recent: academicYear(e.dateObj) === years[0] }
            })
    }, [dated, year, years])

    // Selection belongs to the current year filter; switching filters starts at the latest event.
    const activeIdx = picked && picked.year === year && picked.index < nodes.length ? picked.index : nodes.length - 1
    const active = nodes[activeIdx]
    const select = useCallback((index, byUser = true) => {
        if (byUser) lastTouch.current = Date.now()
        setPicked({ year, index: (index + nodes.length) % nodes.length })
    }, [year, nodes.length])

    // One constellation per academic year, so the line never jumps across the dial.
    const paths = useMemo(() => {
        const byYear = {}
        nodes.forEach(n => {
            const y = academicYear(n.e.dateObj)
            byYear[y] = [...(byYear[y] || []), [n.x, n.y]]
        })
        return Object.entries(byYear).map(([y, pts]) => ({ y, d: smoothPath(pts), recent: y === years[0] }))
    }, [nodes, years])

    const counts = RINGS.map(r => nodes.filter(n => RINGS[n.ring].key === r.key).length)

    // Auto-tour while visible and untouched.
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
        io.observe(root.current)
        return () => io.disconnect()
    }, [])
    useEffect(() => {
        if (!inView || reduced || nodes.length < 2) return
        const id = setInterval(() => {
            if (Date.now() - lastTouch.current > IDLE_BEFORE_TOUR_MS) select(activeIdx + 1, false)
        }, TOUR_MS)
        return () => clearInterval(id)
    }, [inView, reduced, nodes.length, activeIdx, select])

    // ← → step through events whenever the orbit is on screen (not while typing).
    useEffect(() => {
        if (!inView) return
        const onKey = (e) => {
            if (e.target.closest?.("input, textarea, [contenteditable]") || document.querySelector("[role=dialog]")) return
            if (e.key === "ArrowRight") { e.preventDefault(); select(activeIdx + 1) }
            if (e.key === "ArrowLeft") { e.preventDefault(); select(activeIdx - 1) }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [inView, activeIdx, select])

    // The radar beam swings to lock onto the active star.
    useEffect(() => {
        if (!beam.current || !active) return
        gsap.to(beam.current, { rotation: `${toDeg(active.a)}_short`, duration: reduced ? 0 : 1.1, ease: "expo.inOut" })
    }, [active, reduced])

    // Entrance: rings fade up, constellations draw, stars pop in date order.
    useLayoutEffect(() => {
        if (!nodes.length || reduced) return
        const ctx = gsap.context(() => {
            const lines = gsap.utils.toArray(".orb-path", root.current)
            lines.forEach(l => {
                const len = l.getTotalLength()
                gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
            })
            gsap.set(".orb-node", { scale: 0, transformOrigin: "center", transformBox: "fill-box" })
            gsap.set([".orb-spike", ".orb-ring", ".orb-ring-label"], { opacity: 0 })
            const step = 2.4 / nodes.length
            const tl = gsap.timeline({ paused: true })
            tl.to(".orb-ring", { opacity: 1, duration: 0.8, stagger: 0.06 })
                .to(".orb-ring-label", { opacity: 1, duration: 0.6, stagger: 0.06 }, 0.3)
                .to(lines, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut", onComplete: () => lines.forEach(l => l.style.removeProperty("stroke-dasharray")) }, 0.2)
                .to(".orb-node", { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: step }, 0.3)
                .to(".orb-spike", { opacity: 1, duration: 0.6, stagger: step }, 0.4)
            ScrollTrigger.create({ trigger: root.current, start: "top 65%", once: true, onEnter: () => tl.play() })
        }, root)
        return () => ctx.revert()
    }, [nodes, reduced])

    const ticks = useMemo(() => Array.from({ length: 365 }, (_, d) => {
        const a = (d / 365) * Math.PI * 2 - Math.PI / 2
        const monthStart = MONTH_START_DAYS.includes(d)
        const len = monthStart ? 18 : d % 7 === 0 ? 9 : 5
        const [x1, y1] = polar(R_TICKS, a)
        const [x2, y2] = polar(R_TICKS - len, a)
        return { x1, y1, x2, y2, monthStart }
    }), [])

    // Ring labels live in early June, where the club has never held an event.
    const labelAngle = (340 / 365) * Math.PI * 2 - Math.PI / 2
    const [todayX, todayY] = polar(R_TICKS, angleOf(new Date()))
    const [todayLX, todayLY] = polar(R_TICKS + 30, angleOf(new Date()) + 0.12)

    return (
        <section ref={root} className="relative overflow-hidden py-24 sm:py-36">
            <Container>
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div>
                        <Eyebrow index="05">Event orbit</Eyebrow>
                        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                            <SplitReveal text="A year," className="block" />
                            <SplitReveal text="in *orbit.*" className="block" delay={0.1} />
                        </h2>
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-muted">
                            Every event we've hosted, placed by date around the academic year and by domain on its ring.
                        </p>
                    </div>
                    <div className="flex gap-1 self-start rounded-full border border-line p-1 md:self-auto" role="tablist" aria-label="Academic year">
                        {["all", ...years].map(y => (
                            <button
                                key={y}
                                role="tab"
                                aria-selected={y === year}
                                onClick={() => { setYear(y); lastTouch.current = Date.now() }}
                                className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${y === year ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
                            >
                                {y === "all" ? "All years" : y}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
                    {/* ── The dial ───────────────────────────────────────── */}
                    <div className="relative mx-auto aspect-square w-full max-w-[740px]">
                        {/* Radar beam, locked onto the active star */}
                        <div
                            ref={beam}
                            aria-hidden
                            className="absolute inset-[3%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_292deg,rgba(74,128,255,0.04)_305deg,rgba(74,128,255,0.22)_358deg,rgba(143,176,255,0.55)_359.6deg,transparent_360deg)]"
                        />

                        <svg viewBox="-500 -500 1000 1000" className="relative h-full w-full overflow-visible" role="img" aria-label={`${nodes.length} events plotted by date and domain`}>
                            <defs>
                                <filter id="orb-glow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feGaussianBlur stdDeviation="5" result="b" />
                                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                                <radialGradient id="orb-core">
                                    <stop offset="0" stopColor="#4a80ff" stopOpacity="0.22" />
                                    <stop offset="1" stopColor="#4a80ff" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            <circle r="320" fill="url(#orb-core)" />

                            {/* Calendar rim */}
                            {ticks.map((t, i) => (
                                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.monthStart ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"} strokeWidth={t.monthStart ? 1.5 : 1} />
                            ))}
                            {MONTHS.map((m, i) => {
                                const a = ((MONTH_START_DAYS[i] + 15) / 365) * Math.PI * 2 - Math.PI / 2
                                const [x, y] = polar(R_TICKS + 28, a)
                                const current = active && Math.floor(((active.e.dateObj - academicStart(active.e.dateObj)) / DAY)) >= MONTH_START_DAYS[i] && (i === 11 || Math.floor(((active.e.dateObj - academicStart(active.e.dateObj)) / DAY)) < MONTH_START_DAYS[i + 1])
                                return (
                                    <text key={m} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[15px] uppercase transition-colors duration-500 ${current ? "fill-fg" : "fill-fg-subtle"}`}>
                                        {m}
                                    </text>
                                )
                            })}
                            {MONTH_START_DAYS.map((d, i) => {
                                const a = (d / 365) * Math.PI * 2 - Math.PI / 2
                                const [x1, y1] = polar(R_ARC + 14, a)
                                const [x2, y2] = polar(R_TICKS - 14, a)
                                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.045)" />
                            })}

                            {/* Domain rings + their labels */}
                            {RINGS.map((r, i) => {
                                const radius = R_IN + i * R_STEP
                                const [lx, ly] = polar(radius, labelAngle)
                                const faded = focusRing !== null && focusRing !== i
                                return (
                                    <g key={r.key} style={{ opacity: faded ? 0.25 : 1, transition: "opacity .4s" }}>
                                        <circle className="orb-ring" r={radius} fill="none" stroke={r.color} strokeOpacity="0.26" strokeDasharray="2 7" />
                                        <text className="orb-ring-label font-mono text-[13px]" x={lx - 8} y={ly + 4} textAnchor="end" fill={r.color} fillOpacity="0.75">
                                            {r.short}
                                        </text>
                                    </g>
                                )
                            })}

                            {/* Today */}
                            <circle cx={todayX} cy={todayY} r="5" className="fill-warm" />
                            <text x={todayLX} y={todayLY} textAnchor="middle" dominantBaseline="middle" className="fill-warm font-mono text-[13px]">today</text>

                            {/* Year-progress arc around the centre */}
                            <circle r={R_ARC} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                            {active && (
                                <path d={arcPath(R_ARC, active.a)} fill="none" stroke={active.color} strokeWidth="3" strokeLinecap="round" filter="url(#orb-glow)" className="transition-[stroke] duration-500" />
                            )}

                            {/* Spikes from each star out to the calendar */}
                            {nodes.map(n => {
                                const [x2, y2] = polar(R_TICKS - 14, n.a)
                                const dim = focusRing !== null && focusRing !== n.ring
                                return <line key={`s-${n.e.id}`} className="orb-spike" x1={n.x} y1={n.y} x2={x2} y2={y2} stroke={n.color} strokeOpacity={dim ? 0.03 : 0.16} />
                            })}
                            {active && (() => {
                                const [x2, y2] = polar(R_TICKS - 4, active.a)
                                const [ax, ay] = polar(R_ARC, active.a)
                                return (
                                    <g className="pointer-events-none">
                                        <line x1={ax} y1={ay} x2={x2} y2={y2} stroke={active.color} strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="3 5" />
                                        <circle cx={x2} cy={y2} r="4" fill={active.color} />
                                    </g>
                                )
                            })()}

                            {/* Constellations */}
                            {paths.map(p => (
                                <path
                                    key={p.y}
                                    className="orb-path"
                                    d={p.d}
                                    fill="none"
                                    stroke={p.recent ? "rgba(236,238,241,0.42)" : "rgba(236,238,241,0.2)"}
                                    strokeWidth={p.recent ? 1.4 : 1}
                                    strokeDasharray={p.recent ? undefined : "4 6"}
                                />
                            ))}

                            {/* Stars */}
                            {nodes.map((n, i) => {
                                const dim = focusRing !== null && focusRing !== n.ring
                                const isActive = i === activeIdx
                                const size = 5 + Math.min(n.e.images.length, 4) * 1.3
                                return (
                                    <g
                                        key={n.e.id}
                                        className="orb-node cursor-pointer outline-none"
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`${n.e.title}, ${formatDate(n.e.dateObj)}`}
                                        onPointerEnter={() => select(i)}
                                        onFocus={() => select(i)}
                                        onClick={() => navigate(`/events?id=${n.e.id}`)}
                                        onKeyDown={(ev) => ev.key === "Enter" && navigate(`/events?id=${n.e.id}`)}
                                        style={{ opacity: dim ? 0.15 : 1, transition: "opacity .4s" }}
                                    >
                                        <circle cx={n.x} cy={n.y} r="18" fill="transparent" />
                                        {isActive && (
                                            <>
                                                <circle cx={n.x} cy={n.y} r={size + 16} fill={n.color} fillOpacity="0.12" />
                                                <circle cx={n.x} cy={n.y} r={size + 8} fill="none" stroke={n.color} strokeWidth="1.5" />
                                            </>
                                        )}
                                        <circle
                                            cx={n.x}
                                            cy={n.y}
                                            r={isActive ? size + 2 : size}
                                            fill={n.recent ? n.color : "#07080a"}
                                            stroke={n.color}
                                            strokeWidth="2"
                                            filter="url(#orb-glow)"
                                            style={{ transition: "r .3s" }}
                                        />
                                    </g>
                                )
                            })}
                        </svg>

                        {/* Centre: the active event's photo */}
                        <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[27%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-line-strong bg-surface shadow-[0_0_60px_rgba(74,128,255,0.25)]">
                            <div className="flex h-full w-full items-center justify-center p-4 text-center font-display text-sm font-semibold text-fg-muted">
                                {loading ? "…" : active?.e.title}
                            </div>
                            {active?.e.images[0] && (
                                <img key={active.e.id} src={active.e.images[0]} alt="" className="absolute inset-0 h-full w-full animate-[fadein_.5s_ease] object-cover" />
                            )}
                        </div>

                        {/* Tooltip pinned to the active star */}
                        {active && (
                            <div
                                key={active.e.id}
                                className="pointer-events-none absolute z-10 hidden animate-[fadein_.35s_ease] sm:block"
                                style={{
                                    // Anchor just outside the star, on the side facing away from the centre.
                                    left: `${((active.x + Math.cos(active.a) * 26 + 500) / 1000) * 100}%`,
                                    top: `${((active.y + Math.sin(active.a) * 26 + 500) / 1000) * 100}%`,
                                    transform: `translate(${Math.cos(active.a) >= 0 ? "0" : "-100%"}, ${Math.sin(active.a) >= 0 ? "0" : "-100%"})`,
                                }}
                            >
                                <div className="rounded-lg border border-line-strong bg-bg/90 px-3 py-2 shadow-xl backdrop-blur" style={{ borderColor: `${active.color}66` }}>
                                    <p className="max-w-[200px] truncate text-[13px] font-semibold">{active.e.title}</p>
                                    <p className="mt-0.5 font-mono text-[10px] text-fg-subtle">{formatDate(active.e.dateObj, { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Readout + legend ───────────────────────────────── */}
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-xs text-fg-subtle tabular-nums">
                                <span className="text-fg">{String(activeIdx + 1).padStart(2, "0")}</span> / {String(nodes.length).padStart(2, "0")}
                            </p>
                            <div className="flex gap-1">
                                <button onClick={() => select(activeIdx - 1)} aria-label="Previous event" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => select(activeIdx + 1)} aria-label="Next event" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        {/* Progress through the tour */}
                        <div className="mt-3 h-px w-full bg-line">
                            <div className="h-full bg-fg transition-[width] duration-700 ease-out" style={{ width: `${nodes.length ? ((activeIdx + 1) / nodes.length) * 100 : 0}%` }} />
                        </div>

                        <div className="mt-8 min-h-[190px] border-l-2 pl-6 transition-colors duration-500" style={{ borderColor: active?.color || "#4a80ff" }}>
                            {active && (
                                <div key={active.e.id} className="animate-[fadein_.4s_ease]" aria-live="polite">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
                                        {formatDate(active.e.dateObj, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    <p className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight">{active.e.title}</p>
                                    <p className="mt-2 font-mono text-xs" style={{ color: active.color }}>{domainLabel(active.e)}</p>
                                    {active.e.description && (
                                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-muted">{active.e.description}</p>
                                    )}
                                    <button onClick={() => navigate(`/events?id=${active.e.id}`)} className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted hover:text-fg">
                                        Open event →
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="mt-10 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Rings · inner → outer</p>
                        <ul className="mt-2 space-y-0.5" onPointerLeave={() => setFocusRing(null)}>
                            {RINGS.map((r, i) => (
                                <li key={r.key}>
                                    <button
                                        onPointerEnter={() => setFocusRing(i)}
                                        onFocus={() => setFocusRing(i)}
                                        onBlur={() => setFocusRing(null)}
                                        onClick={() => setFocusRing(focusRing === i ? null : i)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${focusRing === i ? "bg-ink/5 text-fg" : "text-fg-muted hover:text-fg"}`}
                                    >
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }} />
                                        <span className="flex-1">{r.label}</span>
                                        <span className="h-1 w-16 overflow-hidden rounded-full bg-ink/5">
                                            <span className="block h-full rounded-full" style={{ width: `${nodes.length ? (counts[i] / Math.max(...counts)) * 100 : 0}%`, background: r.color }} />
                                        </span>
                                        <span className="w-6 text-right font-mono text-xs text-fg-subtle tabular-nums">{String(counts[i]).padStart(2, "0")}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 px-3 font-mono text-[11px] leading-relaxed text-fg-subtle">
                            Filled = {years[0]} · hollow = earlier · bigger = more photos · ← → to step through
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
