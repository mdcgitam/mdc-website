import { useEffect, useState, useRef } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

export default function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const initialYear = queryParams.get('year') || "2025-26"
    const sectionRef = useRef(null)

    const [selectedYear, setSelectedYear] = useState(initialYear)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const years = ["2025-26", "2024-25", "2023-24", "2022-23"]

    // Sync selectedYear if query param changes
    useEffect(() => {
        const yearParam = queryParams.get('year')
        if (yearParam && years.includes(yearParam)) {
            setSelectedYear(yearParam)
        }
    }, [location.search])

    useEffect(() => {
        fetchEvents()
        // Scroll to top of section when year changes
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [selectedYear])

    // Freeze body scroll when modal is open
    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [selectedEvent])

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(db, "events"),
                where("year", "==", selectedYear)
            )

            const snapshot = await getDocs(q)

            let eventList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Sort by most recent first
            eventList.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });

            // Format dates as DD-MM-YYYY
            eventList = eventList.map(ev => {
                if (ev.date) {
                    const d = new Date(ev.date);
                    if (!isNaN(d.getTime())) {
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = d.getFullYear();
                        ev.displayDate = `${day}-${month}-${year}`;
                    } else {
                        ev.displayDate = ev.date;
                    }
                }
                return ev;
            });

            setEvents(eventList)

        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    const nextImage = (e, totalImages) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = (e, totalImages) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const handleEventClick = (event) => {
        setCurrentImageIndex(0);
        setSelectedEvent(event);
    };

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
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
                        Explore the workshops, expert talks and hackathons hosted by our community.
                    </p>
                </motion.div>

                {/* Year Dropdown Selector */}
                <div className="flex justify-center mb-10">
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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto"
                    >
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-xl font-medium">Hang on tight , we are uploading the events for the year {selectedYear}.</p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <AnimatePresence>
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    layoutId={`event-${event.id}`}
                                    onClick={() => handleEventClick(event)}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                        {event.images?.[0] ? (
                                            <motion.img
                                                layoutId={`event-image-${event.id}`}
                                                src={event.images[0]}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={['/event-placeholder-hackathon.png', '/event-placeholder-workshop.png', '/event-placeholder-seminar.png'][event.id?.charCodeAt(0) % 3 || 0]}
                                                alt={event.title}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100">
                                            {event.year}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {event.domain && (
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                                                    {event.domain}
                                                </span>
                                            )}
                                            {event.displayDate && (
                                                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-md">
                                                    {event.displayDate}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {event.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Expanded Modal — fixed z-index below navbar, smaller, frozen background */}
                <AnimatePresence>
                    {selectedEvent && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedEvent(null)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4 md:p-8"
                            >
                                <motion.div
                                    layoutId={`event-${selectedEvent.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl relative flex flex-col mt-16"
                                >
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-colors shadow-sm"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="relative h-56 md:h-72 w-full bg-gray-100 shrink-0">
                                        {selectedEvent.images && selectedEvent.images.length > 0 ? (
                                            <>
                                                <motion.img
                                                    key={currentImageIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    layoutId={`event-image-${selectedEvent.id}`}
                                                    src={selectedEvent.images[currentImageIndex]}
                                                    alt={`${selectedEvent.title} - ${currentImageIndex + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'
                                                    }}
                                                />
                                                {selectedEvent.images.length > 1 && (
                                                    <div className="absolute inset-0 flex items-center justify-between p-4">
                                                        <button
                                                            onClick={(e) => prevImage(e, selectedEvent.images.length)}
                                                            className="w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => nextImage(e, selectedEvent.images.length)}
                                                            className="w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                                    {selectedEvent.images.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span>No Images Available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            {selectedEvent.domain && (
                                                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1.5 rounded-lg border border-blue-200">
                                                    {selectedEvent.domain}
                                                </span>
                                            )}
                                            <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-200">
                                                {selectedEvent.year}
                                            </span>
                                            {selectedEvent.displayDate && (
                                                <span className="bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {selectedEvent.displayDate}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                                            {selectedEvent.title}
                                        </h2>

                                        <div className="prose prose-blue max-w-none text-gray-600">
                                            {selectedEvent.description?.split('\n').map((paragraph, i) => (
                                                <p key={i} className="mb-4 text-base leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                            {!selectedEvent.description && (
                                                <p className="italic text-gray-400">No additional details provided for this event.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}