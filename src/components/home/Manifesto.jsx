import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Container, Eyebrow } from "../ui/primitives"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { ArrowRight } from "../ui/Icons"

// Words marked with * render in the accent serif.
const TEXT =
    "In 2024 Meta shut Developer Circles down. *Ours* *didn't* stop. We rebuilt it as MDC, run by students, for students."

export default function Manifesto() {
    const root = useRef(null)

    // Scrubbed reveal: each word lights up as the paragraph scrolls through.
    useLayoutEffect(() => {
        if (prefersReducedMotion()) return
        const ctx = gsap.context(() => {
            gsap.fromTo(".mf-word", { opacity: 0.12 }, {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: ".mf-text", start: "top 80%", end: "bottom 45%", scrub: true },
            })
        }, root)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} className="py-24 sm:py-40">
            <Container>
                <Eyebrow index="01">Our story</Eyebrow>
                <p className="mf-text mt-8 font-display text-[clamp(1.9rem,4.6vw,4.25rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
                    {TEXT.split(" ").map((w, i) => {
                        const accent = w.startsWith("*")
                        return (
                            <span
                                key={i}
                                className={`mf-word ${accent ? "font-serif font-normal italic tracking-normal text-accent" : ""}`}
                            >
                                {accent ? w.replace(/\*/g, "") : w}{" "}
                            </span>
                        )
                    })}
                </p>
                <Link to="/about#history" className="group mt-12 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted hover:text-fg">
                    <span className="h-px w-10 bg-current transition-all group-hover:w-16" />
                    The full story
                    <ArrowRight size={14} />
                </Link>
            </Container>
        </section>
    )
}
