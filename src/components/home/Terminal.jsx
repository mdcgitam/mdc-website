import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DOMAINS, CURRENT_BOARD, HISTORY, SOCIALS, FOUNDED } from "../../data/site"
import { useEvents, formatDate, domainLabel } from "../../lib/events"

const PAGES = { about: "/about", domains: "/domains", events: "/events", team: "/team", contact: "/contact", join: "/contact#apply", home: "/" }
const COMMANDS = ["help", "whoami", "ls", "cd", "events", "domains", "team", "history", "join", "socials", "clear"]

const out = (text, tone = "out") => ({ text, tone })

function useCommands(events) {
    const navigate = useNavigate()

    const go = (path, label) => {
        setTimeout(() => navigate(path), 450)
        return [out(`→ opening ${label}…`, "ok")]
    }

    return (raw) => {
        const said = raw.trim().toLowerCase().replace(/\s+/g, " ")
        if (said === "modda gudu") return [out("nv velli tanuj gadi modda gudu", "warn")]
        if (said === "dengey") {
            // Browsers only let scripts close tabs they opened, so fall back to leaving the site.
            setTimeout(() => {
                window.close()
                setTimeout(() => window.location.replace("about:blank"), 150)
            }, 700)
            return [out("sare ra. closing…", "err")]
        }
        const [cmd, ...args] = raw.trim().split(/\s+/)
        const arg = (args[0] || "").replace(/\/$/, "").toLowerCase()

        switch ((cmd || "").toLowerCase()) {
            case "":
                return []
            case "help":
                return [
                    out("available commands:", "muted"),
                    ...[
                        ["whoami", "what is MDC"],
                        ["events", "latest events"],
                        ["domains", "our seven domains"],
                        ["team", "current executive board"],
                        ["history", "how we got here"],
                        ["ls / cd <page>", "browse the site"],
                        ["join", "apply to MDC"],
                        ["clear", "clear the screen"],
                    ].map(([c, d]) => out(`  ${c.padEnd(16)}${d}`)),
                ]
            case "whoami":
                return [
                    out("Meta Developer Communities (MDC)"),
                    out(`student-run developer community · GITAM · est. ${FOUNDED}`, "muted"),
                ]
            case "ls":
                return [out(Object.keys(PAGES).filter(p => p !== "home").map(p => `${p}/`).join("  "), "accent")]
            case "cd":
            case "open":
                if (!arg || arg === "~") return go("/", "home")
                if (PAGES[arg]) return go(PAGES[arg], arg)
                return [out(`cd: no such page: ${args[0]}`, "err")]
            case "events": {
                if (!events.length) return [out("fetching events… try again in a second", "muted")]
                return [
                    ...events.slice(0, 4).map(e =>
                        out(`  ${formatDate(e.dateObj, { day: "2-digit", month: "short", year: "2-digit" }).padEnd(11)}${e.title}  · ${domainLabel(e)}`)
                    ),
                    out(`${events.length} events logged. run \`cd events\` for all.`, "muted"),
                ]
            }
            case "domains":
                return DOMAINS.map((d, i) => out(`  ${String(i + 1).padStart(2, "0")}  ${d.name.padEnd(24)}${d.focus}`))
            case "team":
                return [
                    ...CURRENT_BOARD.map(m => out(`  ${m.role.padEnd(20)}${m.name}`)),
                    out("run `cd team` to meet everyone.", "muted"),
                ]
            case "history":
            case "story":
                return HISTORY.map(h => out(`  ${h.date.padEnd(10)}${h.title}`, h.turning ? "accent" : "out"))
            case "join":
            case "apply":
                return go("/contact#apply", "application form")
            case "socials":
                return [out(`  instagram  ${SOCIALS.instagram}`), out(`  linkedin   ${SOCIALS.linkedin}`)]
            case "sudo":
                return [out("nice try. permission comes with membership. run `join`.", "warn")]
            case "rm":
                return [out("we don't delete history here. run `history`.", "warn")]
            default:
                return [out(`command not found: ${cmd}. try \`help\``, "err")]
        }
    }
}

const toneClass = {
    out: "text-fg/90",
    muted: "text-fg-subtle",
    ok: "text-ok",
    err: "text-err",
    warn: "text-warn",
    accent: "text-accent",
}

