import { useLayoutEffect, useRef } from "react"
import { HISTORY } from "../../data/site"
import { Reveal } from "../ui/primitives"
import { gsap, prefersReducedMotion } from "../../lib/smooth"

// Club milestones on a single vertical rule, oldest first. A glowing line
// fills the rule as the list scrolls past.
export default function Timeline({ compact = false }) {
    const list = useRef(null)
    const fill = useRef(null)

    useLayoutEffect(() => {
        if (prefersReducedMotion() || !fill.current) return
        const tween = gsap.fromTo(fill.current, { scaleY: 0 }, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list.current, start: "top 70%", end: "bottom 60%", scrub: true },
        })
        return () => { tween.scrollTrigger?.kill(); tween.kill() }
    }, [])

    return (
        <ol ref={list} className="relative">
            <span
                ref={fill}
                aria-hidden
                className="absolute top-2 bottom-12 left-[7rem] w-px origin-top bg-accent shadow-[0_0_12px_rgba(74,128,255,0.9)] sm:left-[8.5rem]"
            />
            {HISTORY.map((m, i) => {
                const last = i === HISTORY.length - 1
                return (
                    <Reveal as="li" key={m.title} delay={i * 0.05} className="relative grid grid-cols-[5.5rem_1fr] gap-x-6 sm:grid-cols-[7rem_1fr]">
                        <p className={`pt-1 text-right font-mono text-xs ${m.turning ? "text-accent" : "text-fg-subtle"}`}>{m.date}</p>

                        <div className={`relative border-l pl-7 ${last ? "border-transparent pb-0" : "border-line-strong"} ${compact ? "pb-8" : "pb-10"}`}>
                            <span
                                aria-hidden
                                className={`absolute top-1.5 -left-[5px] h-[9px] w-[9px] rounded-full ${m.turning ? "bg-accent shadow-[0_0_0_5px_rgba(74,128,255,0.18)]" : last ? "bg-fg" : "border border-line-strong bg-bg"}`}
                            />
                            <h3 className={`font-display text-lg leading-snug font-semibold tracking-tight sm:text-xl ${m.turning ? "text-fg" : "text-fg/90"}`}>
                                {m.title}
                            </h3>
                            {!compact && <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-[15px]">{m.desc}</p>}
                            {m.turning && (
                                <p className="mt-3 inline-flex rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-accent">
                                    The turning point
                                </p>
                            )}
                        </div>
                    </Reveal>
                )
            })}
        </ol>
    )
}
