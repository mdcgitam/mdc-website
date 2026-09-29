import { Link, useNavigate } from "react-router-dom"
import { Container, Eyebrow } from "../ui/primitives"
import { Magnetic, SplitReveal, VelocityMarquee } from "../fx/effects"
import { useEvents, formatDate, domainLabel } from "../../lib/events"

function ReelCard({ event, onOpen, tall }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={`group relative mx-2 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface text-left sm:mx-3 ${tall ? "h-[300px] w-[240px] sm:h-[420px] sm:w-[330px]" : "h-[220px] w-[320px] sm:h-[300px] sm:w-[440px]"}`}
        >
            <img
                src={event.images[0]}
                alt={event.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition-transform duration-500 group-hover:translate-y-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">{domainLabel(event)} · {formatDate(event.dateObj, { month: "short", year: "numeric" })}</p>
                <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-white">{event.title}</p>
            </div>
        </button>
    )
}

// Two counter-scrolling rows of real event photos; speed and direction follow scroll.
export default function EventsReel() {
    const { events, loading } = useEvents()
    const navigate = useNavigate()
    const withPhotos = events.filter(e => e.images.length)
    const rowA = withPhotos.filter((_, i) => i % 2 === 0)
    const rowB = withPhotos.filter((_, i) => i % 2 === 1)
    const open = (e) => navigate(`/events?id=${e.id}`)

    return (
        <section className="overflow-hidden py-24 sm:py-36">
            <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <Eyebrow index="04">Events</Eyebrow>
                    <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                        <SplitReveal text="Fresh off" className="block" />
                        <SplitReveal text="the *stage.*" className="block" delay={0.1} />
                    </h2>
                </div>
                <Magnetic>
                    <Link
                        to="/events"
                        className="inline-flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-full border border-line-strong text-center text-sm font-medium transition-colors hover:border-accent hover:bg-accent md:self-auto"
                    >
                        All {events.length || ""}<br />events
                    </Link>
                </Magnetic>
            </Container>

            <div className="mt-16 space-y-4 sm:space-y-6">
                {loading ? (
                    <div className="flex gap-6 px-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-[300px] w-[440px] shrink-0 animate-pulse rounded-2xl bg-surface" />
                        ))}
                    </div>
                ) : (
                    <>
                        <VelocityMarquee baseSpeed={35}>
                            {rowA.map((e, i) => <ReelCard key={e.id} event={e} tall={i % 3 === 1} onOpen={() => open(e)} />)}
                        </VelocityMarquee>
                        <VelocityMarquee baseSpeed={28} reverse>
                            {rowB.map((e, i) => <ReelCard key={e.id} event={e} tall={i % 3 === 2} onOpen={() => open(e)} />)}
                        </VelocityMarquee>
                    </>
                )}
            </div>
        </section>
    )
}
