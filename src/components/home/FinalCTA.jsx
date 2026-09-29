import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Magnetic } from "../fx/effects"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { SOCIALS } from "../../data/site"

// Giant type that scales up and a circular glow that expands as you arrive.
export default function FinalCTA() {
    const root = useRef(null)

    useLayoutEffect(() => {
        if (prefersReducedMotion()) return
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 1 },
            })
            tl.fromTo(".cta-line-1", { xPercent: -30 }, { xPercent: 0, ease: "none" }, 0)
                .fromTo(".cta-line-2", { xPercent: 30 }, { xPercent: 0, ease: "none" }, 0)
                .fromTo(".cta-orb", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, ease: "none" }, 0)
        }, root)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-24">
            <div aria-hidden className="cta-orb pointer-events-none absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,128,255,0.45),rgba(74,128,255,0.08)_45%,transparent_70%)] blur-2xl" />
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_65%)]" />

            <p className="relative font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">Your move</p>
            <h2 className="relative mt-8 w-full text-center font-display leading-[0.82] font-bold tracking-[-0.06em]">
                <span className="cta-line-1 block text-[20vw] sm:text-[16vw]">Build</span>
                <span className="cta-line-2 block font-serif text-[20vw] font-normal tracking-[-0.03em] text-accent italic sm:text-[16vw]">with us.</span>
            </h2>

            <div className="relative mt-12 flex flex-col items-center gap-6 sm:flex-row">
                <Magnetic strength={0.5}>
                    <Link
                        to="/contact#apply"
                        className="flex h-36 w-36 items-center justify-center rounded-full bg-fg text-center text-base font-semibold text-bg transition-colors hover:bg-accent hover:text-white sm:h-44 sm:w-44 sm:text-lg"
                    >
                        Apply to<br />MDC
                    </Link>
                </Magnetic>
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted hover:text-fg">
                    or follow @mdc_gitam ↗
                </a>
            </div>
        </section>
    )
}
