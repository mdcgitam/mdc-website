import { motion } from "framer-motion"

export default function MissionVision() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-center mb-8"
                >
                    What Drives Us
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-8 text-white"
                    >
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Our Vision
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                            MDC aims to provide abundant technical resources, facilitate peer discussions and contribute to the Opensource Community, fostering student upskilling and community growth.
                        </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-8 text-white"
                    >
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Our Mission
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                            MDC is an innovator's network, providing technical skill sharing, expert guidance and collaboration opportunities for developers. Members gain exposure to Opensource Technologies and excellent networking possibilities.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
