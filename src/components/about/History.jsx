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
        desc: "MDC continues to foster innovation through coding contests, hackathons, workshops and industry-oriented sessions, helping students build practical skills."
    }
]

export default function History() {
    return (
        <section className="pt-12 pb-6 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 md:px-20">

                {/* Heading */}
                <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Our Journey
                </h2>

                {/* Team Photo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto mb-12"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                        <img
                            src="/team-photo.jpg"
                            alt="MDC Team"
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            loading="lazy"
                        />
                        {/* Subtle gradient overlay at the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                </motion.div>

                <div className="relative">

                    {/* Vertical Line — centered on md+, left on mobile */}
                    <div className="absolute left-4 md:left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 md:transform md:-translate-x-1/2"></div>

                    <div className="space-y-8">
                        {timelineData.map((item, index) => {
                            const isLeft = index % 2 === 0

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className={`flex items-center w-full ${
                                        /* On mobile: always right of the line. On md+: alternate */
                                        ''
                                    } md:${isLeft ? 'justify-start' : 'justify-end'}`}
                                >

                                    {/* Mobile: single column, card to the right of line */}
                                    {/* Desktop: alternating left/right */}
                                    <div className={`
                                        w-full pl-12 md:pl-0 md:w-[45%]
                                        ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8 md:ml-auto'}
                                    `}>
                                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.03] hover:border-blue-200 transition-all duration-300 cursor-default">

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
                                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-600 border-4 border-white rounded-full shadow-md"></div>

                                </motion.div>

                            )
                        })}
                        <div className="flex justify-center mt-6">                            <p className="text-lg font-semibold text-gray-500 relative px-6 py-2 
                   bg-white rounded-full shadow-md border border-gray-200
                   before:absolute before:-left-6 before:top-1/2 before:w-6 before:h-[2px] before:bg-blue-400
                   after:absolute after:-right-6 after:top-1/2 after:w-6 after:h-[2px] after:bg-blue-400">
                            Many more to go
                        </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}