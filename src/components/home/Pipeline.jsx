import { useLayoutEffect, useRef } from "react"
import { Eyebrow } from "../ui/primitives"
import { PIPELINE } from "../../data/site"
import { gsap, ScrollTrigger } from "../../lib/smooth"

const PACKETS = 7

// Pinned horizontal "pipeline". Scrolling drives the track sideways while a
// pipe draws itself beneath the stages and data packets stream toward the tip.
export default function Pipeline() {
    const root = useRef(null)
    const track = useRef(null)
    const svg = useRef(null)
    const pipe = useRef(null)
    const counter = useRef(null)

    useLayoutEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
            const trackEl = track.current
            const svgEl = svg.current
            const pathEl = pipe.current
            const cards = gsap.utils.toArray(".pp-card", trackEl)
            const nodes = gsap.utils.toArray(".pp-node", svgEl)
            const stubs = gsap.utils.toArray(".pp-stub", svgEl)
            const packets = gsap.utils.toArray(".pp-packet", svgEl)

            let W = 0, L = 0, nodeX = [], drawn = 0, pipeY = 0
            const yAt = (x) => pipeY + Math.sin(x / 260) * 14

            // Geometry depends on layout, so rebuild it on every refresh.
            const build = () => {
                W = trackEl.scrollWidth
                const H = trackEl.offsetHeight
                pipeY = H * 0.9
                svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`)
                svgEl.style.width = `${W}px`
                svgEl.style.height = `${H}px`
                let d = `M 0 ${yAt(0)}`
                for (let x = 24; x <= W; x += 24) d += ` L ${x} ${yAt(x)}`
                pathEl.setAttribute("d", d)
                L = pathEl.getTotalLength()
                pathEl.style.strokeDasharray = `${L}`
                nodeX = cards.map(c => c.offsetLeft + c.offsetWidth / 2)
                nodes.forEach((n, i) => {
                    n.setAttribute("cx", nodeX[i])
                    n.setAttribute("cy", yAt(nodeX[i]))
                })
                stubs.forEach((s, i) => {
                    const c = cards[i]
                    s.setAttribute("x1", nodeX[i])
                    s.setAttribute("x2", nodeX[i])
                    s.setAttribute("y1", c.offsetTop + c.offsetHeight + 12)
                    s.setAttribute("y2", yAt(nodeX[i]) - 10)
                })
            }

            const setTip = (tipX) => {
                drawn = gsap.utils.clamp(0, L, (tipX / W) * L)
                pathEl.style.strokeDashoffset = `${L - drawn}`
                let active = 0
                nodeX.forEach((x, i) => {
                    const on = tipX >= x
                    if (on) active = i + 1
                    cards[i].dataset.active = on
                    nodes[i].dataset.active = on
                    stubs[i].dataset.active = on
                })
                if (counter.current) counter.current.textContent = String(Math.max(active, 1)).padStart(2, "0")
            }

            build()
            const tipFor = () => -gsap.getProperty(trackEl, "x") + window.innerWidth * 0.62

            const tween = gsap.to(trackEl, {
                x: () => -(trackEl.scrollWidth - window.innerWidth),
                ease: "none",
                onUpdate: () => setTip(tipFor()),
                scrollTrigger: {
                    trigger: root.current,
                    pin: true,
                    start: "top top",
                    end: () => `+=${trackEl.scrollWidth - window.innerWidth}`,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onRefresh: () => { build(); setTip(tipFor()) },
                },
            })
            setTip(tipFor())

            // Packets stream along the drawn part of the pipe, toward the tip.
            let t = 0
            const gap = 140
            const flow = (_, dt) => {
                t += dt / 1000
                packets.forEach((p, k) => {
                    const span = gap * PACKETS
                    const len = drawn - span + ((t * 260 + k * gap) % span)
                    if (len <= 0 || !L) { p.setAttribute("opacity", "0"); return }
                    const pt = pathEl.getPointAtLength(len)
                    p.setAttribute("cx", pt.x)
                    p.setAttribute("cy", pt.y)
                    p.setAttribute("opacity", String(Math.min(1, len / 200)))
                })
            }
            gsap.ticker.add(flow)

            return () => {
                gsap.ticker.remove(flow)
                tween.scrollTrigger?.kill()
                tween.kill()
            }
        })

        // Small screens / reduced motion: a vertical pipe that fills as you read.
        mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
            const cards = gsap.utils.toArray(".pp-card", track.current)
            cards.forEach(c => { c.dataset.active = "true" })
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
            const tween = gsap.fromTo(".pp-vline", { scaleY: 0 }, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: track.current, start: "top 70%", end: "bottom 60%", scrub: true },
            })
            return () => { tween.scrollTrigger?.kill(); tween.kill() }
        })

        const refresh = setTimeout(() => ScrollTrigger.refresh(), 300)
        return () => {
            clearTimeout(refresh)
            mm.revert()
        }
    }, [])

    return (
        <section ref={root} id="pipeline" className="relative overflow-hidden lg:h-screen">
            <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-[40vh] w-full bg-gradient-to-t from-accent/[0.07] to-transparent" />

            {/* Stage counter (desktop) */}
            <div className="pointer-events-none absolute top-24 right-10 z-10 hidden items-baseline gap-2 font-mono text-xs text-fg-subtle lg:flex">
                <span ref={counter} className="font-display text-4xl font-semibold tracking-tight text-fg tabular-nums">01</span>
                <span>/ {String(PIPELINE.length).padStart(2, "0")}</span>
            </div>

            <div
                ref={track}
                className="relative flex flex-col gap-16 px-5 py-24 sm:px-10 lg:h-full lg:w-max lg:flex-row lg:items-start lg:gap-[7vw] lg:px-[6vw] lg:py-0 lg:pt-[17vh]"
            >
                {/* Desktop pipe */}
                <svg ref={svg} className="pointer-events-none absolute top-0 left-0 hidden overflow-visible lg:block" aria-hidden>
                    <defs>
                        <filter id="pp-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <linearGradient id="pp-grad" x1="0" x2="1">
                            <stop offset="0" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.2 }} />
                            <stop offset="1" style={{ stopColor: "var(--color-accent-2)" }} />
                        </linearGradient>
                    </defs>
                    <path ref={pipe} fill="none" stroke="url(#pp-grad)" strokeWidth="3" strokeLinecap="round" filter="url(#pp-glow)" />
                    {PIPELINE.map(s => (
                        <line key={s.key} className="pp-stub stroke-ink/15 transition-colors duration-500 data-[active=true]:stroke-accent/70" strokeWidth="1" strokeDasharray="3 5" />
                    ))}
                    {PIPELINE.map(s => (
                        <circle key={s.key} r="7" className="pp-node fill-bg stroke-ink/25 transition-all duration-500 data-[active=true]:fill-accent data-[active=true]:stroke-bg" strokeWidth="2" />
                    ))}
                    {Array.from({ length: PACKETS }).map((_, i) => (
                        <circle key={i} r="4" className="pp-packet fill-glow" filter="url(#pp-glow)" opacity="0" />
                    ))}
                </svg>

                {/* Mobile pipe */}
                <div aria-hidden className="absolute top-40 bottom-24 left-5 w-px bg-line sm:left-10 lg:hidden">
                    <div className="pp-vline h-full w-full origin-top bg-accent shadow-[0_0_12px_rgba(74,128,255,0.8)]" />
                </div>

                {/* Intro panel */}
                <div className="relative shrink-0 lg:w-[34vw] lg:pt-[6vh]">
                    <Eyebrow index="02">The pipeline</Eyebrow>
                    <h2 className="mt-6 text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
                        How a member{" "}
                        <span className="font-serif font-normal italic tracking-normal text-accent">grows.</span>
                    </h2>
                    <p className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted">
                        Five stages, one pipeline. Most of us walked in knowing nothing and walked out running things.
                    </p>
                </div>

                {PIPELINE.map((s, i) => (
                    <article
                        key={s.key}
                        data-active="false"
                        className="pp-card group relative shrink-0 pl-8 sm:pl-10 lg:w-[clamp(320px,27vw,440px)] lg:pl-0"
                    >
                        <span aria-hidden className="absolute top-2 left-[-3px] h-[7px] w-[7px] rounded-full bg-accent sm:left-[-3px] lg:hidden" />
                        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface lg:h-[50vh]">
                            <img
                                src={s.img}
                                alt=""
                                loading="lazy"
                                className="aspect-[4/3] h-full w-full scale-110 object-cover opacity-50 grayscale transition-all duration-[1400ms] ease-out group-data-[active=true]:scale-100 group-data-[active=true]:opacity-90 group-data-[active=true]:grayscale-0 lg:aspect-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
                            <span className="text-outline-strong absolute -bottom-4 left-4 font-display text-[7rem] leading-none font-bold tracking-[-0.06em] transition-colors duration-700 group-data-[active=true]:text-ink/10 sm:text-[9rem]">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <div className="mt-5 flex items-baseline justify-between">
                            <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h3>
                            <span className="font-mono text-xs text-fg-subtle transition-colors group-data-[active=true]:text-accent">
                                stage {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">{s.desc}</p>
                    </article>
                ))}

                {/* Tail so the last stage can reach the centre */}
                <div aria-hidden className="hidden shrink-0 lg:block lg:w-[18vw]" />
            </div>
        </section>
    )
}
