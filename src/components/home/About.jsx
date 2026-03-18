import { motion } from "framer-motion"

export default function About() {
    return (
        <section className="py-32 px-6 max-w-5xl mx-auto">

            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-8"
            >
                About MDC
            </motion.h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Meta Developer Communities (MDC) at GITAM is a student-driven
                technical club focused on empowering developers through hands-on
                learning, hackathons, workshops and real-world projects.
            </p>

            <div className="grid md:grid-cols-3 gap-12 text-gray-400">

                <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        History
                    </h3>
                    <p>
                        Established with a vision to nurture innovation and technical
                        excellence across the campus.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">
                        Founders
                    </h3>
                    <p>
                        Student leaders who believed in building a real development
                        ecosystem beyond classrooms.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-4">
                        Mentors
                    </h3>
                    <p>
                        Faculty and industry experts guiding members toward impactful
                        technical growth.
                    </p>
                </div>

            </div>

        </section>
    )
}