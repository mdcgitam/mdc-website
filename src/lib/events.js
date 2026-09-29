import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"

// The whole events collection is small (tens of docs), so fetch it once per
// session and share it between the home page, heatmap and events page.
let cache = null
let inflight = null

function normalise(doc) {
    const data = doc.data()
    const d = data.date ? new Date(data.date) : null
    const valid = d && !isNaN(d.getTime())
    return {
        id: doc.id,
        ...data,
        title: (data.title || "").trim(),
        domain: (data.domain || "").trim(),
        images: (data.images || []).filter(Boolean),
        dateObj: valid ? d : null,
        dateKey: valid ? d.toISOString().slice(0, 10) : null,
    }
}

export function loadEvents() {
    if (cache) return Promise.resolve(cache)
    if (!inflight) {
        inflight = getDocs(collection(db, "events"))
            .then(snap => {
                cache = snap.docs
                    .map(normalise)
                    .sort((a, b) => (b.dateObj?.getTime() || 0) - (a.dateObj?.getTime() || 0))
                return cache
            })
            .finally(() => { inflight = null })
    }
    return inflight
}

export function useEvents() {
    const [state, setState] = useState(() => ({ events: cache || [], loading: !cache, error: null }))

    useEffect(() => {
        if (cache) return
        let alive = true
        loadEvents()
            .then(events => alive && setState({ events, loading: false, error: null }))
            .catch(error => {
                console.error("Error fetching events:", error)
                if (alive) setState({ events: [], loading: false, error })
            })
        return () => { alive = false }
    }, [])

    return state
}

export function formatDate(dateObj, opts = { day: "numeric", month: "short", year: "numeric" }) {
    return dateObj ? dateObj.toLocaleDateString("en-IN", opts) : ""
}

// "MDC x ACM" -> "ACM"; returns null for in-house events.
export function partnerOf(event) {
    const m = /^MDC\s*x\s*(.+)$/i.exec(event.domain || "")
    return m ? m[1].trim() : null
}

export const DOMAIN_LABELS = {
    CP: "Competitive Programming",
    WebArcs: "WebArc",
    DataVerse: "DataVerse",
    Design: "Design",
    Content: "Content",
    PR: "Public Relations",
    Photography: "Photography",
    EB: "MDC Core",
}

export function domainLabel(event) {
    const partner = partnerOf(event)
    if (partner) return `MDC × ${partner}`
    return DOMAIN_LABELS[event.domain] || event.domain || "MDC"
}
