import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Eyebrow } from "../ui/primitives"
import { SplitReveal } from "../fx/effects"
import { DOMAINS } from "../../data/site"
import { latestDomainTeam } from "../../data/tenureData"
import { useEvents } from "../../lib/events"

const AUTOPLAY_MS = 3200
const IDLE_MS = 7000
const slug = (key) => key.toLowerCase()

// Types a line out character by character; remount (via key) to replay.
function Typed({ text }) {
    const [n, setN] = useState(0)
    useEffect(() => {
        let i = 0
        const id = setInterval(() => {
            i += 2
            setN(i)
            if (i >= text.length) clearInterval(id)
        }, 22)
        return () => clearInterval(id)
    }, [text])
    return (
        <>
            {text.slice(0, n)}
            <span className="animate-blink ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[3px] bg-fg/70" />
        </>
    )
}

// One mechanical key: a coloured skirt underneath and a cap that travels down when pressed.
function Keycap({ d, i, active, down, onPress }) {
    return (
        <button
            type="button"
            onClick={() => onPress(i)}
            aria-pressed={active}
            aria-label={`${d.name} (key ${i + 1})`}
            className="group relative h-24 select-none sm:h-28 lg:h-32"
        >
            <span
                aria-hidden
                className="absolute inset-x-0 top-2.5 bottom-0 rounded-[18px] bg-ink/20 transition-colors"
                style={active ? { background: `color-mix(in srgb, ${d.color} 70%, #000 30%)` } : undefined}
            />
            <span
                className={`absolute inset-x-0 top-0 bottom-2.5 flex flex-col justify-between rounded-[18px] border border-line-strong p-3 text-left transition-[transform,background-color] duration-150 ease-out group-hover:translate-y-[3px] group-active:translate-y-2.5 sm:p-4 ${down ? "translate-y-2.5" : ""}`}
                style={{
                    background: active ? `color-mix(in srgb, ${d.color} 22%, var(--color-surface))` : "var(--color-surface)",
                    boxShadow: "inset 0 -5px 0 color-mix(in srgb, var(--color-ink) 7%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.35)",
                }}
            >
                <span className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-fg-subtle">{i + 1}</span>
                    <span
                        className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                        style={{ background: active ? d.color : "var(--color-line-strong)", boxShadow: active ? `0 0 10px ${d.color}` : "none" }}
                    />
                </span>
                <span className="font-display text-xl leading-none font-bold tracking-[-0.04em] sm:text-2xl lg:text-3xl">{d.short}</span>
            </span>
        </button>
    )
}

// Domains as a keyboard: seven keys, one screen. Idle, it plays itself.
export default function Domains() {
    const { events } = useEvents()
    const navigate = useNavigate()
    const root = useRef(null)
    const [active, setActive] = useState(0)
    const [down, setDown] = useState(null)
    const [inView, setInView] = useState(false)
    const lastTouch = useRef(0)
    const activeRef = useRef(0)

    const d = DOMAINS[active]
    const team = useMemo(() => latestDomainTeam(d.key), [d.key])
    const lead = team?.members.find(m => /lead/i.test(m.role))
    const count = events.filter(e => e.domain === d.key).length

    const press = useCallback((i, { auto = false } = {}) => {
        if (!auto) lastTouch.current = Date.now()
        activeRef.current = i
        setActive(i)
        setDown(i)
        setTimeout(() => setDown(cur => (cur === i ? null : cur)), 140)
    }, [])

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
        io.observe(root.current)
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        if (!inView) return
        const id = setInterval(() => {
            if (Date.now() - lastTouch.current < IDLE_MS) return
            press((activeRef.current + 1) % DOMAINS.length, { auto: true })
        }, AUTOPLAY_MS)
        return () => clearInterval(id)
    }, [inView, press])

    // Real keys: 1–7 press a domain, Enter opens it.
    useEffect(() => {
        if (!inView) return
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const tag = e.target?.tagName
            if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return
            const n = Number(e.key)
            if (n >= 1 && n <= DOMAINS.length) press(n - 1)
            else if (e.key === "Enter") navigate(`/domains#${slug(DOMAINS[activeRef.current].key)}`)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [inView, press, navigate])

    return (
        <section ref={root} id="domains" className="scroll-mt-16 py-24 sm:py-36">
            <Container>
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <Eyebrow index="03">Domains</Eyebrow>
                        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                            <SplitReveal text="Seven keys." className="block" />
                            <SplitReveal text="Press *one.*" className="block" delay={0.1} />
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
                        Every domain is a key on the board. Click one, or press{" "}
                        <kbd className="rounded border border-line-strong px-1.5 font-mono text-xs">1</kbd>–<kbd className="rounded border border-line-strong px-1.5 font-mono text-xs">7</kbd> on your keyboard.
                    </p>
                </div>

                {/* The screen */}
                <div className="mt-14 overflow-hidden rounded-[28px] border border-line-strong bg-bg-elev">
                    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 font-mono text-[11px] text-fg-subtle sm:px-7">
                        <span className="truncate">mdc://domains/<span style={{ color: d.color }}>{slug(d.key)}</span></span>
                        <span className="shrink-0">{String(active + 1).padStart(2, "0")} / {String(DOMAINS.length).padStart(2, "0")} · {d.track}</span>
                    </div>
                    <div key={d.key} className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                        <div className="min-w-0">
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: d.color }}>{d.focus}</p>
                            <h3 className="mt-3 animate-[fadein_0.5s_ease-out] font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
                                {d.name}
                            </h3>
                            <p className="mt-5 min-h-[3.5em] max-w-lg font-mono text-sm leading-relaxed text-fg-muted">
                                <Typed text={d.desc} />
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-6">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
                                <img src={d.img} alt="" className="h-full w-full animate-[fadein_0.6s_ease-out] object-cover" />
                                <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(135deg, ${d.color}55, transparent 60%)` }} />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                                <span className="text-fg-subtle">
                                    {count > 0
                                        ? <><span className="text-fg">{count}</span> events</>
                                        : <><span className="text-fg">{team?.members.length || 0}</span> members</>}
                                    {lead && <> · lead <span className="text-fg">{lead.name}</span></>}
                                </span>
                                <Link to={`/domains#${slug(d.key)}`} className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-3 py-1.5 uppercase tracking-[0.15em] text-fg hover:border-fg">
                                    Open <span className="text-fg-subtle">↵</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The board */}
                <div className="mt-5 rounded-[32px] border border-line bg-surface-2 p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] sm:p-4">
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 md:grid-cols-7">
                        {DOMAINS.map((dom, i) => (
                            <Keycap key={dom.key} d={dom} i={i} active={i === active} down={down === i} onPress={press} />
                        ))}
                        <Link to="/domains" className="group relative col-span-4 h-16 select-none sm:h-20 md:col-span-7" aria-label="Explore every domain">
                            <span aria-hidden className="absolute inset-x-0 top-2.5 bottom-0 rounded-[18px] bg-ink/20" />
                            <span
                                className="absolute inset-x-0 top-0 bottom-2.5 flex items-center justify-center gap-3 rounded-[18px] border border-line-strong bg-surface font-mono text-xs uppercase tracking-[0.25em] text-fg-muted transition-transform duration-150 group-hover:translate-y-[3px] group-hover:text-fg group-active:translate-y-2.5"
                                style={{ boxShadow: "inset 0 -5px 0 color-mix(in srgb, var(--color-ink) 7%, transparent)" }}
                            >
                                space · explore every domain →
                            </span>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}
