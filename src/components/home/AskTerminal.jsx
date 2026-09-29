import { Container, Eyebrow } from "../ui/primitives"
import { SplitReveal } from "../fx/effects"
import Terminal from "./Terminal"

export default function AskTerminal() {
    return (
        <section className="relative overflow-hidden py-24 sm:py-36">
            <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]" />
            <Container className="relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                    <Eyebrow index="07">Shell access</Eyebrow>
                    <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                        <SplitReveal text="Or just" className="block" />
                        <SplitReveal text="*ask* the club." className="block" delay={0.1} />
                    </h2>
                    <p className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted">
                        A real terminal wired to our live data. Try <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-sm text-fg">events</code>,{" "}
                        <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-sm text-fg">team</code> or{" "}
                        <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-sm text-fg">cd events</code>.
                    </p>
                </div>
                <Terminal />
            </Container>
        </section>
    )
}
