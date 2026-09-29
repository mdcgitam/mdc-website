import { useSyncExternalStore } from "react"

// "classic" (default, the light palette) or "night" (dark).
// index.html applies the saved choice before first paint to avoid a flash.
const KEY = "mdc-theme"
const EVENT = "mdc:theme"
const THEME_COLORS = { night: "#07080a", classic: "#f9fafb" }

export const getTheme = () =>
    document.documentElement.dataset.theme === "classic" ? "classic" : "night"

export function setTheme(theme) {
    const root = document.documentElement
    if (theme === "classic") root.dataset.theme = "classic"
    else delete root.dataset.theme
    try { localStorage.setItem(KEY, theme) } catch { /* storage unavailable */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme])
    window.dispatchEvent(new Event(EVENT))
}

export const toggleTheme = () => setTheme(getTheme() === "classic" ? "night" : "classic")

// Theme switches from the UI go through the ThemeShow overlay (a little performance first).
// If nothing is listening, switch straight away.
export const THEME_REQUEST = "mdc:theme-request"
export function requestTheme(theme = getTheme() === "classic" ? "night" : "classic") {
    const e = new CustomEvent(THEME_REQUEST, { detail: theme, cancelable: true })
    if (window.dispatchEvent(e)) setTheme(theme)
}

function subscribe(cb) {
    window.addEventListener(EVENT, cb)
    return () => window.removeEventListener(EVENT, cb)
}

export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => "classic")
