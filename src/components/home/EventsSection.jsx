import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function EventsSection() {
    const [events, setEvents] = useState([])
    const swiperRef = useRef(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentEvents = async () => {
            try {
                const q = query(
                    collection(db, "events"),
                    orderBy("date", "desc"),
                    limit(5)
                )
                const snapshot = await getDocs(q)
                const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setEvents(eventsList)
            } catch (error) {
                console.error("Error fetching events:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecentEvents()
    }, [])

    return (
        <section className="py-12 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-50 to-white pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                            Recent Events
                        </h2>
                        <p className="text-gray-600 max-w-xl text-lg">
                            Discover the latest workshops, expert talks and hackathons hosted by our community.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/events">
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-full transition-colors border border-blue-200 shadow-sm">
                                View All Events
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-gray-500 text-lg">Events Coming Soon.</p>
                    </div>
                ) : (
                    <div
                        className="relative group"
                        onMouseEnter={() => {
                            if (swiperRef.current) {
                                swiperRef.current.autoplay.stop()
                            }
                        }}
                        onMouseLeave={() => {
                            if (swiperRef.current) {
                                swiperRef.current.autoplay.start()
                            }
                        }}
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={events.length > 1}
                            speed={3000}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom',
                            }}
                            autoplay={{ delay: 0, disableOnInteraction: false }}
                            className="pb-16"
                            style={{ "--swiper-wrapper-transition-timing-function": "linear" }}
                            onSwiper={(swiper) => { swiperRef.current = swiper }}
                        >
                            {events.map((event) => (
                                <SwiperSlide key={event.id}>
                                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 group/card h-full flex flex-col">

                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            {event.images?.[0] ? (
                                                <img
                                                    src={event.images[0]}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
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

                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                                {event.year}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/card:text-blue-600 transition-colors line-clamp-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}

                <div className="text-center mt-12 md:hidden">
                    <Link to="/events" className="inline-block px-8 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-semibold rounded-xl transition-colors w-full">
                        View All Events
                    </Link>
                </div>

            </div>

            <style>{`
                .swiper-pagination-bullet {
                    background-color: rgba(255, 255, 255, 0.4);
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background-color: #06b6d4 !important;
                    width: 24px;
                    border-radius: 8px;
                }
            `}</style>
        </section>
    )
}