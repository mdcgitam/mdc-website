import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Magnetic, SplitReveal } from "../fx/effects"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { ArrowRight } from "../ui/Icons"
import { onIntro } from "../../lib/intro"
import PhotoWall from "./PhotoWall"

export default function Hero() {
    const root = useRef(null)

    useLayoutEffect(() => {
        if (prefersReducedMotion()) return
        const ctx = gsap.context(() => {
            gsap.set(".hero-fade", { opacity: 0, y: 14 })
            gsap.set(".hero-rule", { scaleX: 0 })
            gsap.set(".hero-ch", { yPercent: 105 })
            gsap.set(".hero-hint", { opacity: 0 })
        }, root)
        const off = onIntro(() => {
            ctx.add(() => {
                gsap.to(".hero-ch", { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, delay: 0.35 })
                gsap.to(".hero-hint", { opacity: 1, duration: 0.8, delay: 1.4 })
                gsap.to(".hero-rule", { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: 0.2 })
                gsap.to(".hero-fade", { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.7 })
            })
        })
        return () => { off(); ctx.revert() }
    }, [])

    return (
        <section ref={root} className="relative h-[100svh] min-h-[680px] overflow-hidden">
            <PhotoWall />

            {/* Fade the wall into the page behind the navbar and the headline */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-bg from-[46%] via-bg/85 to-transparent" />

            {/* Giant translucent wordmark: the photos show through it, colours untouched */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[20%] flex flex-col items-center text-fg/70 sm:top-[16%]">
                <div className="flex overflow-hidden pb-[0.04em]">
                    {"MDC".split("").map(ch => (
                        <span key={ch} className="hero-ch inline-block font-display text-[clamp(8.5rem,40vw,27rem)] leading-[0.82] font-bold tracking-[-0.06em]">
                            {ch}
                        </span>
                    ))}
                </div>
                <p className="hero-hint mt-5 font-mono text-[10px] uppercase tracking-[0.3em] sm:mt-7 sm:text-[11px]">
                    ← Drag through our events →
                </p>
            </div>

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-10 sm:pb-10">
                <div className="hero-rule mb-6 h-px origin-left bg-line-strong sm:mb-8" />
                <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
                    <h1 className="text-[clamp(2.4rem,6.2vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                        <SplitReveal trigger="intro" delay={0.35} text="GITAM's home for" className="block" />
                        <SplitReveal trigger="intro" delay={0.5} text="people who *build.*" className="block" />
                    </h1>
                    <div className="lg:justify-self-end lg:max-w-sm">
                        <p className="hero-fade text-sm leading-relaxed text-fg-muted sm:text-base">
                            A student-run developer community. Contests, hackathons, workshops and talks across seven domains,
                            all planned and hosted by students since 2023.
                        </p>
                        <div className="hero-fade mt-6 flex flex-wrap items-center gap-3">
                            <Magnetic>
                                <Link to="/contact#apply" className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-bg">
                                    Join MDC <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link to="/events" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-medium text-fg backdrop-blur hover:bg-ink/5">
                                    See our events
                                </Link>
                            </Magnetic>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
