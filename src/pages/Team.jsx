import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Container, PageHeader, Reveal, Avatar } from "../components/ui/primitives"
import { getTenureMembers, TENURE_YEARS } from "../data/tenureData"
import { gmailCompose } from "../data/site"
import { Mail, LinkedIn } from "../components/ui/Icons"

function Contacts({ member, size = 15 }) {
    if (!member.email && !member.linkedin) return null
    return (
        <div className="flex gap-1">
            {member.email && (
                <a
                    href={gmailCompose(member.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Email ${member.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-ink/5 hover:text-fg"
                >
                    <Mail size={size} />
                </a>
            )}
            {member.linkedin && (
                <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-ink/5 hover:text-fg"
                >
                    <LinkedIn size={size - 1} />
                </a>
            )}
        </div>
    )
}

export default function Team() {
    const [params, setParams] = useSearchParams()
    const requested = params.get("year")
    const year = TENURE_YEARS.includes(requested) ? requested : TENURE_YEARS[0]

    const sections = useMemo(() => getTenureMembers(year), [year])
    const board = sections.find(s => s.domain === "EB")
    const domains = sections.filter(s => s.domain !== "EB")
    const staffed = domains.filter(s => s.members.length)
    const total = sections.reduce((n, s) => n + s.members.length, 0)

    return (
        <main>
            <PageHeader
                eyebrow="Team"
                title="The people behind *MDC.*"
                lede="Every tenure, every domain. MDC is run end-to-end by students, and these are the ones who've carried it."
            />

            <div className="sticky top-16 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
                <Container className="flex items-center justify-between gap-4 py-3">
                    <div className="flex gap-1 overflow-x-auto scrollbar-none" role="tablist" aria-label="Tenure">
                        {TENURE_YEARS.map(y => (
                            <button
                                key={y}
                                role="tab"
                                aria-selected={y === year}
                                onClick={() => setParams({ year: y }, { preventScrollReset: true })}
                                className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${y === year ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                    <p className="hidden shrink-0 font-mono text-xs text-fg-subtle sm:block">{total} people</p>
                </Container>
            </div>

            <Container className="py-14 sm:py-20">
                {total === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line-strong py-20 text-center">
                        <p className="font-display text-xl font-semibold">The {year} archive is being restored.</p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
                            This tenure predates our current records. If you were part of it, get in touch and help us fill it in.
                        </p>
                    </div>
                ) : (
                    <>
                        {board?.members.length > 0 && (
                            <section aria-labelledby="eb">
                                <div className="mb-8 flex items-baseline justify-between border-b border-line pb-3">
                                    <h2 id="eb" className="text-2xl font-semibold sm:text-3xl">Executive Board</h2>
                                    <p className="font-mono text-xs text-fg-subtle">{year}</p>
                                </div>
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                                    {board.members.map((m, i) => (
                                        <Reveal as="li" key={m.name} delay={i * 0.04} className="group">
                                            <Avatar
                                                src={m.img}
                                                name={m.name}
                                                className="aspect-[4/5] rounded-2xl border border-line"
                                                imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                            <div className="mt-4 flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-display text-base font-semibold leading-tight tracking-tight">{m.name}</p>
                                                    <p className="mt-1 font-mono text-[11px] text-accent">{m.role}</p>
                                                </div>
                                            </div>
                                            <div className="-ml-2 mt-2"><Contacts member={m} /></div>
                                        </Reveal>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {staffed.length === 0 && (
                            <div className="mt-16 rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
                                <p className="font-display text-lg font-semibold">Domain teams for {year} are on the way.</p>
                                <p className="mt-2 text-sm text-fg-muted">They'll appear here once the new cohort is announced.</p>
                                <button
                                    onClick={() => setParams({ year: TENURE_YEARS[1] }, { preventScrollReset: true })}
                                    className="mt-5 font-mono text-xs text-accent hover:text-fg"
                                >
                                    See the {TENURE_YEARS[1]} team →
                                </button>
                            </div>
                        )}

                        {staffed.length > 0 && (
                            <>
                                <nav className="mt-20 flex flex-wrap gap-2" aria-label="Jump to domain">
                                    {staffed.map(s => (
                                        <a
                                            key={s.domain}
                                            href={`#d-${s.domain}`}
                                            className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                                        >
                                            {s.label} <span className="ml-1 font-mono text-fg-subtle">{s.members.length}</span>
                                        </a>
                                    ))}
                                </nav>

                                <div className="mt-12 space-y-20">
                                    {staffed.map(s => (
                                        <section key={s.domain} id={`d-${s.domain}`} className="scroll-mt-36" aria-labelledby={`h-${s.domain}`}>
                                            <div className="mb-8 flex items-baseline justify-between border-b border-line pb-3">
                                                <h2 id={`h-${s.domain}`} className="text-2xl font-semibold sm:text-3xl">{s.label}</h2>
                                                <p className="font-mono text-xs text-fg-subtle">{s.members.length} members</p>
                                            </div>
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
                                                {s.members.map((m, i) => (
                                                    <Reveal as="li" key={m.name} delay={(i % 6) * 0.03} className="group">
                                                        <Avatar
                                                            src={m.img}
                                                            name={m.name}
                                                            className="aspect-[3/4] rounded-xl border border-line"
                                                            imgClassName="grayscale-[40%] transition-all duration-500 group-hover:grayscale-0"
                                                        />
                                                        <p className="mt-3 text-sm font-medium leading-snug">{m.name}</p>
                                                        <div className="mt-0.5 flex items-center justify-between">
                                                            <p className={`font-mono text-[11px] ${m.role === "Member" ? "text-fg-subtle" : "text-accent"}`}>{m.role}</p>
                                                            <div className="-mr-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                                                                <Contacts member={m} size={14} />
                                                            </div>
                                                        </div>
                                                    </Reveal>
                                                ))}
                                            </ul>
                                        </section>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </Container>
        </main>
    )
}
