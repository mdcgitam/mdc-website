import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Container, Eyebrow, Button, Avatar } from "../components/ui/primitives"
import { SplitReveal, VelocityMarquee, Parallax, CountUp } from "../components/fx/effects"
import { DataScene, WebScene, CPScene, DesignScene, ContentScene, PRScene, PhotoScene, SceneFrame } from "../components/domains/Scenes"
import { DOMAINS } from "../data/site"
import { latestDomainTeam } from "../data/tenureData"
import { useEvents } from "../lib/events"
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget } from "../lib/smooth"
import { ArrowRight } from "../components/ui/Icons"

const META = {
    DataVerse: { Scene: DataScene, file: "~/dataverse/kmeans.ipynb", tagline: "Teach machines to *see* patterns." },
    WebArcs: { Scene: WebScene, file: "localhost:5173", tagline: "Ship it to the *whole* internet." },
    CP: { Scene: CPScene, file: "~/cp/solution.cpp", tagline: "Fastest *correct* answer wins." },
    Design: { Scene: DesignScene, file: "poster-final-v7.fig", tagline: "Make it look *inevitable.*" },
    Content: { Scene: ContentScene, file: "recap-draft.md", tagline: "Every event deserves a *story.*" },
    PR: { Scene: PRScene, file: "network.graph", tagline: "Everyone knows *someone* at MDC." },
    Photography: { Scene: PhotoScene, file: "DCIM/100_MDC", tagline: "If it happened, we *shot* it." },
}

const slug = (key) => key.toLowerCase()

