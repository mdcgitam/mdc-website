import { useEffect, useLayoutEffect, useRef } from "react"
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion, scrollVelocity } from "../../lib/smooth"
import { onIntro } from "../../lib/intro"

// ── Magnetic: child drifts toward the pointer while hovered ────────────────
export function Magnetic({ children, strength = 0.35 }) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el || !isFinePointer() || prefersReducedMotion()) return
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" })
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" })
        const move = (e) => {
            const r = el.getBoundingClientRect()
            x((e.clientX - (r.left + r.width / 2)) * strength)
            y((e.clientY - (r.top + r.height / 2)) * strength)
        }
        const reset = () => { x(0); y(0) }
        el.addEventListener("pointermove", move)
        el.addEventListener("pointerleave", reset)
        return () => {
            el.removeEventListener("pointermove", move)
            el.removeEventListener("pointerleave", reset)
        }
    }, [strength])
    return <span ref={ref} className="inline-block will-change-transform">{children}</span>
}

// ── SplitReveal: words rise out of masks, on scroll or after the intro ─────
export function SplitReveal({ text, as: Tag = "span", className = "", wordClassName = "", trigger = "scroll", delay = 0, stagger = 0.06 }) {
    const ref = useRef(null)
    useLayoutEffect(() => {
        const el = ref.current
        if (!el || prefersReducedMotion()) return
        const words = el.querySelectorAll(".sr-word")
        gsap.set(words, { yPercent: 115, rotate: 4 })
        const play = () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger, delay })
        if (trigger === "intro") return onIntro(play)
        const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play })
        return () => st.kill()
    }, [text, trigger, delay, stagger])

    // `text` may contain "*word*" to render that word in the serif accent style.
    const parts = text.split(" ")
    return (
        <Tag ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
            {parts.map((w, i) => {
                const accent = w.startsWith("*") && w.endsWith("*")
                const word = accent ? w.slice(1, -1) : w
                return (
                    <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                        <span className={`sr-word inline-block will-change-transform ${accent ? "font-serif font-normal italic tracking-normal text-accent" : ""} ${wordClassName}`}>
                            {word}
                        </span>
                        {i < parts.length - 1 && " "}
                    </span>
                )
            })}
        </Tag>
    )
}

// ── VelocityMarquee: infinite band that speeds up and flips with scroll ────
export function VelocityMarquee({ children, baseSpeed = 60, reverse = false, className = "" }) {
    const track = useRef(null)
    useEffect(() => {
        const el = track.current
        if (!el) return
        if (prefersReducedMotion()) return
        let x = 0
        let dir = reverse ? 1 : -1
        const tick = (_, delta) => {
            const v = scrollVelocity()
            if (v > 0.5) dir = reverse ? 1 : -1
            else if (v < -0.5) dir = reverse ? -1 : 1
            const speed = baseSpeed + Math.min(Math.abs(v) * 40, 900)
            x += dir * speed * (delta / 1000)
            const half = el.scrollWidth / 2
            if (x <= -half) x += half
            if (x > 0) x -= half
            el.style.transform = `translate3d(${x}px,0,0) skewX(${gsap.utils.clamp(-8, 8, -v * 0.4)}deg)`
        }
        gsap.ticker.add(tick)
        return () => gsap.ticker.remove(tick)
    }, [baseSpeed, reverse])
    return (
        <div className={`overflow-hidden ${className}`}>
            <div ref={track} className="flex w-max will-change-transform">
                <div className="flex shrink-0 items-center">{children}</div>
                <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
            </div>
        </div>
    )
}

// ── CountUp: number rolls up when scrolled into view ───────────────────────
export function CountUp({ value, className = "", pad = 0 }) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el || typeof value !== "number") return
        const fmt = (n) => String(Math.round(n)).padStart(pad, "0")
        if (prefersReducedMotion()) { el.textContent = fmt(value); return }
        const o = { v: 0 }
        el.textContent = fmt(0)
        const st = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => gsap.to(o, { v: value, duration: 2.2, ease: "expo.out", onUpdate: () => { el.textContent = fmt(o.v) } }),
        })
        return () => st.kill()
    }, [value, pad])
    return <span ref={ref} className={className}>{typeof value === "number" ? value : value}</span>
}

// ── Tilt: 3D tilt toward the pointer with a moving glare ───────────────────
export function Tilt({ children, className = "", max = 10 }) {
    const ref = useRef(null)
    const glare = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el || !isFinePointer() || prefersReducedMotion()) return
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" })
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" })
        const move = (e) => {
            const r = el.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width
            const py = (e.clientY - r.top) / r.height
            ry((px - 0.5) * max * 2)
            rx((0.5 - py) * max * 2)
            if (glare.current) {
                glare.current.style.opacity = "1"
                glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.22), transparent 55%)`
            }
        }
        const reset = () => {
            rx(0); ry(0)
            if (glare.current) glare.current.style.opacity = "0"
        }
        el.addEventListener("pointermove", move)
        el.addEventListener("pointerleave", reset)
        return () => {
            el.removeEventListener("pointermove", move)
            el.removeEventListener("pointerleave", reset)
        }
    }, [max])
    return (
        <div style={{ perspective: 900 }} className={className}>
            <div ref={ref} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                {children}
                <div ref={glare} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300" />
            </div>
        </div>
    )
}

// ── Parallax: element drifts against the scroll ───────────────────────────
export function Parallax({ children, speed = 0.15, className = "" }) {
    const ref = useRef(null)
    useLayoutEffect(() => {
        const el = ref.current
        if (!el || prefersReducedMotion()) return
        const tween = gsap.fromTo(el, { yPercent: -speed * 100 }, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        })
        return () => { tween.scrollTrigger?.kill(); tween.kill() }
    }, [speed])
    return <div ref={ref} className={className}>{children}</div>
}
