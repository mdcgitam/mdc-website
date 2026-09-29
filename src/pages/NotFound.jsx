import { useLocation } from "react-router-dom"
import { Container, Button } from "../components/ui/primitives"

export default function NotFound() {
    const { pathname } = useLocation()
    return (
        <main className="relative flex min-h-[80vh] items-center">
            <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden />
            <Container className="relative">
                <p className="font-mono text-sm text-fg-subtle">
                    <span className="text-ok">mdc@gitam</span>:<span className="text-accent">~</span>$ cd {pathname}
                </p>
                <p className="mt-2 font-mono text-sm text-err">cd: no such file or directory: {pathname}</p>
                <h1 className="mt-10 text-5xl font-semibold sm:text-7xl">404</h1>
                <p className="mt-4 max-w-md text-fg-muted">That page doesn't exist, or it was moved during the redesign.</p>
                <div className="mt-8 flex gap-3">
                    <Button to="/" arrow>Back home</Button>
                    <Button to="/events" variant="ghost">Browse events</Button>
                </div>
            </Container>
        </main>
    )
}
