import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileDropdown, setMobileDropdown] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()

    // Close dropdowns on route change
    useEffect(() => {
        setOpen(false)
        setActiveDropdown(null)
        setMobileMenuOpen(false)
        setMobileDropdown(null)
    }, [location.pathname, location.search])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [mobileMenuOpen])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        {
            name: "About Us",
            path: "/about",
            dropdown: [
                { name: "History", path: "/about?section=history" },
                { name: "Founders", path: "/about?section=founders" },
                { name: "Mentors", path: "/about?section=mentors" }
            ]
        },
        {
            name: "Tenures",
            path: "/tenure",
            dropdown: [
                { name: "2025-26", path: "/tenure?year=2025-26" },
                { name: "2024-25", path: "/tenure?year=2024-25" },
                { name: "2023-24", path: "/tenure?year=2023-24" },
                { name: "2022-23", path: "/tenure?year=2022-23" }
            ]
        },
        {
            name: "Events",
            path: "/events",
            dropdown: [
                { name: "2025-26", path: "/events?year=2025-26" },
                { name: "2024-25", path: "/events?year=2024-25" },
                { name: "2023-24", path: "/events?year=2023-24" },
                { name: "2022-23", path: "/events?year=2022-23" }
            ]
        },
    ]

    const moreLinks = [
        { name: "Contact", path: "/contact" },
        { name: "Admin", path: "/admin" }
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? "py-3 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
                : "py-5 bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="relative group text-2xl font-bold tracking-widest flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MDC</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 bg-gray-50/50 px-6 py-2.5 rounded-full border border-gray-200/50 backdrop-blur-md shadow-sm">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group py-2"
                            onMouseEnter={() => setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                to={link.path}
                                className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${location.pathname === link.path
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                    }`}
                            >
                                {link.name}
                                {link.dropdown && (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                                        >
                                            <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-2 w-48 overflow-hidden">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.path}
                                                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}

                    {/* More Dropdown */}
                    <div
                        className="relative group py-2"
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <button
                            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
                        >
                            More
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 pt-2"
                                >
                                    <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-2 w-48 overflow-hidden">
                                        {moreLinks.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-800 hover:text-blue-600 transition-colors p-2"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-xl z-40 overflow-y-auto"
                    >
                        <div className="px-6 py-6 space-y-2">
                            {/* Home */}
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                Home
                            </Link>

                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    <button
                                        onClick={() => setMobileDropdown(mobileDropdown === link.name ? null : link.name)}
                                        className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                    >
                                        {link.name}
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === link.name ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {mobileDropdown === link.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-6 pb-2 space-y-1">
                                                    {/* Main link */}
                                                    <Link
                                                        to={link.path}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        All {link.name}
                                                    </Link>
                                                    {link.dropdown.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.path}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="block px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* More links directly */}
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                {moreLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-base font-semibold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}