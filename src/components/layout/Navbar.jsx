import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Logo from "./Logo"
import { NAV, SOCIALS } from "../../data/site"
import { Close, Menu, Search, Instagram, LinkedIn, Sun, Moon } from "../ui/Icons"
import { requestTheme, useTheme } from "../../lib/theme"
import { openCommandPalette } from "../../lib/commandPalette"
import { lockScroll } from "../../lib/smooth"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const theme = useTheme()
    // The mobile menu belongs to the location it was opened on, so any navigation closes it.
    const [openOn, setOpenOn] = useState(null)
    const open = openOn === location.key
    const toggle = () => setOpenOn(open ? null : location.key)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (!open) return
        lockScroll(true)
        return () => lockScroll(false)
    }, [open])

    const isActive = (to) => to.startsWith("/#")
        ? location.pathname === "/" && location.hash === to.slice(1)
        : location.pathname === to || (to === "/team" && location.pathname === "/tenure")

    return (
        <>
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${scrolled || open
                ? "border-b border-line bg-bg/80 backdrop-blur-xl"
                : "border-b border-transparent"
                }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <Logo />

                <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                    {NAV.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`rounded-full px-3.5 py-2 text-sm transition-colors ${isActive(item.to) ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => requestTheme()}
                        aria-label={theme === "classic" ? "Switch to night theme" : "Switch to classic theme"}
                        title={theme === "classic" ? "Night theme" : "Classic theme"}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                        {theme === "classic" ? <Moon size={15} /> : <Sun size={15} />}
                    </button>
                    <button
                        onClick={openCommandPalette}
                        className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-xs text-fg-subtle transition-colors hover:border-line-strong hover:text-fg-muted sm:flex"
                        aria-label="Open command menu"
                    >
                        <Search size={14} />
                        <span>Search</span>
                        <kbd className="rounded border border-line px-1.5 font-mono text-[10px]">⌘K</kbd>
                    </button>
                    <Link
                        to="/contact#apply"
                        className="hidden h-9 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-fg/85 md:inline-flex"
                    >
                        Join MDC
                    </Link>
                    <button
                        onClick={toggle}
                        className="-mr-2 flex h-10 w-10 items-center justify-center text-fg md:hidden"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? <Close size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
        </header>

            {/* Rendered outside <header>: its backdrop-filter would otherwise become
                the containing block for this fixed overlay. */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        data-lenis-prevent
                        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-bg md:hidden"
                    >
                        <nav className="flex flex-col px-5 pt-6" aria-label="Mobile">
                            {[{ label: "Home", to: "/" }, ...NAV].map((item, i) => (
                                <motion.div
                                    key={item.to}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.04 * i }}
                                >
                                    <Link
                                        to={item.to}
                                        className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold tracking-tight"
                                    >
                                        {item.label}
                                        <span className="font-mono text-xs text-fg-subtle">0{i}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            <Link
                                to="/contact#apply"
                                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-fg text-base font-medium text-bg"
                            >
                                Join MDC
                            </Link>
                            <div className="mt-8 flex gap-5 text-fg-muted">
                                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={22} /></a>
                                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedIn size={22} /></a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
