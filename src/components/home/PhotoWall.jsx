import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { gsap, prefersReducedMotion } from "../../lib/smooth"
import { WALL_PHOTOS } from "../../data/wall"

// An endless, draggable wall of real event photos. Tiles wrap around on both axes,
// the wall drifts by itself, and a drag flings it with inertia.
function layout() {
    const W = window.innerWidth
    const small = W < 640
    const tw = small ? 132 : W < 1100 ? 200 : 236
    const th = Math.round(tw * 1.28)
    const gap = small ? 10 : 16
    const sx = tw + gap
    const sy = th + gap
    const cols = Math.ceil(W / sx) + 2
    const rows = Math.ceil(window.innerHeight / sy) + 2
    return { small, tw, th, sx, sy, cols, rows }
}

export default function PhotoWall({ className = "" }) {
    const root = useRef(null)
    const [grid] = useState(layout)

    // Spread the photos so neighbours come from different events.
    const tiles = useMemo(() => {
        const n = WALL_PHOTOS.length
        const out = []
        for (let c = 0; c < grid.cols; c++)
            for (let r = 0; r < grid.rows; r++)
                out.push({ c, r, photo: WALL_PHOTOS[(c * 11 + r * 5) % n] })
        return out
    }, [grid])

    useLayoutEffect(() => {
        const el = root.current
        const nodes = Array.from(el.querySelectorAll(".pw-tile"))
        const reduced = prefersReducedMotion()
        const { sx, sy, cols, rows, small } = grid
        const totalW = cols * sx
        const totalH = rows * sy
        const wrap = (v, m) => ((v % m) + m) % m

        const s = { x: 0, y: 0, vx: 0, vy: 0, drift: reduced ? 0 : 1 }
        const DRIFT_X = -0.32
        const DRIFT_Y = small ? 0 : -0.16

        const place = () => {
            for (let i = 0; i < nodes.length; i++) {
                const t = tiles[i]
                const x = wrap(t.c * sx + s.x, totalW) - sx
                // odd columns sit half a tile lower for a staggered wall
                const y = wrap(t.r * sy + s.y + (t.c % 2) * sy * 0.5, totalH) - sy
                nodes[i].style.transform = `translate3d(${x}px, ${y}px, 0)`
            }
        }
        place()

        // Drag with inertia.
        let dragging = false
        let kick = null
        let lx = 0, ly = 0
        const down = (e) => {
            if (e.button !== undefined && e.button !== 0) return
            dragging = true
            lx = e.clientX; ly = e.clientY
            kick?.kill()
            s.vx = s.vy = 0
            el.classList.add("is-dragging")
            el.setPointerCapture?.(e.pointerId)
        }
        const move = (e) => {
            if (!dragging) return
            const dx = e.clientX - lx
            const dy = small ? 0 : e.clientY - ly // phones: sideways only, so the page still scrolls
            lx = e.clientX; ly = e.clientY
            s.x += dx; s.y += dy
            s.vx = dx; s.vy = dy
        }
        const up = () => {
            dragging = false
            el.classList.remove("is-dragging")
        }
        el.addEventListener("pointerdown", down)
        window.addEventListener("pointermove", move, { passive: true })
        window.addEventListener("pointerup", up)
        window.addEventListener("pointercancel", up)

        let visible = true
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
        io.observe(el)

        const tick = (_, dt) => {
            if (!visible) return
            const k = Math.min(dt / 16.67, 3)
            if (!dragging) {
                s.x += (s.vx + DRIFT_X * s.drift) * k
                s.y += (s.vy + DRIFT_Y * s.drift) * k
                s.vx *= Math.pow(0.94, k)
                s.vy *= Math.pow(0.94, k)
            }
            place()
        }
        gsap.ticker.add(tick)

        const ctx = gsap.context(() => {
            if (reduced) return
            // Tiles bloom outward from the centre on load.
            const cx = window.innerWidth / 2, cy = window.innerHeight / 2
            const imgs = nodes.map(n => n.firstElementChild)
            const dist = nodes.map(n => {
                const b = n.getBoundingClientRect()
                return Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy)
            })
            const max = Math.max(...dist)
            gsap.fromTo(imgs, { opacity: 0, scale: 0.6 }, {
                opacity: 1, scale: 1, duration: 1.1, ease: "expo.out",
                delay: (i) => 0.1 + (dist[i] / max) * 0.7,
            })
            kick = gsap.fromTo(s, { vx: 26, vy: small ? 0 : 10 }, { vx: 0, vy: 0, duration: 2.2, ease: "power3.out" })
        }, el)

        return () => {
            gsap.ticker.remove(tick)
            io.disconnect()
            el.removeEventListener("pointerdown", down)
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            window.removeEventListener("pointercancel", up)
            ctx.revert()
        }
    }, [grid, tiles])

    return (
        <div
            ref={root}
            className={`pw absolute inset-0 cursor-grab select-none overflow-hidden [&.is-dragging]:cursor-grabbing ${className}`}
            style={{ touchAction: grid.small ? "pan-y" : "none" }}
            aria-hidden
        >
            {tiles.map(({ c, r, photo }) => (
                <figure
                    key={`${c}-${r}`}
                    className="pw-tile group absolute top-0 left-0 m-0 will-change-transform"
                    style={{ width: grid.tw, height: grid.th }}
                >
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-surface-2 sm:rounded-xl">
                        <img
                            src={photo.src}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover opacity-60 grayscale contrast-[0.92] transition-[filter,transform,opacity] duration-700 group-hover:scale-[1.06] group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100"
                        />
                        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 to-transparent px-3 pt-8 pb-2.5 font-mono text-[9px] uppercase leading-snug tracking-[0.18em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-[10px]">
                            {photo.event}
                            <span className="block text-white/60">{photo.year}</span>
                        </figcaption>
                    </div>
                </figure>
            ))}
        </div>
    )
}
