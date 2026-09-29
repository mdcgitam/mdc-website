import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { formatDate, domainLabel } from "../../lib/events"
import { ChevronLeft, ChevronRight, Close, Calendar } from "../ui/Icons"
import { EventCover } from "./EventCard"
import { lockScroll } from "../../lib/smooth"

export default function EventModal({ event, onClose, onPrev, onNext }) {
    // Photo position is tied to the event, so switching events starts at photo 1.
    const [pos, setPos] = useState({ id: event.id, i: 0 })
    const index = pos.id === event.id ? pos.i : 0
    const setIndex = (fn) => setPos({ id: event.id, i: typeof fn === "function" ? fn(index) : fn })
    const closeRef = useRef(null)
    const images = event.images
    const count = images.length

    useEffect(() => {
        const prevFocus = document.activeElement
        closeRef.current?.focus()
        lockScroll(true)
        return () => {
            lockScroll(false)
            prevFocus?.focus?.()
        }
    }, [])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") index < count - 1 ? setPos({ id: event.id, i: index + 1 }) : onNext?.()
            if (e.key === "ArrowLeft") index > 0 ? setPos({ id: event.id, i: index - 1 }) : onPrev?.()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [count, index, event.id, onClose, onNext, onPrev])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="event-title"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: [0.21, 0.6, 0.35, 1] }}
                onMouseDown={e => e.stopPropagation()}
                className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-line-strong bg-surface sm:rounded-3xl"
            >
                <button
                    ref={closeRef}
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg/90"
                >
                    <Close size={18} />
                </button>

                <div className="overflow-y-auto" data-lenis-prevent>
                    <div className="relative aspect-[16/10] w-full bg-bg">
                        {count ? (
                            <img
                                key={images[index]}
                                src={images[index]}
                                alt={`${event.title}, photo ${index + 1} of ${count}`}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <EventCover event={event} className="h-full w-full" />
                        )}

                        {count > 1 && (
                            <>
                                <button
                                    onClick={() => setIndex(i => (i - 1 + count) % count)}
                                    aria-label="Previous photo"
                                    className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur hover:bg-bg/90"
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    onClick={() => setIndex(i => (i + 1) % count)}
                                    aria-label="Next photo"
                                    className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur hover:bg-bg/90"
                                >
                                    <ChevronRight />
                                </button>
                                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[11px] text-fg backdrop-blur">
                                    {index + 1} / {count}
                                </p>
                            </>
                        )}
                    </div>

                    {count > 1 && (
                        <div className="flex gap-2 overflow-x-auto border-b border-line px-5 py-3 scrollbar-none sm:px-8">
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Show photo ${i + 1}`}
                                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity ${i === index ? "border-fg opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                                >
                                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="px-5 py-7 sm:px-8 sm:py-9">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-fg-subtle">
                            <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-accent">{domainLabel(event)}</span>
                            {event.dateObj && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} />
                                    {formatDate(event.dateObj, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </span>
                            )}
                            {event.year && <span>Tenure {event.year}</span>}
                        </div>
                        <h2 id="event-title" className="mt-4 text-3xl font-semibold sm:text-4xl">{event.title}</h2>
                        <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-fg-muted">
                            {event.description
                                ? event.description.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                                : <p className="text-fg-subtle">No write-up for this one yet.</p>}
                        </div>

                        {(onPrev || onNext) && (
                            <div className="mt-10 flex justify-between border-t border-line pt-5 font-mono text-xs">
                                <button onClick={onPrev} disabled={!onPrev} className="flex items-center gap-1 text-fg-muted hover:text-fg disabled:invisible">
                                    <ChevronLeft size={14} /> Newer
                                </button>
                                <button onClick={onNext} disabled={!onNext} className="flex items-center gap-1 text-fg-muted hover:text-fg disabled:invisible">
                                    Older <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
