import { motion } from "framer-motion"

const activities = [
    {
        id: "workshops",
        title: "Workshops",
        subtitle: "Hands-on learning experiences.",
        description: "Dive deep into modern technologies with our interactive, hands-on workshops. Led by industry experts and experienced peers, these sessions are designed to take you from fundamentals to advanced implementations.",
        color: "from-blue-500 to-indigo-600",
        accent: "bg-blue-500",
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        img: "/WorkShop.jpg"
    },
    {
        id: "contests",
        title: "Coding Contests",
        subtitle: "Compete, solve, and win.",
        description: "Challenge your problem-solving skills in our regular coding contests and hackathons. Compete with top minds, solve real-world algorithmic challenges and push your limits in high-energy environments.",
        color: "from-amber-500 to-orange-600",
        accent: "bg-amber-500",
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        img: "/CodingContest.jpg"
    },
    {
        id: "sessions",
        title: "Technical Sessions",
        subtitle: "Expert talks and seminars.",
        description: "Stay ahead of the curve with insights from industry leaders and technical deep dives. Our sessions cover emerging trends, best practices, and innovative architectures shaping the future of tech.",
        color: "from-emerald-500 to-teal-600",
        accent: "bg-emerald-500",
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        img: "/TechnicalSession.jpg"
    }
]

export default function WhatWeDo() {
    return (
        <section className="py-12 bg-white text-gray-900 relative overflow-hidden">
            {/* Soft decorative background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-50/30 to-emerald-50/30 rounded-full blur-3xl opacity-40 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Do</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Empowering students through active learning, fierce competition, and industry insights.
                    </p>
                </motion.div>

                {/* Scroll-triggered steps */}
                <div className="space-y-14 md:space-y-16">
                    {activities.map((activity, index) => {
                        const isEven = index % 2 === 1

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
                            >
                                {/* Image Side */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.7, delay: 0.15 }}
                                    className="w-full md:w-1/2"
                                >
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl group aspect-[4/3]">
                                        <img
                                            src={activity.img}
                                            alt={activity.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        {/* Soft corner glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
                                    </div>
                                </motion.div>

                                {/* Text Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: 0.25 }}
                                    className="w-full md:w-1/2"
                                >
                                    {/* Step indicator */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${activity.color} shadow-lg`}>
                                            {activity.icon}
                                        </div>
                                        {/* <div className={`h-[2px] w-8 bg-gradient-to-r ${activity.color} rounded-full`}></div> */}
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    {/* Badge */}
                                    <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4 bg-gradient-to-r ${activity.color} shadow-md`}>
                                        {activity.title}
                                    </div>

                                    {/* Subtitle */}
                                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                        {activity.subtitle}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {activity.description}
                                    </p>

                                    {/* Accent line */}
                                    {/* <div className={`mt-6 h-1 w-16 rounded-full bg-gradient-to-r ${activity.color} opacity-60`}></div> */}
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
