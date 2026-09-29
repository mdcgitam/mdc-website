import { Link, useLocation } from "react-router-dom"
import { scrollToTarget } from "../../lib/smooth"

export default function Logo({ className = "" }) {
    const { pathname, hash } = useLocation()
    // Already home: the route won't change, so scroll back to the top ourselves.
    const onClick = () => {
        if (pathname === "/" && !hash) scrollToTarget(0, { offset: 0 })
    }
    return (
        <Link to="/" onClick={onClick} aria-label="MDC home" className={`flex items-center gap-3 ${className}`}>
            <img src="/mdc-wordmark.png" alt="MDC" width="494" height="190" className="h-5 w-auto" />
            <span className="hidden border-l border-line-strong pl-3 font-mono text-[11px] leading-tight text-fg-subtle lg:block">
                Meta Developer<br />Communities
            </span>
        </Link>
    )
}
