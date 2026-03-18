import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import mdcImage from "../../MDCidea.png"

export default function AboutMDC() {
    return (
        <section className="py-12 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-16 items-center">

                {/* Left Side: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4">
                        Who We Are
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                        Pioneering the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Student Developers
                        </span>
                    </h2>

                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Meta Developer Communities (MDC) is more than just a club. We are a dynamic collective of tech enthusiasts, designers and problem solvers at Gitam. Our mission is to bridge the gap between theoretical knowledge and practical, industry-standard development.
                    </p>

                    <Link to="/about">
                        <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-blue-600 font-semibold group"
                        >
                            Learn More About Our Journey
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Right Side: MDC Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 w-full"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 p-2">
                        <div className="rounded-2xl overflow-hidden">
                            <img
                                src="/team-photo.jpg"
                                alt="Meta Developer Communities"
                                className="w-full h-auto object-cover rounded-2xl"
                            />
                        </div>

                        {/* Floating Stat Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">50+</div>
                                <div className="text-sm text-gray-500 font-medium">Active Members</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
