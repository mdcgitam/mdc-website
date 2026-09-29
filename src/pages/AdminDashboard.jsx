import { useEffect, useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { Plus, Trash, LogOut } from "../components/ui/Icons"

const YEARS = ["2026-27", "2025-26", "2024-25", "2023-24", "2022-23"]
const inputClass = "w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-fg placeholder:text-fg-subtle focus:border-accent/60 focus:outline-none"

function Label({ children }) {
    return <span className="mb-2 block text-sm text-fg-muted">{children}</span>
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(undefined)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [domain, setDomain] = useState("")
    const [year, setYear] = useState(YEARS[0])
    const [date, setDate] = useState("")
    const [images, setImages] = useState([""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notice, setNotice] = useState(null)

    // Only signed-in admins can see the dashboard.
    useEffect(() => onAuthStateChanged(auth, u => {
        setUser(u)
        if (!u) navigate("/admin", { replace: true })
    }), [navigate])

    const handleImageChange = (index, value) => setImages(imgs => imgs.map((img, i) => (i === index ? value : img)))
    const addImageField = () => setImages(imgs => [...imgs, ""])
    const removeImageField = (index) => setImages(imgs => {
        const updated = imgs.filter((_, i) => i !== index)
        return updated.length ? updated : [""]
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setNotice(null)
        try {
            await addDoc(collection(db, "events"), {
                title,
                description,
                domain,
                year,
                date,
                images: images.filter(img => img !== ""),
                createdAt: serverTimestamp(),
            })
            setNotice({ ok: true, text: `Published "${title}".` })
            setTitle("")
            setDescription("")
            setDomain("")
            setYear(YEARS[0])
            setDate("")
            setImages([""])
        } catch (error) {
            console.error(error)
            setNotice({ ok: false, text: "Couldn't publish the event. Check your connection and permissions." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        navigate("/admin")
    }

    if (!user) return <main className="min-h-screen" />

    return (
        <main className="min-h-screen">
            <header className="border-b border-line">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/mdc-wordmark.png" alt="MDC" className="h-5 w-auto" />
                        <span className="font-mono text-xs text-fg-subtle">/ dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden font-mono text-xs text-fg-subtle sm:block">{user.email}</span>
                        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
                            <LogOut size={15} /> Log out
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-5 py-12">
                <h1 className="text-3xl font-semibold">Publish an event</h1>
                <p className="mt-1.5 text-sm text-fg-muted">It shows up on the events page, the home page and the activity graph straight away.</p>

                {notice && (
                    <p role="status" className={`mt-6 rounded-xl border px-4 py-3 text-sm ${notice.ok ? "border-ok/30 bg-ok/10 text-ok" : "border-err/30 bg-err/10 text-err"}`}>
                        {notice.text}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-3xl border border-line bg-bg-elev p-6 sm:p-8">
                    <label className="block">
                        <Label>Event title</Label>
                        <input type="text" placeholder="e.g. Debug The Web" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
                    </label>

                    <label className="block">
                        <Label>Description</Label>
                        <textarea placeholder="What happened? Line breaks become paragraphs." value={description} onChange={(e) => setDescription(e.target.value)} required rows="5" className={`${inputClass} resize-y`} />
                    </label>

                    <label className="block">
                        <Label>Domain</Label>
                        <input type="text" list="domain-options" placeholder="CP, WebArcs, DataVerse, Design, EB, or MDC x Partner" value={domain} onChange={(e) => setDomain(e.target.value)} className={inputClass} />
                        <datalist id="domain-options">
                            {["CP", "WebArcs", "DataVerse", "Design", "Content", "PR", "Photography", "EB"].map(d => <option key={d} value={d} />)}
                        </datalist>
                    </label>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="block">
                            <Label>Academic year</Label>
                            <select value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <Label>Event date</Label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                        </label>
                    </div>

                    <div>
                        <Label>Image URLs</Label>
                        <div className="space-y-2">
                            {images.map((img, index) => (
                                <div key={index} className="flex gap-2">
                                    <input type="url" placeholder="https://… or /photos25-26/…" value={img} onChange={(e) => handleImageChange(index, e.target.value)} className={inputClass} />
                                    {images.length > 1 && (
                                        <button type="button" onClick={() => removeImageField(index)} aria-label="Remove image" className="flex w-12 shrink-0 items-center justify-center rounded-xl border border-line text-fg-subtle hover:border-err/40 hover:text-err">
                                            <Trash size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addImageField} className="mt-3 flex items-center gap-1.5 text-sm text-accent hover:text-fg">
                            <Plus size={15} /> Add another image
                        </button>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full bg-fg text-sm font-medium text-bg transition-colors hover:bg-fg/85 disabled:opacity-60">
                        {isSubmitting ? "Publishing…" : "Publish event"}
                    </button>
                </form>
            </div>
        </main>
    )
}
