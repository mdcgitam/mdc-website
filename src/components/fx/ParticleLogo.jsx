import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/smooth"
import { onIntro } from "../../lib/intro"

// ── Sample the "MDC" wordmark into normalised points (-0.5..0.5 wide) ──────
async function sampleWordmark(maxPoints) {
    try { await document.fonts.load('700 300px "Inter Tight"') } catch { /* fall back to system font */ }
    const W = 1400
    const H = 520
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const ctx = c.getContext("2d", { willReadFrequently: true })
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = '700 470px "Inter Tight", "Inter", system-ui, sans-serif'
    ctx.letterSpacing = "-24px"
    ctx.fillText("MDC", W / 2, H / 2 + 20)
    const data = ctx.getImageData(0, 0, W, H).data

    const filled = []
    for (let y = 0; y < H; y += 3) {
        for (let x = 0; x < W; x += 3) {
            if (data[(y * W + x) * 4 + 3] > 140) filled.push([x, y])
        }
    }
    // Evenly thin to the particle budget.
    const step = Math.max(1, filled.length / maxPoints)
    const pts = []
    for (let i = 0; i < filled.length; i += step) {
        const [x, y] = filled[Math.floor(i)]
        pts.push((x - W / 2) / W, -(y - H / 2) / W)
    }
    return new Float32Array(pts)
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uScatter;
  uniform float uScale;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  attribute vec2 aTarget;
  attribute vec3 aRandom;
  attribute float aSeed;
  varying float vHeat;
  varying float vAlpha;
  varying float vSeed;

  float easeOutExpo(float t) { return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t); }

  void main() {
    vec3 target = vec3(aTarget * uScale, 0.0);
    vec3 start = aRandom * vec3(uScale * 1.4, uScale * 0.9, 400.0);

    // Staggered assembly: each particle arrives on its own schedule.
    float t = clamp(uProgress * 1.6 - aSeed * 0.6, 0.0, 1.0);
    vec3 pos = mix(start, target, easeOutExpo(t));

    // Breathing drift so the logo never sits dead still.
    pos.x += sin(uTime * 0.7 + aSeed * 40.0) * 1.6;
    pos.y += cos(uTime * 0.6 + aSeed * 31.0) * 1.6;

    // Pointer repulsion.
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float radius = uScale * 0.11;
    float force = smoothstep(radius, 0.0, dist) * uMouseStrength;
    // Push varies per particle so the hole has a ragged, organic edge.
    pos.xy += normalize(d + 0.0001) * force * radius * (0.35 + aSeed * 0.6);
    pos.z += force * 120.0 * aSeed;
    vHeat = force;

    // Scroll explosion: particles fly outward and toward the viewer.
    float s = uScatter * uScatter;
    pos.xy += normalize(aTarget + aRandom.xy * 0.3 + 0.0001) * s * uScale * (0.6 + aSeed * 1.8);
    pos.z += s * (200.0 + aSeed * 900.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (1.2 + aSeed * 2.4) * uPixelRatio * (uScale / 900.0 + 0.45);
    gl_PointSize = size * (1.0 + force * 1.5) * (600.0 / -mv.z);
    vAlpha = (0.35 + 0.65 * t) * (1.0 - uScatter * 0.85);
    vSeed = aSeed;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vHeat;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    // Mostly white, with a sprinkle of accent particles and a hot zone under the pointer.
    vec3 col = mix(uColorA, uColorB, clamp(vHeat * 1.4 + step(0.88, vSeed), 0.0, 1.0));
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`

export default function ParticleLogo({ className = "" }) {
    const mount = useRef(null)

    useEffect(() => {
        const host = mount.current
        if (!host) return
        const reduced = prefersReducedMotion()
        let disposed = false
        let cleanup = () => { }

        ;(async () => {
            const isSmall = window.innerWidth < 768
            const targets = await sampleWordmark(isSmall ? 5000 : 11000)
            if (disposed) return
            const count = targets.length / 2

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            host.appendChild(renderer.domElement)
            renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;"

            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(50, 1, 1, 5000)

            const random = new Float32Array(count * 3)
            const seeds = new Float32Array(count)
            for (let i = 0; i < count; i++) {
                const a = Math.random() * Math.PI * 2
                const r = 0.4 + Math.random() * 0.8
                random[i * 3] = Math.cos(a) * r
                random[i * 3 + 1] = Math.sin(a) * r
                random[i * 3 + 2] = Math.random() * 2 - 1
                seeds[i] = Math.random()
            }
            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3))
            geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 2))
            geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 3))
            geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))

            const uniforms = {
                uTime: { value: 0 },
                uProgress: { value: reduced ? 1 : 0 },
                uScatter: { value: 0 },
                uScale: { value: 900 },
                uPixelRatio: { value: renderer.getPixelRatio() },
                uMouse: { value: new THREE.Vector2(9999, 9999) },
                uMouseStrength: { value: 0 },
                uColorA: { value: new THREE.Color("#eceef1") },
                uColorB: { value: new THREE.Color("#4a80ff") },
            }
            const material = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            })
            const points = new THREE.Points(geometry, material)
            points.frustumCulled = false
            scene.add(points)

            // Size the scene in CSS pixels so pointer maths is 1:1.
            const resize = () => {
                const w = host.clientWidth
                const h = host.clientHeight
                renderer.setSize(w, h, false)
                camera.aspect = w / h
                camera.position.z = (h / 2) / Math.tan((camera.fov * Math.PI) / 360)
                camera.updateProjectionMatrix()
                uniforms.uScale.value = Math.min(w * (w < 768 ? 0.92 : 0.78), 1250)
            }
            resize()
            const ro = new ResizeObserver(resize)
            ro.observe(host)

            // Pointer, smoothed.
            const mouse = new THREE.Vector2(9999, 9999)
            let strength = 0
            // Listen on window: text layers sit above the canvas, so bounds decide "inside".
            const onMove = (e) => {
                const r = host.getBoundingClientRect()
                mouse.set(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2))
                strength = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0
            }
            const onLeave = () => { strength = 0 }
            if (!reduced) {
                window.addEventListener("pointermove", onMove, { passive: true })
                document.addEventListener("pointerleave", onLeave)
            }

            // Assemble once the preloader lifts.
            const offIntro = onIntro(() => {
                if (!reduced) gsap.to(uniforms.uProgress, { value: 1, duration: 3.2, ease: "power2.out" })
            })

            // Scroll: blow the logo apart as the hero leaves.
            const st = reduced ? null : ScrollTrigger.create({
                trigger: host,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
                onUpdate: (self) => { uniforms.uScatter.value = self.progress },
            })

            // Only render while on screen.
            let visible = true
            const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
            io.observe(host)

            const clock = new THREE.Timer()
            const render = () => {
                if (!visible) return
                clock.update()
                uniforms.uTime.value = clock.getElapsed()
                uniforms.uMouse.value.lerp(mouse, 0.12)
                uniforms.uMouseStrength.value += (strength - uniforms.uMouseStrength.value) * 0.06
                renderer.render(scene, camera)
            }
            if (reduced) renderer.render(scene, camera)
            else gsap.ticker.add(render)

            cleanup = () => {
                gsap.ticker.remove(render)
                offIntro()
                st?.kill()
                io.disconnect()
                ro.disconnect()
                window.removeEventListener("pointermove", onMove)
                document.removeEventListener("pointerleave", onLeave)
                geometry.dispose()
                material.dispose()
                renderer.dispose()
                renderer.domElement.remove()
            }
        })()

        return () => {
            disposed = true
            cleanup()
        }
    }, [])

    return <div ref={mount} className={`absolute inset-0 ${className}`} aria-hidden />
}
