import { lazy, Suspense, useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Magnetic, SplitReveal } from "../fx/effects"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { ArrowRight } from "../ui/Icons"
import { onIntro } from "../../lib/intro"

// three.js is heavy; load it after first paint.
const ParticleLogo = lazy(() => import("../fx/ParticleLogo"))

export default function Hero() {
    const root = useRef(null)

    useLayoutEffect(() => {
        if (prefersReducedMotion()) return
        const ctx = gsap.context(() => {
            gsap.set(".hero-fade", { opacity: 0, y: 14 })
            gsap.set(".hero-rule", { scaleX: 0 })
        }, root)
        const off = onIntro(() => {
            ctx.add(() => {
                gsap.to(".hero-rule", { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: 0.2 })
                gsap.to(".hero-fade", { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.7 })
            })
        })
        return () => { off(); ctx.revert() }
    }, [])

    return (
        <section ref={root} className="relative h-[100svh] min-h-[680px] overflow-hidden">
            {/* Ambient light behind the particles */}
            <div aria-hidden className="pointer-events-none absolute top-[38%] left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.13] blur-[140px]" />
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent)]" />

            <Suspense fallback={null}>
                <ParticleLogo className="bottom-[26%] md:bottom-[18%]" />
            </Suspense>

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
