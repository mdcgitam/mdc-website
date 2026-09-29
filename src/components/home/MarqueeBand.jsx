import { VelocityMarquee } from "../fx/effects"

const WORDS = ["Workshops", "Hackathons", "Contests", "Talks", "Projects", "Community"]

function Row({ outline = false }) {
    return WORDS.map(w => (
        <span key={w} className="flex items-center">
            <span className={`px-6 font-display text-[12vw] leading-none font-bold tracking-[-0.05em] md:text-[8.5vw] ${outline ? "text-outline-strong" : "text-fg"}`}>
                {w}
            </span>
            <span className="text-[4vw] text-accent md:text-[3vw]" aria-hidden>✦</span>
        </span>
    ))
}

// Two counter-scrolling bands that accelerate, flip and skew with scroll velocity.
export default function MarqueeBand() {
    return (
        <section aria-label="What we run" className="relative overflow-hidden py-16 sm:py-24">
            <div className="-rotate-2 border-y border-line bg-bg-elev py-4">
                <VelocityMarquee baseSpeed={50}><Row /></VelocityMarquee>
            </div>
            <div className="mt-2 rotate-1 py-2">
                <VelocityMarquee baseSpeed={40} reverse><Row outline /></VelocityMarquee>
            </div>
        </section>
    )
}
