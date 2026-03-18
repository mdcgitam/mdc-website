import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import History from "../components/about/History"
import Founders from "../components/about/Founders"
import Mentors from "../components/about/Mentors"

export default function About() {
    const location = useLocation()

    // Scroll to section if query param is present
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const section = params.get('section')
        if (section) {
            const el = document.getElementById(section)
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" })
                }, 300)
            }
        }
    }, [location.search])

    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen pt-24 pb-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-blue-100/50 blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MDC</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Empowering developers, building communities and fostering innovation.
                    </p>
                </motion.div>

                {/* History Section */}
                <section id="history" className="scroll-mt-24 mb-10">
                    <History />
                </section>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-10 max-w-4xl mx-auto">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                </div>

                {/* Founders Section */}
                <section id="founders" className="scroll-mt-24 mb-10">
                    <Founders />
                </section>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-10 max-w-4xl mx-auto">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                </div>

                {/* Mentors Section */}
                <section id="mentors" className="scroll-mt-24">
                    <Mentors />
                </section>
            </div>
        </div>
    )
}