// ── Opening: the seven domains as one giant index ──────────────────────────
function DomainIndex() {
    const root = useRef(null)
    useLayoutEffect(() => {
        if (prefersReducedMotion()) return
        const ctx = gsap.context(() => {
            gsap.from(".dx-row", { xPercent: (i) => (i % 2 ? 40 : -40), opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.07, delay: 0.5 })
        }, root)
        return () => ctx.revert()
    }, [])

    return (
        <ul ref={root} className="mt-16 border-t border-line">
            {DOMAINS.map((d, i) => {
                const { color } = d
                return (
                    <li key={d.key} className="dx-row border-b border-line">
                        <button
                            type="button"
                            onClick={() => scrollToTarget(document.getElementById(slug(d.key)), { offset: 0 })}
                            className="group relative flex w-full items-center gap-4 overflow-hidden py-3 text-left sm:gap-8 sm:py-4"
                        >
                            <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100" style={{ background: color }} />
                            <span className="relative w-8 font-mono text-xs text-fg-subtle transition-colors group-hover:text-[#07090e] sm:w-12">0{i + 1}</span>
                            <span className="relative flex-1 truncate font-display text-[clamp(2.2rem,7.5vw,7rem)] leading-[1] font-semibold tracking-[-0.05em] transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-[#07090e]">
                                {d.name}
                            </span>
                            <span className="relative hidden font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle transition-colors group-hover:text-[#07090e] md:block">
                                {d.focus}
                            </span>
                            <img
                                src={d.img}
                                alt=""
                                className="relative hidden h-16 w-24 translate-x-8 rotate-6 rounded-md object-cover opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100 lg:block"
                            />
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}

// ── One chapter per domain ─────────────────────────────────────────────────
function Chapter({ d, i, events, onActive }) {
    const { Scene, file, tagline } = META[d.key]
    const { color } = d
    const root = useRef(null)
    const [visible, setVisible] = useState(false)
    const team = useMemo(() => latestDomainTeam(d.key), [d.key])
    const lead = team?.members.find(m => /lead/i.test(m.role))
    const count = events.filter(e => e.domain === d.key).length

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" })
        io.observe(root.current)
        return () => io.disconnect()
    }, [])

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: root.current,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => self.isActive && onActive(i),
            })
            if (prefersReducedMotion()) return
            gsap.from(".ch-frame", {
                y: 120,
                rotate: i % 2 ? -6 : 6,
                scale: 0.85,
                opacity: 0,
                duration: 1.4,
                ease: "expo.out",
                scrollTrigger: { trigger: root.current, start: "top 70%" },
            })
            gsap.from(".ch-meta > *", {
                y: 24,
                opacity: 0,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.07,
                scrollTrigger: { trigger: root.current, start: "top 65%" },
            })
            // Name slides across as the chapter scrolls past.
            gsap.fromTo(".ch-ghost", { xPercent: i % 2 ? -20 : 10 }, {
                xPercent: i % 2 ? 10 : -20,
                ease: "none",
                scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            })
        }, root)
        return () => ctx.revert()
    }, [i, onActive])

    const flip = i % 2 === 1
    return (
        <section id={slug(d.key)} ref={root} className="relative flex min-h-[100svh] scroll-mt-0 items-center overflow-hidden py-28">
            {/* ghost name, huge and outlined, drifting behind */}
            <p
                aria-hidden
                className="ch-ghost pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[28vw] leading-none font-black tracking-[-0.06em] whitespace-nowrap text-transparent select-none"
                style={{ WebkitTextStroke: `1px ${color}1f` }}
            >
                {d.name}
            </p>

            <Container className={`relative grid items-center gap-12 lg:gap-20 ${flip ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1fr_1.1fr]"}`}>
                <div className={`ch-meta ${flip ? "lg:order-2" : ""}`} style={{ "--color-accent": color }}>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color }}>
                        0{i + 1} / {d.track}
                    </p>
                    <h2 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
                        {d.name}
                    </h2>
                    <SplitReveal text={tagline} className="mt-4 block text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-fg-muted" />
                    <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted">{d.desc}</p>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {d.focus.split(" · ").map(f => (
                            <span key={f} className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ borderColor: `${color}55`, color }}>
                                {f}
                            </span>
                        ))}
                    </div>

                    <div className="mt-10 grid max-w-md grid-cols-2 border-y border-line">
                        <div className="py-5 pr-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">{count > 0 ? "Events run" : "Team size"}</p>
                            <p className="mt-2 font-display text-5xl font-semibold tracking-tight tabular-nums">
                                <CountUp value={count > 0 ? count : team?.members.length || 0} pad={2} />
                            </p>
                        </div>
                        <div className="border-l border-line py-5 pl-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">{lead ? `Lead · ${team.year}` : "Track"}</p>
                            <p className="mt-2 text-lg leading-tight font-medium">{lead ? lead.name : d.track}</p>
                        </div>
                    </div>

                    {team && (
                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {team.members.slice(0, 7).map(m => (
                                    <Avatar key={m.name} src={m.img} name={m.name} className="h-10 w-10 rounded-full ring-2 ring-bg transition-transform hover:z-10 hover:-translate-y-1" />
                                ))}
                            </div>
                            {team.members.length > 7 && <span className="font-mono text-xs text-fg-subtle">+{team.members.length - 7}</span>}
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-5 font-mono text-xs uppercase tracking-[0.15em]">
                        {count > 0 && (
                            <Link to={`/events?domain=${d.key}`} className="group inline-flex items-center gap-2" style={{ color }}>
                                See their events <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                        <Link to="/team" className="group inline-flex items-center gap-2 text-fg-muted hover:text-fg">
                            Meet the team <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className={`ch-frame ${flip ? "lg:order-1" : ""}`}>
                    <SceneFrame title={file} color={color}>
                        <Scene color={color} active={visible} img={d.img} />
                    </SceneFrame>
                </div>
            </Container>
        </section>
    )
}

// ── Progress rail (desktop) ────────────────────────────────────────────────
function Rail({ active, show }) {
    return (
        <nav
            aria-label="Domains"
            className={`fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 xl:flex ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
            {DOMAINS.map((d, i) => {
                const on = i === active
                return (
                    <button
                        key={d.key}
                        type="button"
                        onClick={() => scrollToTarget(document.getElementById(slug(d.key)), { offset: 0 })}
                        className="group flex items-center justify-end gap-3"
                    >
                        <span className={`font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300 ${on ? "text-fg opacity-100" : "text-fg-subtle opacity-0 group-hover:opacity-100"}`}>
                            {d.key === "CP" ? "CP" : d.name}
                        </span>
                        <span className="h-px transition-all duration-500" style={{ width: on ? 36 : 14, background: on ? d.color : "var(--color-line-strong)" }} />
                    </button>
                )
            })}
        </nav>
    )
}

export default function Domains() {
    const { events } = useEvents()
    const [active, setActive] = useState(-1)
    const glow = useRef(null)
    const chapters = useRef(null)

    // Page-wide glow takes on the colour of whichever domain is in view.
    useEffect(() => {
        if (!glow.current) return
        const color = active >= 0 ? DOMAINS[active].color : "#4a80ff"
        gsap.to(glow.current, { backgroundColor: color, opacity: active >= 0 ? 0.22 : 0.12, duration: 1.2, ease: "power2.out" })
    }, [active])

    // Leaving the chapters (back to the index or on to the outro) clears the rail.
    useLayoutEffect(() => {
        const st = ScrollTrigger.create({
            trigger: chapters.current,
            start: "top center",
            end: "bottom center",
            onLeave: () => setActive(-1),
            onLeaveBack: () => setActive(-1),
        })
        return () => st.kill()
    }, [])

    return (
        <main className="relative">
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                <div ref={glow} className="absolute top-1/2 left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[160px]" style={{ backgroundColor: "#4a80ff" }} />
            </div>

            <Rail active={active} show={active >= 0} />

            <header className="relative pt-36 pb-20 sm:pt-44">
                <Container>
                    <Eyebrow index="07">Domains</Eyebrow>
                    <h1 className="mt-6 text-[clamp(3rem,9vw,9rem)] leading-[0.88] font-semibold tracking-[-0.05em]">
                        <SplitReveal trigger="intro" text="Seven *worlds.*" className="block" delay={0.2} />
                        <SplitReveal trigger="intro" text="One club." className="block" delay={0.35} />
                    </h1>
                    <p className="mt-8 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
                        Three engineering tracks run our contests, hackathons and workshops. Four creative crafts make sure the world hears about them.
                        Pick one and scroll in.
                    </p>
                    <DomainIndex />
                </Container>
            </header>

            <VelocityMarquee className="border-y border-line py-6" baseSpeed={50}>
                {DOMAINS.map(d => (
                    <span key={d.key} className="mx-8 flex items-center gap-8 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                        {d.name}
                        <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                    </span>
                ))}
            </VelocityMarquee>

            <div ref={chapters}>
                {DOMAINS.map((d, i) => (
                    <Chapter key={d.key} d={d} i={i} events={events} onActive={setActive} />
                ))}
            </div>

            <section className="relative overflow-hidden border-t border-line py-32 sm:py-44">
                <Parallax speed={0.2} className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                    <div className="flex gap-3">
                        {DOMAINS.map(d => <span key={d.key} className="h-40 w-6 rounded-full opacity-60 blur-xl sm:w-10" style={{ background: d.color }} />)}
                    </div>
                </Parallax>
                <Container className="relative text-center">
                    <h2 className="text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
                        <SplitReveal text="Pick your *side.*" className="block" />
                    </h2>
                    <p className="mx-auto mt-6 max-w-md text-base text-fg-muted">Applications open every semester. Tell us which world you want to build in.</p>
                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                        <Button to="/contact#apply" arrow>Join MDC</Button>
                        <Button to="/events" variant="ghost">See our events</Button>
                    </div>
                </Container>
            </section>
        </main>
    )
}
