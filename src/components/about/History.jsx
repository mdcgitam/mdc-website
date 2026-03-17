import { motion } from "framer-motion"

const timelineData = [
    {
        title: "January 2023",
        subtitle: "Community Inception",
        desc: "Meta Developer Circles was inaugurated at GITAM Visakhapatnam on January 4, 2023, aiming to build a collaborative developer ecosystem for students through workshops, hackathons and peer-driven learning."
    },
    {
        title: "2023",
        subtitle: "Building the Developer Ecosystem",
        desc: "As part of the global Meta Developer Circles network, the community introduced structured learning initiatives and organized students into 8 technical domains to encourage specialization and collaborative innovation."
    },
    {
        title: "April 2024",
        subtitle: "Global Program Closure",
        desc: "On April 27, 2024, Meta officially discontinued the Meta Developer Circles program worldwide, impacting university communities across regions."
    },
    {
        title: "July 2024",
        subtitle: "Rebranding to MDC",
        desc: "Rather than dissolving the community, the student leadership chose to continue independently and rebranded the organization as Meta Developer Communities (MDC), preserving its mission."
    },
    {
        title: "2024-25",
        subtitle: "Structural Evolution",
        desc: "The organization refined its internal structure by streamlining domains from 8 to 7, improving coordination and creating more focused technical engagement."
    },
    {
        title: "Present",
        subtitle: "A Student-Driven Tech Community",
        desc: "MDC continues to foster innovation through coding contests, hackathons, workshops, and industry-oriented sessions, helping students build practical skills."
    }
]

export default function History() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6">

                {/* Heading */}
                <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Our Journey
                </h2>

                <div className="relative">

                    {/* Vertical Line */}
                    <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 transform -translate-x-1/2"></div>

                    <div className="space-y-10">
                        {timelineData.map((item, index) => {
                            const isLeft = index % 2 === 0

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className={`flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
                                >

                                    {/* Card */}
                                    <div className={`w-[45%] ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">

                                            <h3 className="text-blue-600 font-bold text-sm mb-1">
                                                {item.title}
                                            </h3>

                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                {item.subtitle}
                                            </h4>

                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Circle */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-600 border-4 border-white rounded-full shadow-md"></div>

                                </motion.div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}