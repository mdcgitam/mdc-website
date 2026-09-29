import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "./Icons"
import { SplitReveal } from "../fx/effects"

export function Container({ className = "", children, ...rest }) {
    return (
        <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`} {...rest}>
            {children}
        </div>
    )
}

// Mono "section label" used above every heading, e.g. "02 / Domains".
export function Eyebrow({ index, children, className = "" }) {
    return (
        <p className={`font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle ${className}`}>
            {index && <span className="text-accent">{index}</span>}
            {index && <span className="mx-2 text-fg-subtle/60">/</span>}
            {children}
        </p>
    )
}

export function SectionHeading({ index, eyebrow, title, lede, action, className = "" }) {
    return (
        <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
            <div className="max-w-2xl">
                <Eyebrow index={index}>{eyebrow}</Eyebrow>
                <h2 className="mt-4 text-3xl font-semibold leading-[1.05] text-fg sm:text-5xl">{title}</h2>
                {lede && <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">{lede}</p>}
            </div>
            {action}
        </div>
    )
}

// Fade-up on first scroll into view. Respects reduced motion via MotionConfig.
export function Reveal({ children, delay = 0, y = 16, className = "", as = "div" }) {
    const Comp = motion[as]
    return (
        <Comp
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] }}
            className={className}
        >
            {children}
        </Comp>
    )
}

const buttonStyles = {
    primary: "bg-fg text-bg hover:bg-fg/85",
    accent: "bg-accent text-white hover:bg-accent-strong",
    ghost: "border border-line-strong text-fg hover:bg-ink/5 hover:border-ink/25",
}

export function Button({ to, href, variant = "primary", arrow = false, className = "", children, ...rest }) {
    const cls = `group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles[variant]} ${className}`
    const inner = (
        <>
            {children}
            {arrow && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
        </>
    )
    if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>{inner}</a>
    return <button className={cls} {...rest}>{inner}</button>
}

export function Tag({ children, tone = "default", className = "" }) {
    const tones = {
        default: "border-line text-fg-muted",
        accent: "border-accent/30 bg-accent-soft text-accent",
    }
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${tones[tone]} ${className}`}>
            {children}
        </span>
    )
}

// Portrait with a local initials fallback (no third-party avatar service).
export function Avatar({ src, name, className = "", imgClassName = "" }) {
    const [failed, setFailed] = useState(!src)
    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase()
    return (
        <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
            {failed ? (
                <div className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-fg-subtle">
                    {initials}
                </div>
            ) : (
                <img
                    src={src}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    className={`h-full w-full object-cover object-top ${imgClassName}`}
                />
            )}
        </div>
    )
}

export function PageHeader({ eyebrow, title, lede, children }) {
    return (
        <header className="relative overflow-hidden border-b border-line pt-36 pb-14 sm:pt-48 sm:pb-24">
            <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[720px] rounded-full bg-accent/15 blur-[140px]" />
            <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden />
            <Container className="relative">
                <Eyebrow>{eyebrow}</Eyebrow>
                {/* `title` is a string; wrap words in *asterisks* for the accent serif. */}
                <SplitReveal
                    as="h1"
                    text={title}
                    stagger={0.05}
                    className="mt-6 block max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
                />
                <Reveal delay={0.3}>
                    {lede && <p className="mt-8 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{lede}</p>}
                    {children}
                </Reveal>
            </Container>
        </header>
    )
}
