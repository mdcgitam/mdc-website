import { useState } from "react"
import { Container, PageHeader, Reveal, Avatar, Eyebrow } from "../components/ui/primitives"
import { CURRENT_BOARD, CURRENT_BOARD_YEAR, SOCIALS, gmailCompose } from "../data/site"
import { Mail, Phone, LinkedIn, Instagram, Check, ArrowRight } from "../components/ui/Icons"

// Responses go to the club's existing Google Form.
const FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSeQ3Sg6NhQve14JT1kiAgi1NseWYlvannyAcWKnIcWsDnaF3g/formResponse"
const FIELD_IDS = {
    name: "entry.909436361",
    rollNo: "entry.1482116557",
    phone: "entry.1130558541",
    email: "entry.570738430",
    description: "entry.2066209271",
}
const EMPTY = { name: "", rollNo: "", phone: "", email: "", description: "" }

function Field({ label, name, required, hint, textarea, ...rest }) {
    const Comp = textarea ? "textarea" : "input"
    return (
        <label className="block">
            <span className="flex items-baseline justify-between text-sm text-fg-muted">
                <span>{label}{required && <span className="text-accent"> *</span>}</span>
                {hint && <span className="font-mono text-[11px] text-fg-subtle">{hint}</span>}
            </span>
            <Comp
                name={name}
                required={required}
                className={`mt-2 w-full rounded-xl border border-line bg-bg px-4 text-[15px] text-fg placeholder:text-fg-subtle transition-colors focus:border-accent/60 focus:outline-none ${textarea ? "min-h-[120px] resize-y py-3" : "h-12"}`}
                {...rest}
            />
        </label>
    )
}

function ApplyForm() {
    const [data, setData] = useState(EMPTY)
    const [status, setStatus] = useState("idle") // idle | sending | sent

    const onChange = (e) => setData(d => ({ ...d, [e.target.name]: e.target.value }))

    const onSubmit = (e) => {
        e.preventDefault()
        setStatus("sending")
        // Google Forms doesn't allow CORS, so post through a hidden iframe.
        const form = document.createElement("form")
        form.action = FORM_ACTION
        form.method = "POST"
        form.target = "hidden_iframe"
        Object.entries(FIELD_IDS).forEach(([key, entry]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = entry
            input.value = data[key]
            form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
        setTimeout(() => {
            setStatus("sent")
            setData(EMPTY)
        }, 600)
    }

    if (status === "sent") {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-line bg-bg-elev p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok/15 text-ok"><Check size={22} /></span>
                <h3 className="mt-6 text-2xl font-semibold">Application received.</h3>
                <p className="mt-2 max-w-sm text-sm text-fg-muted">Thanks for reaching out. Someone from the board will get back to you on your GITAM mail.</p>
                <button onClick={() => setStatus("idle")} className="mt-6 font-mono text-xs text-accent hover:text-fg">Submit another response</button>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-line bg-bg-elev p-6 sm:p-9">
            <div>
                <h3 className="text-2xl font-semibold">Apply to join</h3>
                <p className="mt-1.5 text-sm text-fg-muted">Two minutes. No coding test. Just tell us who you are.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" required value={data.name} onChange={onChange} autoComplete="name" />
                <Field label="Registration no." name="rollNo" required value={data.rollNo} onChange={onChange} placeholder="2023002725" inputMode="numeric" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="GITAM email" name="email" type="email" required value={data.email} onChange={onChange} placeholder="you@gitam.in" autoComplete="email" />
                <Field label="Phone" name="phone" type="tel" hint="optional" value={data.phone} onChange={onChange} placeholder="+91" autoComplete="tel" />
            </div>
            <Field
                label="What excites you about MDC?"
                name="description"
                textarea
                hint="optional"
                value={data.description}
                onChange={onChange}
                placeholder="Domains you're curious about, things you've built, what you want to learn…"
            />
            <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-fg text-sm font-medium text-bg transition-colors hover:bg-fg/85 disabled:opacity-60"
            >
                {status === "sending" ? "Sending…" : <>Send application <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>}
            </button>
        </form>
    )
}

export default function Contact() {
    return (
        <main>
            <iframe name="hidden_iframe" title="Form submission target" className="hidden" />
            <PageHeader
                eyebrow="Contact"
                title="Say *hello.*"
                lede="Want to join, collaborate on an event or bring MDC to your class? Reach the board directly or drop an application."
            />

            <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <Reveal>
                    <Eyebrow>Executive board {CURRENT_BOARD_YEAR}</Eyebrow>
                    <ul className="mt-6 divide-y divide-line border-y border-line">
                        {CURRENT_BOARD.map(m => (
                            <li key={m.name} className="flex items-center gap-4 py-4">
                                <Avatar src={m.img} name={m.name} className="h-12 w-12 shrink-0 rounded-full" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium leading-tight">{m.name}</p>
                                    <p className="mt-0.5 font-mono text-[11px] text-fg-subtle">{m.role}</p>
                                </div>
                                <div className="flex gap-0.5">
                                    <a href={`tel:${m.phone.replace(/\s/g, "")}`} aria-label={`Call ${m.name}`} title={m.phone} className="flex h-9 w-9 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-ink/5 hover:text-fg"><Phone size={15} /></a>
                                    <a href={gmailCompose(m.email)} target="_blank" rel="noopener noreferrer" aria-label={`Email ${m.name}`} title={m.email} className="flex h-9 w-9 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-ink/5 hover:text-fg"><Mail size={15} /></a>
                                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="flex h-9 w-9 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-ink/5 hover:text-fg"><LinkedIn size={14} /></a>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 grid gap-3 sm:grid-cols-2">
                        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-line-strong">
                            <Instagram size={20} />
                            <span className="text-sm"><span className="block text-fg">Instagram</span><span className="font-mono text-[11px] text-fg-subtle">@mdc_gitam</span></span>
                        </a>
                        <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-line-strong">
                            <LinkedIn size={18} />
                            <span className="text-sm"><span className="block text-fg">LinkedIn</span><span className="font-mono text-[11px] text-fg-subtle">Meta Developer Communities</span></span>
                        </a>
                    </div>
                </Reveal>

                <Reveal delay={0.08}>
                    <div id="apply" className="scroll-mt-24">
                        <ApplyForm />
                    </div>
                </Reveal>
            </Container>
        </main>
    )
}
