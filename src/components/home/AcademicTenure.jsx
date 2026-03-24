import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import { getTenureMembers } from "../../data/tenureData"

// Animated Domain Icons
const DomainIcon = ({ domain }) => {
    const icons = {
        EB: (
            <div className="relative w-7 h-7">
                <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/2 top-0 -translate-x-1/2 w-3 h-3 bg-white/90 rounded-full"
                />
                <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/2 top-3 -translate-x-1/2 w-5 h-3 bg-white/70 rounded-t-full"
                />
                <motion.div
                    animate={{ x: [0, -1, 0], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute left-0 top-1 w-2 h-2 bg-white/60 rounded-full"
                />
                <motion.div
                    animate={{ x: [0, 1, 0], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute right-0 top-1 w-2 h-2 bg-white/60 rounded-full"
                />
            </div>
        ),
        WebArc: (
            <div className="relative w-7 h-7">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-white/80 rounded-full"
                />
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/50 -translate-y-1/2" />
                <motion.div
                    animate={{ scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 border-2 border-white/50 rounded-full"
                />
            </div>
        ),
        DataVerse: (
            <div className="relative w-7 h-7 flex items-end justify-center gap-[2px] pb-[2px]">
                {[40, 70, 50, 90, 60].map((h, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                        className="w-[3px] bg-white/80 rounded-t-sm"
                        style={{ minHeight: 2 }}
                    />
                ))}
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-white/60"
                />
                <motion.div
                    animate={{ y: [-2, -6], opacity: [1, 0], x: [0, 3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"
                />
            </div>
        ),
        CP: (
            <div className="relative w-7 h-7 flex items-center justify-center">
                <motion.span
                    animate={{ x: [-1, -3, -1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/90 font-mono font-bold text-sm"
                >{"<"}</motion.span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-white/70 font-mono text-xs mx-0.5"
                >/</motion.span>
                <motion.span
                    animate={{ x: [1, 3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/90 font-mono font-bold text-sm"
                >{">"}</motion.span>
            </div>
        ),
        Content: (
            <div className="relative w-7 h-7">
                <motion.div
                    animate={{ rotate: [0, -5, 0, 5, 0], y: [0, -1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </motion.div>
            </div>
        ),
        Design: (
            <div className="relative w-7 h-7">
                <motion.div
                    animate={{ x: [-3, 3, -3], rotate: [-10, 10, -10] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                </motion.div>
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
                        className={`absolute w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-pink-200 top-0 right-1' : i === 1 ? 'bg-yellow-200 bottom-1 left-0' : 'bg-green-200 top-2 right-0'}`}
                    />
                ))}
            </div>
        ),
        PR: (
            <div className="relative w-7 h-7 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                </motion.div>
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ scale: [0.5, 1.5], opacity: [0.8, 0], x: [0, 6] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"
                    />
                ))}
            </div>
        ),
        Photography: (
            <div className="relative w-7 h-7 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 0.95, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </motion.div>
                <motion.div
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                    className="absolute top-0 right-0 w-2 h-2 bg-yellow-200 rounded-full"
                />
            </div>
        ),
        ARVR: (
            <div className="relative w-7 h-7 flex items-center justify-center">
                <motion.div
                    animate={{ rotateY: [0, 180, 360], rotateX: [0, 15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </motion.div>
            </div>
        ),
    }
    return icons[domain] || icons.EB
}

// Role badge color mapping
const roleBadgeStyles = {
    "President": { bg: "bg-gradient-to-r from-amber-500 to-orange-500", text: "text-white" },
    "Vice President": { bg: "bg-gradient-to-r from-blue-500 to-indigo-500", text: "text-white" },
    "Secretary": { bg: "bg-gradient-to-r from-emerald-500 to-teal-500", text: "text-white" },
    "HOP": { bg: "bg-gradient-to-r from-purple-500 to-violet-500", text: "text-white" },
    "Head of Operations": { bg: "bg-gradient-to-r from-purple-500 to-violet-500", text: "text-white" },
    "Creative Head": { bg: "bg-gradient-to-r from-cyan-500 to-blue-500", text: "text-white" },
    "Technical Head": { bg: "bg-gradient-to-r from-indigo-500 to-purple-500", text: "text-white" },
    "Lead": { bg: "bg-gradient-to-r from-indigo-500 to-blue-500", text: "text-white" },
    "Member": { bg: "bg-gray-100", text: "text-gray-600" },
}

// Contact Icons
const PhoneIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
)
const EmailIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)
const LinkedInIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

// ── EB Carousel Component ────────────────────────────────────────────────────
const EBCarousel = ({ members }) => {
    const trackRef = useRef(null)
    const pausedRef = useRef(false)
    const animFrameRef = useRef(null)
    const posRef = useRef(0)
    const items = [...members, ...members]

    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        const animate = () => {
            if (!pausedRef.current) {
                const halfWidth = track.scrollWidth / 2
                posRef.current += 0.5
                if (posRef.current >= halfWidth) posRef.current = 0
                track.style.transform = `translateX(-${posRef.current}px)`
            }
            animFrameRef.current = requestAnimationFrame(animate)
        }

        animFrameRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animFrameRef.current)
    }, [])

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => { pausedRef.current = true }}
            onMouseLeave={() => { pausedRef.current = false }}
        >
            <div className="flex gap-6 w-max" ref={trackRef}>
                {items.map((member, memberIndex) => {
                    const style = roleBadgeStyles[member.role] || roleBadgeStyles.Member
                    return (
                        <div key={memberIndex} className="text-center py-3 w-44 shrink-0">
                            <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-lg">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f3f4f6&color=2563eb&size=300&font-size=0.35`
                                    }}
                                />
                            </div>
                            <p className="text-base font-bold text-gray-900 leading-tight mb-2">
                                {member.name}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full shadow-md ${style.bg} ${style.text}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                                {member.role}
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                            </span>
                            <div className="flex justify-center gap-2 mt-3 relative z-50 pointer-events-auto">
                                {member.phone && (
                                    <a href={`tel:${member.phone}`} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors" title="Phone">
                                        <PhoneIcon />
                                    </a>
                                )}
                                {member.email && (
                                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors" title="Email">
                                        <EmailIcon />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                                        <LinkedInIcon />
                                    </a>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AcademicTenure() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const initialYear = queryParams.get('year') || "2025-26"
    const sectionRef = useRef(null)

    const [selectedYear, setSelectedYear] = useState(initialYear)
    const [domainSections, setDomainSections] = useState([])
    const years = ["2025-26", "2024-25", "2023-24", "2022-23"]

    useEffect(() => {
        const yearParam = queryParams.get('year')
        if (yearParam && years.includes(yearParam)) {
            setSelectedYear(yearParam)
        }
    }, [location.search])

    useEffect(() => {
        setDomainSections(getTenureMembers(selectedYear))
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [selectedYear])

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value)
    }

    return (
        <section ref={sectionRef} className="min-h-screen px-6 pt-24 pb-16 bg-gray-50 text-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-blue-100/50 blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900">
                        Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tenure</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
                        Meet the teams that powered our community across the years.
                    </p>
                </motion.div>

                {/* Year Dropdown */}
                <div className="flex justify-center mb-10 relative z-50">
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="appearance-none bg-white border border-gray-200 text-gray-900 text-lg font-semibold px-8 py-3 pr-12 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all hover:border-blue-300"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Domain Sections */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedYear}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8 relative z-10"
                    >
                        {domainSections.map((section, sectionIndex) => (
                            <motion.div
                                key={section.domain}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sectionIndex * 0.08, duration: 0.5 }}
                            >
                                {/* Domain Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.colors.bg} flex items-center justify-center shadow-lg overflow-hidden`}
                                    >
                                        <DomainIcon domain={section.domain} />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {section.label}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            {section.members.length} {section.members.length === 1 ? "member" : "members"}
                                        </p>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4"></div>
                                </div>

                                {/* Members Display */}
                                {section.members.length > 0 ? (
                                    section.domain === "EB" ? (
                                        <EBCarousel key={`${selectedYear}-eb`} members={section.members} />
                                    ) : (
                                        <div className="flex flex-wrap gap-4 justify-start">
                                            {section.members.map((member, memberIndex) => {
                                                const style = roleBadgeStyles[member.role] || roleBadgeStyles.Member
                                                return (
                                                    <div key={memberIndex} className="w-[calc(50%-8px)] sm:w-[170px] text-center">
                                                        <div className="w-36 h-44 mx-auto mb-3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
                                                            <img
                                                                src={member.img}
                                                                alt={member.name}
                                                                className="w-full h-full object-cover object-top"
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f3f4f6&color=2563eb&size=300&font-size=0.35`
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5 line-clamp-2">
                                                            {member.name}
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${style.bg} ${style.text}`}>
                                                            {member.role}
                                                        </span>
                                                        {(member.email || member.linkedin) && (
                                                            <div className="flex justify-center gap-1.5 mt-2 relative z-50 pointer-events-auto">
                                                                {member.email && (
                                                                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors" title="Email">
                                                                        <EmailIcon />
                                                                    </a>
                                                                )}
                                                                {member.linkedin && (
                                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                                                                        <LinkedInIcon />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400 font-medium">Members coming soon</p>
                                        <p className="text-gray-300 text-sm mt-1">Photos will be added shortly</p>
                                    </div>
                                )}

                                {/* Section Divider */}
                                {sectionIndex < domainSections.length - 1 && (
                                    <div className="flex items-center gap-4 mt-4 max-w-lg mx-auto">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}