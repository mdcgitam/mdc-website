import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { SOCIALS } from "../../data/site"
import { TENURE_YEARS } from "../../data/tenureData"
import { ArrowRight, ArrowUpRight, Search } from "../ui/Icons"

import { OPEN_COMMAND_PALETTE } from "../../lib/commandPalette"
import { lockScroll } from "../../lib/smooth"
import { requestTheme } from "../../lib/theme"

const ITEMS = [
    { group: "Pages", label: "Home", to: "/" },
    { group: "Pages", label: "About MDC", to: "/about", hint: "story, mission, founders" },
    { group: "Pages", label: "Domains", to: "/domains" },
    { group: "Pages", label: "Events", to: "/events" },
    { group: "Pages", label: "Team", to: "/team" },
    { group: "Pages", label: "Contact", to: "/contact" },
    { group: "Actions", label: "Apply to join MDC", to: "/contact#apply" },
    { group: "Actions", label: "Switch theme", hint: "dark / light", action: () => requestTheme() },
    ...TENURE_YEARS.map(y => ({ group: "Team by year", label: `Team ${y}`, to: `/team?year=${y}` })),
    { group: "Elsewhere", label: "Instagram", href: SOCIALS.instagram },
    { group: "Elsewhere", label: "LinkedIn", href: SOCIALS.linkedin },
    { group: "Elsewhere", label: "GitHub", href: SOCIALS.github },
]

export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [active, setActive] = useState(0)
    const inputRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const show = () => {
            setQuery("")
            setActive(0)
            setOpen(true)
        }
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setQuery("")
                setActive(0)
                setOpen(o => !o)
            }
        }
        window.addEventListener("keydown", onKey)
        window.addEventListener(OPEN_COMMAND_PALETTE, show)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener(OPEN_COMMAND_PALETTE, show)
        }
    }, [])

    useEffect(() => {
        if (!open) return
        requestAnimationFrame(() => inputRef.current?.focus())
        lockScroll(true)
        return () => lockScroll(false)
    }, [open])

    const results = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? ITEMS.filter(i => `${i.label} ${i.hint || ""} ${i.group}`.toLowerCase().includes(q)) : ITEMS
    }, [query])

    const run = (item) => {
        setOpen(false)
        if (item.action) item.action()
        else if (item.href) window.open(item.href, "_blank", "noopener,noreferrer")
        else navigate(item.to)
    }

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
        if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
        if (e.key === "Enter" && results[active]) run(results[active])
        if (e.key === "Escape") setOpen(false)
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
                    onMouseDown={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        onMouseDown={e => e.stopPropagation()}
                        role="dialog"
                        aria-label="Command menu"
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/60"
                    >
                        <div className="flex items-center gap-3 border-b border-line px-4">
                            <Search size={16} className="text-fg-subtle" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => { setQuery(e.target.value); setActive(0) }}
                                onKeyDown={onKeyDown}
                                placeholder="Where to?"
                                className="h-14 flex-1 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none"
                                aria-label="Search pages"
                            />
                            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">esc</kbd>
                        </div>
                        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox" data-lenis-prevent>
                            {results.length === 0 && (
                                <li className="px-3 py-8 text-center text-sm text-fg-subtle">No matches for "{query}"</li>
                            )}
                            {results.map((item, i) => {
                                const header = item.group !== results[i - 1]?.group
                                return (
                                    <li key={item.label}>
                                        {header && (
                                            <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">{item.group}</p>
                                        )}
                                        <button
                                            role="option"
                                            aria-selected={i === active}
                                            onMouseMove={() => setActive(i)}
                                            onClick={() => run(item)}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${i === active ? "bg-ink/[0.06] text-fg" : "text-fg-muted"}`}
                                        >
                                            <span>
                                                {item.label}
                                                {item.hint && <span className="ml-2 text-fg-subtle">{item.hint}</span>}
                                            </span>
                                            {item.href ? <ArrowUpRight size={14} /> : <ArrowRight size={14} className={i === active ? "opacity-100" : "opacity-0"} />}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
