import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { initSmoothScroll, scrollToTarget, ScrollTrigger } from "../../lib/smooth"

// Owns smooth scrolling: jump to top on route change, or glide to the #hash target.
export default function ScrollManager() {
    const { pathname, hash } = useLocation()

    useEffect(() => initSmoothScroll(), [])

    useEffect(() => {
        let raf
        if (!hash) {
            scrollToTarget(0, { immediate: true, offset: 0 })
        } else {
            // Wait a frame so the target section has mounted.
            raf = requestAnimationFrame(() => {
                const el = document.getElementById(hash.slice(1))
                if (el) scrollToTarget(el)
            })
        }
        // New page, new layout: recompute every scroll-driven animation once images settle.
        const t = setTimeout(() => ScrollTrigger.refresh(), 400)
        return () => {
            cancelAnimationFrame(raf)
            clearTimeout(t)
        }
    }, [pathname, hash])

    return null
}
