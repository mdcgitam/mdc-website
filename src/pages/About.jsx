import { Container, PageHeader, Reveal, Eyebrow, Avatar } from "../components/ui/primitives"
import Timeline from "../components/home/Timeline"
import { MISSION, VISION, FOUNDERS, MENTORS, gmailCompose } from "../data/site"
import { Mail, LinkedIn } from "../components/ui/Icons"

function PersonCard({ person }) {
    return (
        <div className="group flex items-center gap-5 rounded-2xl border border-line bg-bg-elev p-4 transition-colors hover:border-line-strong">
            <Avatar src={person.img} name={person.name} className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-semibold leading-tight tracking-tight">{person.name}</p>
                <p className="mt-1 font-mono text-xs text-fg-subtle">{person.role}</p>
                <div className="-ml-2 mt-3 flex gap-1">
                    {person.email && (
                        <a href={gmailCompose(person.email)} target="_blank" rel="noopener noreferrer" aria-label={`Email ${person.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle hover:bg-ink/5 hover:text-fg">
                            <Mail size={15} />
                        </a>
                    )}
                    {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle hover:bg-ink/5 hover:text-fg">
                            <LinkedIn size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function About() {
    return (
        <main>
            <PageHeader
                eyebrow="About"
                title="A community that refused to *shut* *down.*"
                lede="MDC started as a chapter of a global program. When the program ended, the students kept it going."
            />

            <Container className="py-16 sm:py-20">
                <Reveal>
                    <figure className="overflow-hidden rounded-3xl border border-line">
                        <img src="/team-photo.jpg" alt="MDC members together in a GITAM lecture hall" className="aspect-[16/9] w-full object-cover" />
                    </figure>
                    <figcaption className="mt-3 font-mono text-xs text-fg-subtle">The MDC community, GITAM Visakhapatnam.</figcaption>
                </Reveal>
            </Container>

            <section id="mission" className="border-t border-line py-20 sm:py-28">
                <Container>
                    <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
                        {[
                            { label: "Mission", text: MISSION },
                            { label: "Vision", text: VISION },
                        ].map((b, i) => (
                            <Reveal key={b.label} delay={i * 0.08} className="bg-bg p-8 sm:p-12">
                                <Eyebrow index={`0${i + 1}`}>{b.label}</Eyebrow>
                                <p className="mt-6 font-display text-xl leading-snug font-medium tracking-tight sm:text-2xl">{b.text}</p>
                            </Reveal>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="history" className="scroll-mt-16 border-t border-line py-20 sm:py-28">
                <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <Reveal className="lg:sticky lg:top-28 lg:self-start">
                        <Eyebrow index="03">History</Eyebrow>
                        <h2 className="mt-4 text-3xl font-semibold leading-[1.05] sm:text-5xl">From circle to community.</h2>
                        <p className="mt-6 text-base leading-relaxed text-fg-muted sm:text-lg">
                            Meta Developer Circles launched at GITAM in January 2023. When Meta retired the program in
                            April 2024, our leadership didn't let it end. They renamed it and carried on.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Timeline />
                    </Reveal>
                </Container>
            </section>

            <section id="founders" className="scroll-mt-16 border-t border-line py-20 sm:py-28">
                <Container className="grid gap-16 lg:grid-cols-2">
                    <div>
                        <Eyebrow index="04">Founders</Eyebrow>
                        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Where it started.</h2>
                        <div className="mt-8 space-y-3">
                            {FOUNDERS.map((p, i) => (
                                <Reveal key={p.name} delay={i * 0.06}><PersonCard person={p} /></Reveal>
                            ))}
                        </div>
                    </div>
                    <div id="mentors" className="scroll-mt-24">
                        <Eyebrow index="05">Mentors</Eyebrow>
                        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Who guides us.</h2>
                        <div className="mt-8 space-y-3">
                            {MENTORS.map((p, i) => (
                                <Reveal key={p.name} delay={i * 0.06}><PersonCard person={p} /></Reveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    )
}
