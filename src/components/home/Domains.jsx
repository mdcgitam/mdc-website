import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Container, Eyebrow } from "../ui/primitives"
import { SplitReveal } from "../fx/effects"
import { DOMAINS } from "../../data/site"
import { useEvents } from "../../lib/events"
import { gsap, isFinePointer } from "../../lib/smooth"

const FILES = { DataVerse: "dataverse.py", WebArcs: "webarc.tsx", CP: "solution.cpp" }
const CAPTIONS = { Design: "pixels, pushed", Content: "words that stick", PR: "every handshake", Photography: "we were there" }

// Types a line out character by character; remount (via key) to replay.
function Typed({ text }) {
    const [n, setN] = useState(0)
    useEffect(() => {
        let i = 0
        const id = setInterval(() => {
            i++
            setN(i)
            if (i >= text.length) clearInterval(id)
        }, 28)
        return () => clearInterval(id)
    }, [text])
    return <>{text.slice(0, n)}<span className="animate-blink ml-px inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-accent" /></>
}

// ── Engineering: terminal energy ───────────────────────────────────────────
function TerminalPreview({ d, className = "" }) {
    return (
        <div className={`force-dark overflow-hidden rounded-lg border border-accent/30 bg-[#0a0d14] shadow-[0_0_40px_rgba(74,128,255,0.25)] ${className}`}>
            <div className="flex items-center gap-1.5 border-b border-accent/20 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-accent/60" />
                <span className="h-2 w-2 rounded-full bg-accent/30" />
                <span className="h-2 w-2 rounded-full bg-accent/15" />
                <span className="ml-2 font-mono text-[10px] text-accent/80">~/mdc/{FILES[d.key]}</span>
            </div>
            <div className="relative aspect-[16/9]">
                <img src={d.img} alt="" className="h-full w-full object-cover grayscale contrast-125" />
                <div className="absolute inset-0 bg-accent opacity-70 mix-blend-color" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]" />
            </div>
            <p className="truncate px-3 py-2.5 font-mono text-[11px] text-fg">
                <span className="text-ok">❯ </span><Typed key={d.key} text={d.snippet} />
            </p>
        </div>
    )
}

