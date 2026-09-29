import { Container } from "../ui/primitives"
import { CountUp } from "../fx/effects"
import { useEvents } from "../../lib/events"
import { countMembers } from "../../data/tenureData"
import { DOMAINS, FOUNDED } from "../../data/site"

const MEMBERS = countMembers()

export default function Stats() {
    const { events, loading } = useEvents()

    const stats = [
        { value: MEMBERS, label: "Members across tenures" },
        { value: loading ? null : events.length, label: "Events logged" },
        { value: DOMAINS.length, label: "Domains", pad: 2 },
        { value: new Date().getFullYear() - FOUNDED, label: "Years running", pad: 2 },
    ]

    return (
        <section className="border-y border-line">
            <Container className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                    <div
                        key={s.label}
                        className={`py-10 sm:py-14 ${i % 2 ? "border-l border-line pl-5 sm:pl-8" : "pr-5"} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle sm:text-[11px]">{String(i + 1).padStart(2, "0")} / {s.label}</p>
                        <p className="mt-4 font-display text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.85] font-semibold tracking-[-0.05em] tabular-nums">
                            {s.value === null ? <span className="text-fg-subtle">··</span> : <CountUp value={s.value} pad={s.pad} />}
                        </p>
                    </div>
                ))}
            </Container>
        </section>
    )
}