const BOOT = "whoami"

export default function Terminal() {
    const { events } = useEvents()
    const exec = useCommands(events)
    const [lines, setLines] = useState([])
    const [input, setInput] = useState("")
    const [booted, setBooted] = useState(false)
    const [typed, setTyped] = useState("")
    const [history, setHistory] = useState([])
    const [hIndex, setHIndex] = useState(-1)
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    // Type the boot command, then run it.
    useEffect(() => {
        let timer
        let i = 0
        const finish = () => {
            setLines([
                { cmd: BOOT },
                ...exec(BOOT),
                out(""),
                out("type `help` to see what this terminal can do.", "muted"),
            ])
            setTyped("")
            setBooted(true)
        }
        const tick = () => {
            i++
            setTyped(BOOT.slice(0, i))
            timer = i < BOOT.length ? setTimeout(tick, 70) : setTimeout(finish, 250)
        }
        timer = setTimeout(tick, 700)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [lines])

    const submit = (e) => {
        e.preventDefault()
        const value = input.trim()
        if (value.toLowerCase() === "clear") {
            setLines([])
        } else {
            setLines(ls => [...ls, { cmd: input }, ...exec(value)])
        }
        if (value) setHistory(h => [value, ...h].slice(0, 30))
        setHIndex(-1)
        setInput("")
    }

    const onKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault()
            const next = Math.min(hIndex + 1, history.length - 1)
            if (history[next] !== undefined) { setHIndex(next); setInput(history[next]) }
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            const next = hIndex - 1
            setHIndex(Math.max(next, -1))
            setInput(next >= 0 ? history[next] : "")
        } else if (e.key === "Tab") {
            e.preventDefault()
            const [c, a] = input.split(/\s+/)
            if (a !== undefined) {
                const match = Object.keys(PAGES).find(p => p.startsWith(a.toLowerCase()))
                if (match) setInput(`${c} ${match}`)
            } else {
                const match = COMMANDS.find(x => x.startsWith(input.toLowerCase()))
                if (match && input) setInput(match)
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault()
            setLines([])
        }
    }

    const Prompt = () => (
        <span className="select-none">
            <span className="text-ok">mdc@gitam</span>
            <span className="text-fg-subtle">:</span>
            <span className="text-accent">~</span>
            <span className="text-fg-subtle">$ </span>
        </span>
    )

    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface/95 shadow-[0_30px_120px_-20px_rgba(74,128,255,0.25)] backdrop-blur"
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                </div>
                <p className="font-mono text-[11px] text-fg-subtle">mdc@gitam — zsh</p>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-fg-subtle">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" /> live
                </span>
            </div>

            <div
                ref={scrollRef}
                data-lenis-prevent
                className="h-[300px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-[1.7] sm:h-[340px] sm:text-[13px]"
                aria-live="polite"
            >
                {lines.map((l, i) =>
                    "cmd" in l ? (
                        <div key={i} className="whitespace-pre-wrap break-words"><Prompt /><span className="text-fg">{l.cmd}</span></div>
                    ) : (
                        <div key={i} className={`min-h-[1.7em] whitespace-pre-wrap break-words ${toneClass[l.tone]}`}>{l.text}</div>
                    )
                )}

                {booted ? (
                    <form onSubmit={submit} className="flex">
                        <Prompt />
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            spellCheck={false}
                            autoCapitalize="off"
                            autoComplete="off"
                            aria-label="Terminal input. Type help for commands."
                            className="min-w-0 flex-1 bg-transparent text-fg caret-accent focus:outline-none"
                        />
                    </form>
                ) : (
                    <div><Prompt /><span className="text-fg">{typed}</span><span className="animate-blink ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-fg/80" /></div>
                )}
            </div>

            {booted && (
                <div className="flex gap-2 overflow-x-auto border-t border-line px-3 py-2.5 scrollbar-none">
                    {["help", "events", "domains", "team", "cd about"].map(c => (
                        <button
                            key={c}
                            onClick={(e) => {
                                e.stopPropagation()
                                setLines(ls => [...ls, { cmd: c }, ...exec(c)])
                            }}
                            className="shrink-0 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
