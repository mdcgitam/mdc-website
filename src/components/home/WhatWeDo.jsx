import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const activities = [
    {
        id: "workshops",
        title: "Workshops",
        shortDesc: "Hands-on learning experiences.",
        description: "Dive deep into modern technologies with our interactive, hands-on workshops. Led by industry experts and experienced peers, these sessions are designed to take you from fundamentals to advanced implementations.",
        color: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50",
        icon: (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        img: "/WorkShop.jpg"
    },
    {
        id: "contests",
        title: "Coding Contests",
        shortDesc: "Compete, solve, and win.",
        description: "Challenge your problem-solving skills in our regular coding contests and hackathons. Compete with top minds, solve real-world algorithmic challenges, and push your limits in high-energy environments.",
        color: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50",
        icon: (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        img: "/CodingContest.jpg"
    },
    {
        id: "sessions",
        title: "Technical Sessions",
        shortDesc: "Expert talks and seminars.",
        description: "Stay ahead of the curve with insights from industry leaders and technical deep dives. Our sessions cover emerging trends, best practices, and innovative architectures shaping the future of tech.",
        color: "from-emerald-500 to-teal-600",
        bgLight: "bg-emerald-50",
        icon: (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        img: "/TechnicalSession.jpg"
    }
]

export default function WhatWeDo() {
    const [activeTab, setActiveTab] = useState(activities[0].id)

    const activeData = activities.find(a => a.id === activeTab)

    return (
        <section className="py-24 bg-white text-gray-900 relative overflow-hidden">
            {/* Soft decorative background element */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Do</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Empowering students through active learning, fierce competition, and industry insights.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                    {/* Left side - Interactive List */}
                    <div className="w-full lg:w-5/12 space-y-4">
                        {activities.map((activity, index) => {
                            const isActive = activeTab === activity.id
                            return (
                                <motion.button
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => setActiveTab(activity.id)}
                                    className={`w-full text-left p-6 rounded-3xl transition-all duration-300 relative overflow-hidden focus:outline-none ${isActive ? `bg-white shadow-xl shadow-gray-200/50 border border-gray-100 scale-[1.02]` : `bg-gray-50/50 hover:bg-gray-100 border border-transparent`
                                        }`}
                                >
                                    {/* Active border indicator */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 bg-gradient-to-b ${activity.color} ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

                                    <div className="flex items-center gap-5 ml-2">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${activity.color} ${isActive ? 'shadow-xl scale-110 ring-4 ring-white' : 'opacity-80'}`}>
                                            {activity.icon}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {activity.title}
                                            </h3>
                                            <p className={`text-sm mt-1 transition-colors ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {activity.shortDesc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Right side - Dynamic Content Display */}
                    <div className="w-full lg:w-7/12 mt-8 lg:mt-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative rounded-[2rem] overflow-hidden bg-gray-900 aspect-[4/3] lg:aspect-auto lg:h-[500px] shadow-2xl group"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={activeData.img}
                                        alt={activeData.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                </div>

                                {/* Gradient Overlay */}
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div> */}

                                {/* Content */}
                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4 bg-gradient-to-r ${activeData.color} shadow-lg`}>
                                            {activeData.title}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                            {activeData.shortDesc}
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                                            {activeData.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
