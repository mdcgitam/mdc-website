import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Container, PageHeader, Reveal } from "../components/ui/primitives"
import EventCard from "../components/events/EventCard"
import EventModal from "../components/events/EventModal"
import { useEvents, partnerOf } from "../lib/events"

const DOMAIN_FILTERS = [
    { key: "all", label: "All" },
    { key: "CP", label: "Competitive Programming" },
    { key: "WebArcs", label: "WebArc" },
    { key: "DataVerse", label: "DataVerse" },
    { key: "EB", label: "MDC Core" },
]

// Partnered events ("MDC x …") are run by the core team.
const matchesDomain = (e, key) =>
    key === "all" || e.domain === key || (key === "EB" && !!partnerOf(e))

export default function Events() {
    const { events, loading, error } = useEvents()
    const [params, setParams] = useSearchParams()
    const year = params.get("year") || "all"
    const domain = params.get("domain") || "all"
    const openId = params.get("id")

    const setParam = (key, value, { replace = false } = {}) => {
        const next = new URLSearchParams(params)
        if (!value || value === "all") next.delete(key)
        else next.set(key, value)
        setParams(next, { replace, preventScrollReset: true })
    }

    const years = useMemo(() => [...new Set(events.map(e => e.year).filter(Boolean))].sort().reverse(), [events])

    const filtered = useMemo(
        () => events.filter(e => (year === "all" || e.year === year) && matchesDomain(e, domain)),
        [events, year, domain]
    )

    // Only offer domain chips that have at least one event.
    const domainFilters = DOMAIN_FILTERS.filter(f => f.key === "all" || events.some(e => matchesDomain(e, f.key)))

    const grouped = useMemo(() => {
        const map = new Map()
        filtered.forEach(e => {
            const k = e.year || "Undated"
            map.set(k, [...(map.get(k) || []), e])
        })
        return [...map.entries()]
    }, [filtered])

    const openIndex = filtered.findIndex(e => e.id === openId)
    const openEvent = openIndex >= 0 ? filtered[openIndex] : events.find(e => e.id === openId)

    return (
        <main>
            <PageHeader
                eyebrow="Events"
                title="Every event we've *hosted.*"
                lede="Contests, hackathons, workshops and talks, logged as they happen. Tap any event for photos and the full write-up."
            />

            <div className="sticky top-16 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
                <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-1 overflow-x-auto scrollbar-none" role="tablist" aria-label="Filter by year">
                        {["all", ...years].map(y => (
                            <button
                                key={y}
                                role="tab"
                                aria-selected={year === y}
                                onClick={() => setParam("year", y)}
                                className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${year === y ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
                            >
                                {y === "all" ? "All years" : y}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none" aria-label="Filter by domain">
                        {domainFilters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setParam("domain", f.key)}
                                aria-pressed={domain === f.key}
                                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${domain === f.key ? "border-accent/50 bg-accent-soft text-accent" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="py-14 sm:py-20">
                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[4/4.2] animate-pulse rounded-2xl border border-line bg-bg-elev" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="py-20 text-center text-fg-muted">We couldn't load events right now. Please try again in a moment.</p>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line-strong py-20 text-center">
                        <p className="font-display text-xl font-semibold">Nothing here yet.</p>
                        <p className="mt-2 text-sm text-fg-muted">No events match these filters, and older years are still being archived.</p>
                        <button onClick={() => setParams({}, { preventScrollReset: true })} className="mt-6 text-sm text-accent hover:text-fg">Clear filters</button>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {grouped.map(([y, list]) => (
                            <section key={y} aria-labelledby={`y-${y}`}>
                                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                                    <h2 id={`y-${y}`} className="font-mono text-sm text-fg">{y}</h2>
                                    <p className="font-mono text-xs text-fg-subtle">{list.length} event{list.length === 1 ? "" : "s"}</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {list.map((e, i) => (
                                        <Reveal key={e.id} delay={(i % 3) * 0.05}>
                                            <EventCard event={e} onOpen={() => setParam("id", e.id)} />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </Container>

            <AnimatePresence>
                {openEvent && (
                    <EventModal
                        key="modal"
                        event={openEvent}
                        onClose={() => setParam("id", null)}
                        onPrev={openIndex > 0 ? () => setParam("id", filtered[openIndex - 1].id, { replace: true }) : undefined}
                        onNext={openIndex >= 0 && openIndex < filtered.length - 1 ? () => setParam("id", filtered[openIndex + 1].id, { replace: true }) : undefined}
                    />
                )}
            </AnimatePresence>
        </main>
    )
}
