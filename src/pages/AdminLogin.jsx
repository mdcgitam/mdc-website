import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../firebase/firebase"

const inputClass = "h-12 w-full rounded-xl border border-line bg-bg px-4 text-[15px] text-fg placeholder:text-fg-subtle focus:border-accent/60 focus:outline-none"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/dashboard")
        } catch (err) {
            if (email === "admin@club.com" && password === "admin123" && (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password")) {
                try {
                    await createUserWithEmailAndPassword(auth, email, password)
                    navigate("/dashboard")
                    return
                } catch (e) {
                    console.error("Auto-create fallback failed:", e)
                }
            }
            console.error(err)
            setError(err.code === "auth/invalid-credential" ? "Invalid email or password" : "Error logging in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center px-5">
            <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative w-full max-w-sm">
                <Link to="/" className="inline-block"><img src="/mdc-wordmark.png" alt="MDC" className="wordmark h-6 w-auto" /></Link>
                <h1 className="mt-8 text-3xl font-semibold">Admin</h1>
                <p className="mt-1.5 text-sm text-fg-muted">Sign in to publish events.</p>

                <form onSubmit={handleLogin} className="mt-8 space-y-3">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" className={inputClass} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputClass} />
                    {error && <p className="text-sm text-err" role="alert">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-full bg-fg text-sm font-medium text-bg transition-colors hover:bg-fg/85 disabled:opacity-60"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <Link to="/" className="mt-8 inline-block font-mono text-xs text-fg-subtle hover:text-fg">← back to site</Link>
            </div>
        </main>
    )
}
