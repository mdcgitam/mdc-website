import { useState } from "react"
import { formatDate, domainLabel } from "../../lib/events"
import { Image as ImageIcon } from "../ui/Icons"

export function EventCover({ event, className = "" }) {
    const [failed, setFailed] = useState(false)
    const src = event.images[0]

    if (!src || failed) {
        // Typographic cover for events without photos.
        return (
            <div className={`relative flex items-end overflow-hidden bg-surface p-5 ${className}`}>
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
                <span className="relative font-display text-2xl font-semibold leading-tight tracking-tight text-fg/80">{event.title}</span>
                <ImageIcon size={16} className="absolute top-4 right-4 text-fg-subtle" />
            </div>
        )
    }
    return (
        <div className={`overflow-hidden bg-surface ${className}`}>
            <img
                src={src}
                alt={event.title}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
        </div>
    )
}

export default function EventCard({ event, onOpen }) {
    return (
        <button
            type="button"
            onClick={() => onOpen?.(event)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-elev text-left transition-colors duration-300 hover:border-line-strong"
        >
            <EventCover event={event} className="aspect-[4/3] w-full" />
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-fg-subtle">
                    <span className="truncate">{domainLabel(event)}</span>
                    <time className="shrink-0" dateTime={event.dateKey || undefined}>{formatDate(event.dateObj)}</time>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-fg">{event.title}</h3>
                {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{event.description}</p>
                )}
            </div>
        </button>
    )
}
