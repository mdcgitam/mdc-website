import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Domain Icons identical to previous highlights for consistency
const DomainIcons = {
    DataVerse: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    WebArcs: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    CP: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    Content: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Design: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    PR: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
    ),
    Photography: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

const allDomains = [
    {
        title: "DataVerse",
        category: "Technical",
        desc: "AI, ML & Data Science Turning data into insights through statistical modeling, machine learning and deep learning.",
        color: "from-purple-500 to-indigo-600",
        IconComponent: DomainIcons.DataVerse,
    },
    {
        title: "WebArc",
        category: "Technical",
        desc: "Frontend & Fullstack Development Building modern, responsive web applications using React, Node.js and beyond.",
        color: "from-cyan-500 to-blue-600",
        IconComponent: DomainIcons.WebArcs,
    },
    {
        title: "Competitive Programming",
        category: "Technical",
        desc: "Competitive Programming Sharpening problem-solving skills through algorithmic challenges and coding contests.",
        color: "from-amber-500 to-orange-600",
        IconComponent: DomainIcons.CP,
    },
    {
        title: "Content",
        category: "Non-Technical",
        desc: "Content Creation & Writing Crafting compelling stories, blogs and copy that represent MDC's voice.",
        color: "from-emerald-500 to-teal-600",
        IconComponent: DomainIcons.Content,
    },
    {
        title: "Design",
        category: "Non-Technical",
        desc: "UX/UI & Graphic Design Creating stunning visuals, interfaces and brand identities that leave an impact.",
        color: "from-pink-500 to-rose-600",
        IconComponent: DomainIcons.Design,
    },
    {
        title: "Public Relations",
        category: "Non-Technical",
        desc: "Public Relations & Outreach Connecting MDC with the world through events, partnerships and communication.",
        color: "from-violet-500 to-purple-600",
        IconComponent: DomainIcons.PR,
    },
    {
        title: "Photography",
        category: "Non-Technical",
        desc: "Photography & Videography — Documenting moments, events and behind-the-scenes stories visually.",
        color: "from-teal-500 to-cyan-600",
        IconComponent: DomainIcons.Photography,
    },
]

export default function Domains() {
    const [activeCategory, setActiveCategory] = useState("Technical")

    const categories = ["Technical", "Non-Technical"]

    // Filter domains based on the active category
    const filteredDomains = allDomains.filter(domain => domain.category === activeCategory)

    return (
        <section className="py-12 bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Domains</span>
                    </h2>

                    {/* Category Toggle */}
                    <div className="inline-flex bg-white border border-gray-200 p-1.5 rounded-full shadow-sm">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 focus:outline-none ${activeCategory === cat ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="pill"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Animated Grid of Domains */}
                <div>
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 justify-center"                        >
                            {filteredDomains.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    whileHover={{ y: -6 }}
                                    className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col"
                                >
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`}></div>

                                    <div className="p-8 flex flex-col items-center text-center flex-1">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <item.IconComponent />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed mt-auto">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    )
}