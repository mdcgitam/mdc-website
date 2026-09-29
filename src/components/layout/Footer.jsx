import { Link } from "react-router-dom"
import { Container } from "../ui/primitives"
import { NAV, SOCIALS, CURRENT_BOARD, gmailCompose } from "../../data/site"
import { Instagram, LinkedIn, GitHub } from "../ui/Icons"

export default function Footer() {
    const president = CURRENT_BOARD[0]

    return (
        <footer className="relative overflow-hidden border-t border-line">
            <Container className="grid gap-12 py-16 md:grid-cols-12">
                <div className="md:col-span-5">
                    <img src="/mdc-wordmark.png" alt="MDC" width="494" height="190" className="wordmark h-7 w-auto" />
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
                        Meta Developer Communities: GITAM's student-run developer community, Visakhapatnam. Built by students since 2023.
                    </p>
                    <div className="mt-6 flex gap-2">
                        {[
                            { href: SOCIALS.instagram, label: "Instagram", Icon: Instagram },
                            { href: SOCIALS.linkedin, label: "LinkedIn", Icon: LinkedIn },
                            { href: SOCIALS.github, label: "GitHub", Icon: GitHub },
                        ].map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                            >
                                <Icon size={17} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">Explore</p>
                    <ul className="mt-5 space-y-3 text-sm">
                        {NAV.map(item => (
                            <li key={item.to}>
                                <Link to={item.to} className="text-fg-muted transition-colors hover:text-fg">{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-4">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">Get in touch</p>
                    <ul className="mt-5 space-y-3 text-sm">
                        <li>
                            <a href={gmailCompose(president.email)} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-fg">
                                {president.email}
                            </a>
                        </li>
                        <li className="text-fg-muted">GITAM University, Visakhapatnam</li>
                        <li>
                            <Link to="/contact#apply" className="text-accent transition-colors hover:text-fg">Apply to join →</Link>
                        </li>
                    </ul>
                </div>
            </Container>

            <Container>
                <div
                    aria-hidden
                    className="text-outline select-none whitespace-nowrap text-center font-sans text-[24vw] font-bold leading-[0.8] tracking-[0.04em] md:text-[15rem]"
                >
                    MDC
                </div>
            </Container>

            <div className="border-t border-line">
                <Container className="flex flex-col gap-3 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Meta Developer Communities, GITAM.</p>
                    <p className="font-mono">
                        Designed &amp; built by MDC · <Link to="/admin" className="hover:text-fg-muted">admin</Link>
                    </p>
                </Container>
            </div>
        </footer>
    )
}
