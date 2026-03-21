import { motion } from "framer-motion"

export default function History() {
    return (
        <section id="history" className="min-h-screen flex items-center px-6 py-20 max-w-5xl mx-auto">

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-5xl font-bold mb-12">
                    Our History
                </h2>

                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    Meta Developer Communities (MDC) at GITAM was founded with the vision
                    of building a strong developer culture within the campus. What started
                    as a small initiative to connect like-minded programmers has grown
                    into one of the most impactful technical communities in the university.
                </p>

                <p className="text-lg text-gray-400 leading-relaxed">
                    Through hackathons, workshops, collaborations and real-world
                    projects, MDC has consistently focused on hands-on learning and
                    innovation. The journey continues as we build developers who don’t
                    just learn technology — but create with it.
                </p>
            </motion.div>

        </section>
    )
}