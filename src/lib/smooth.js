import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)
// Refreshes start at the top (see index.html); stop ScrollTrigger from putting "auto" restoration back.
ScrollTrigger.clearScrollMemory("manual")

let lenis = null

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const isFinePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches

// Lenis drives scrolling; GSAP's ticker drives Lenis so ScrollTrigger and
// smooth scroll share one clock.
export function initSmoothScroll() {
    if (lenis || prefersReducedMotion()) return () => { }
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 })
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
        gsap.ticker.remove(tick)
        lenis?.destroy()
        lenis = null
    }
}

export const getLenis = () => lenis

// Current scroll velocity in px/frame (0 when Lenis is off).
export const scrollVelocity = () => lenis?.velocity || 0

export function scrollToTarget(target, { offset = -72, immediate = false } = {}) {
    if (lenis) {
        lenis.scrollTo(target, { offset, immediate, duration: 1.4 })
        return
    }
    if (typeof target === "number") window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" })
    else target?.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" })
}

// Modals and menus freeze the page underneath them.
let locks = 0
export function lockScroll(on) {
    locks = Math.max(0, locks + (on ? 1 : -1))
    const locked = locks > 0
    if (lenis) locked ? lenis.stop() : lenis.start()
    document.documentElement.style.overflow = locked ? "hidden" : ""
}

export { gsap, ScrollTrigger }
