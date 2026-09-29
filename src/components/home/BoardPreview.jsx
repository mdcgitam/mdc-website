import { Link } from "react-router-dom"
import { Container, Eyebrow, Avatar } from "../ui/primitives"
import { SplitReveal, Tilt } from "../fx/effects"
import { CURRENT_BOARD, CURRENT_BOARD_YEAR } from "../../data/site"
import { countMembers } from "../../data/tenureData"
import { ArrowRight } from "../ui/Icons"

const MEMBERS = countMembers()

export default function BoardPreview() {
    return (
        <section className="py-24 sm:py-36">
            <Container>
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <Eyebrow index="06">Executive board · {CURRENT_BOARD_YEAR}</Eyebrow>
                        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                            <SplitReveal text="The people" className="block" />
                            <SplitReveal text="*running* it." className="block" delay={0.1} />
                        </h2>
                    </div>
                    <Link to="/team" className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted hover:text-fg">
                        <span className="h-px w-10 bg-current transition-all group-hover:w-16" />
                        Meet all {MEMBERS} <ArrowRight size={14} />
                    </Link>
                </div>

                <ul className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
                    {CURRENT_BOARD.map((m, i) => (
                        <li key={m.name} className={i % 2 ? "lg:translate-y-12" : ""}>
                            <Tilt className="group rounded-2xl">
                                <div className="overflow-hidden rounded-2xl border border-line bg-surface" style={{ transform: "translateZ(0)" }}>
                                    <Avatar
                                        src={m.img}
                                        name={m.name}
                                        className="aspect-[3/4]"
                                        imgClassName="grayscale contrast-110 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                    />
                                    <div className="p-4" style={{ transform: "translateZ(30px)" }}>
                                        <p className="font-display text-base leading-tight font-semibold tracking-tight">{m.name}</p>
                                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{m.role}</p>
                                    </div>
                                </div>
                            </Tilt>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    )
}