function EngineeringRow({ d, i, n, dim, expanded, onToggle, onEnter, fine }) {
    return (
        <li onPointerEnter={onEnter} className="border-b border-accent/15">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className={`group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden py-6 text-left transition-opacity duration-500 sm:grid-cols-[4rem_1fr_auto] sm:py-7 ${dim ? "opacity-25" : ""}`}
            >
                {/* Scanlines sweep in on hover */}
                <span aria-hidden className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[repeating-linear-gradient(0deg,rgba(74,128,255,0.08)_0px,rgba(74,128,255,0.08)_1px,transparent_1px,transparent_4px)] transition-transform duration-700 ease-out group-hover:scale-x-100" />
                <span className="relative font-mono text-xs text-accent/70">0{i + 1}</span>
                <span className="relative flex min-w-0 items-baseline gap-3 font-mono text-[clamp(1.5rem,4.4vw,3.9rem)] leading-none font-medium tracking-[-0.06em] uppercase">
                    <span className="text-accent opacity-40 transition-opacity group-hover:opacity-100">&gt;</span>
                    <span className="truncate transition-transform duration-500 group-hover:translate-x-2">
                        {d.key === "CP" ? "Comp_Prog" : d.name}
                    </span>
                </span>
                <span className="relative hidden text-right font-mono text-[11px] leading-relaxed text-fg-subtle sm:block">
                    {d.focus.toLowerCase().replace(/ · /g, " / ")}
                    <br />
                    <span className="text-accent">{n > 0 ? `${n} events` : "track"}</span>
                </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 sm:grid-cols-[4rem_1fr_1fr]">
                        <span className="hidden sm:block" />
                        {expanded && <TerminalPreview d={d} className="w-full" />}
                        <div className="flex flex-col justify-between gap-6 font-mono">
                            <p className="text-sm leading-relaxed text-fg-muted"><span className="text-accent">// {d.name}: </span>{d.desc}</p>
                            <Link to={`/events?domain=${d.key}`} className="text-xs uppercase tracking-[0.18em] text-accent hover:text-fg">
                                $ ls events/{d.key.toLowerCase()} →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}

// ── Creative: studio warmth ────────────────────────────────────────────────
function Polaroid({ d, className = "" }) {
    return (
        <figure className={`bg-[#f4efe8] p-3 pb-12 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7)] ${className}`}>
            <div className="relative aspect-square overflow-hidden">
                <img src={d.img} alt="" className="h-full w-full object-cover sepia-[0.25] saturate-[1.1]" />
                <div className="absolute inset-0 bg-warm/15 mix-blend-soft-light" />
            </div>
            <figcaption className="mt-3 text-center font-serif text-2xl text-[#2a2522] italic">{CAPTIONS[d.key]}</figcaption>
        </figure>
    )
}

function CreativeRow({ d, i, dim, expanded, onToggle, onEnter, fine }) {
    return (
        <li onPointerEnter={onEnter} className="border-b border-warm/15">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className={`group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden py-5 text-left transition-opacity duration-500 sm:grid-cols-[4rem_1fr_auto] sm:py-6 ${dim ? "opacity-25" : ""}`}
            >
                <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/3 h-40 w-[60%] -translate-y-1/2 rounded-full bg-warm/0 blur-3xl transition-colors duration-700 group-hover:bg-warm/20" />
                <span className="relative font-serif text-lg text-warm/70 italic">{["i", "ii", "iii", "iv"][i]}.</span>
                <span className="relative font-serif text-[clamp(2.4rem,6.5vw,5.75rem)] leading-[0.95] tracking-[-0.02em] italic transition-all duration-500 group-hover:translate-x-3 group-hover:text-warm">
                    {d.name}
                </span>
                <span className="relative hidden text-right font-serif text-base text-fg-subtle italic sm:block">
                    {d.focus.replace(/ · /g, ", ")}
                </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="grid items-center gap-8 pb-10 sm:grid-cols-[4rem_1fr_1fr]">
                        <span className="hidden sm:block" />
                        <Polaroid d={d} className="mx-auto w-[80%] max-w-[340px] -rotate-3" />
                        <p className="font-serif text-2xl leading-snug text-fg-muted italic">{d.desc}</p>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default function Domains() {
    const { events } = useEvents()
    const [hover, setHover] = useState(null)
    const [open, setOpen] = useState(null)
    const [fine] = useState(isFinePointer)
    const preview = useRef(null)

    useEffect(() => {
        const el = preview.current
        if (!el || !fine) return
        const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" })
        const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" })
        const rot = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3" })
        let lastX = 0
        const move = (e) => {
            x(e.clientX)
            y(e.clientY)
            rot(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.5))
            lastX = e.clientX
        }
        window.addEventListener("pointermove", move, { passive: true })
        return () => window.removeEventListener("pointermove", move)
    }, [fine])

    useEffect(() => {
        if (!preview.current || !fine) return
        gsap.to(preview.current, { scale: hover ? 1 : 0.6, opacity: hover ? 1 : 0, duration: 0.5, ease: "expo.out" })
    }, [hover, fine])

    const countFor = (key) => events.filter(e => e.domain === key).length
    const engineering = DOMAINS.filter(d => d.track === "Engineering")
    const creative = DOMAINS.filter(d => d.track === "Creative")
    const hovered = DOMAINS.find(d => d.key === hover)
    const rowProps = (d) => ({
        d,
        fine,
        dim: hover && hover !== d.key,
        expanded: open === d.key,
        onToggle: () => setOpen(open === d.key ? null : d.key),
        onEnter: () => fine && setHover(d.key),
    })

    return (
        <section id="domains" className="scroll-mt-16 py-24 sm:py-36">
            <Container>
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <Eyebrow index="03">Domains</Eyebrow>
                        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                            <SplitReveal text="Two sides." className="block" />
                            <SplitReveal text="One *club.*" className="block" delay={0.1} />
                        </h2>
                    </div>
                    <div className="max-w-xs">
                        <p className="text-sm leading-relaxed text-fg-muted">
                            Engineers who write the code, and creatives who shape how MDC looks and sounds. Tap any domain to look inside.
                        </p>
                        <Link to="/domains" className="group mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-accent hover:text-fg">
                            Explore every domain <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>

                <div onPointerLeave={() => setHover(null)}>
                    <div className="mt-20 flex items-end justify-between border-b border-accent/40 pb-4">
                        <p className="font-mono text-sm text-accent">
                            <span className="text-fg-subtle">~/</span>engineering<span className="animate-blink">_</span>
                        </p>
                        <p className="font-mono text-[11px] text-fg-subtle">03 tracks · for people who write code</p>
                    </div>
                    <ul>
                        {engineering.map((d, i) => <EngineeringRow key={d.key} i={i} n={countFor(d.key)} {...rowProps(d)} />)}
                    </ul>

                    <div className="mt-24 flex items-end justify-between border-b border-warm/40 pb-4">
                        <p className="font-serif text-2xl text-warm italic">the creative studio</p>
                        <p className="font-serif text-base text-fg-subtle italic">four crafts, one voice</p>
                    </div>
                    <ul>
                        {creative.map((d, i) => <CreativeRow key={d.key} i={i} {...rowProps(d)} />)}
                    </ul>
                </div>
            </Container>

            {/* Pointer-following preview (desktop): terminal for engineering, polaroid for creative */}
            <div
                ref={preview}
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[340px] opacity-0 lg:block"
                style={{ marginLeft: 60, marginTop: -120 }}
            >
                {hovered && (hovered.track === "Engineering"
                    ? <TerminalPreview key={hovered.key} d={hovered} />
                    : <Polaroid key={hovered.key} d={hovered} className="w-[300px] rotate-[-4deg]" />)}
            </div>
        </section>
    )
}
