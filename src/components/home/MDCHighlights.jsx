import { motion } from "framer-motion"

// Highly animated domain icon components
const DomainAnimatedIcons = {
    DataVerse: () => (
        <div className="relative w-8 h-8 flex items-end justify-center gap-[3px] pb-1">
            {[35, 65, 45, 80, 55].map((h, i) => (
                <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.2}%`, `${h}%`, `${h * 0.2}%`] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                    className="w-[4px] bg-white/90 rounded-t-sm origin-bottom"
                    style={{ minHeight: 3 }}
                />
            ))}
            <motion.svg
                className="absolute -top-0.5 left-0 w-full h-full"
                viewBox="0 0 32 32"
                fill="none"
            >
                <motion.path
                    d="M2 28 L8 18 L14 22 L20 10 L26 14 L30 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.svg>
            <motion.div
                animate={{ scale: [0, 1, 0], y: [-2, -8], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-0 right-1 w-1.5 h-1.5 bg-white rounded-full"
            />
        </div>
    ),
    WebArcs: () => (
        <div className="relative w-8 h-8">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            >
                <div className="absolute inset-0 border-2 border-white/70 rounded-full" />
                <motion.div
                    animate={{ scale: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-1 border-2 border-white/50 rounded-full"
                />
            </motion.div>
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-2 bg-white/30 rounded-full"
            />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/40 -translate-x-1/2" />
            {[0, 1, 2, 3].map(i => (
                <motion.div
                    key={i}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        top: `${50 + 35 * Math.sin(i * Math.PI / 2)}%`,
                        left: `${50 + 35 * Math.cos(i * Math.PI / 2)}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}
        </div>
    ),
    CP: () => (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <motion.span
                animate={{ x: [-2, -5, -2], color: ["rgba(255,255,255,0.7)", "rgba(255,255,255,1)", "rgba(255,255,255,0.7)"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono font-bold text-lg leading-none"
            >{"<"}</motion.span>
            <motion.span
                animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-white/80 font-mono text-sm mx-0.5"
            >/</motion.span>
            <motion.span
                animate={{ x: [2, 5, 2], color: ["rgba(255,255,255,0.7)", "rgba(255,255,255,1)", "rgba(255,255,255,0.7)"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono font-bold text-lg leading-none"
            >{">"}</motion.span>
            {/* Cursor blink */}
            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-white/90"
            />
            {/* Floating brackets */}
            {[0, 1].map(i => (
                <motion.div
                    key={i}
                    animate={{ y: [-3, -10], opacity: [0.8, 0], x: [0, i === 0 ? -4 : 4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
                    className="absolute top-0 text-[8px] text-white/60 font-mono"
                >{i === 0 ? "{" : "}"}</motion.div>
            ))}
        </div>
    ),
    Content: () => (
        <div className="relative w-8 h-8">
            <motion.div
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </motion.div>
            {/* Writing lines animation */}
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    animate={{ width: ["0%", "100%", "0%", "0%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    className="absolute h-[1.5px] bg-white/50 rounded-full"
                    style={{ bottom: `${4 + i * 4}px`, left: "2px", maxWidth: "calc(100% - 4px)" }}
                />
            ))}
        </div>
    ),
    Design: () => (
        <div className="relative w-8 h-8">
            {/* Brush */}
            <motion.div
                animate={{ x: [-4, 4, -4], rotate: [-15, 15, -15] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            </motion.div>
            {/* Paint splashes */}
            {[
                { color: "bg-pink-300", delay: 0, x: -2, y: -3 },
                { color: "bg-yellow-300", delay: 0.5, x: 5, y: 1 },
                { color: "bg-green-300", delay: 1.0, x: 0, y: 5 },
                { color: "bg-blue-300", delay: 1.5, x: -4, y: 2 },
            ].map((s, i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 0.9, 0],
                        x: [0, s.x * 2],
                        y: [0, s.y * 2],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: s.delay }}
                    className={`absolute w-2 h-2 rounded-full ${s.color}`}
                    style={{ top: "50%", left: "50%" }}
                />
            ))}
        </div>
    ),
    PR: () => (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <motion.div
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            </motion.div>
            {/* Sound waves */}
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    animate={{
                        width: [4, 12 + i * 4],
                        height: [4, 12 + i * 4],
                        opacity: [0.9, 0],
                        borderWidth: [2, 0.5],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.35 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 border-white rounded-full"
                    style={{ borderStyle: "solid" }}
                />
            ))}
        </div>
    ),
    Photography: () => (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <motion.div
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </motion.div>
            {/* Flash effect */}
            <motion.div
                animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                className="absolute top-0 right-0.5 w-3 h-3 bg-yellow-200 rounded-full"
            />
            {/* Shutter animation */}
            <motion.div
                animate={{ scale: [1, 0.3, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.2 }}
                className="absolute inset-2.5 bg-white/20 rounded-full"
            />
        </div>
    ),
}

const domains = [
    {
        title: "DataVerse",
        desc: "AI, ML & Data Science — Turning data into insights through statistical modeling, machine learning and deep learning.",
        color: "from-purple-500 to-indigo-600",
        IconComponent: DomainAnimatedIcons.DataVerse,
    },
    {
        title: "WebArcs",
        desc: "Frontend & Fullstack Development — Building modern, responsive web applications using React, Node.js and beyond.",
        color: "from-cyan-500 to-blue-600",
        IconComponent: DomainAnimatedIcons.WebArcs,
    },
    {
        title: "CP",
        desc: "Competitive Programming — Sharpening problem-solving skills through algorithmic challenges and coding contests.",
        color: "from-amber-500 to-orange-600",
        IconComponent: DomainAnimatedIcons.CP,
    },
    {
        title: "Content",
        desc: "Content Creation & Writing — Crafting compelling stories, blogs and copy that represent MDC's voice.",
        color: "from-emerald-500 to-teal-600",
        IconComponent: DomainAnimatedIcons.Content,
    },
    {
        title: "Design",
        desc: "UX/UI & Graphic Design — Creating stunning visuals, interfaces and brand identities that leave an impact.",
        color: "from-pink-500 to-rose-600",
        IconComponent: DomainAnimatedIcons.Design,
    },
    {
        title: "PR",
        desc: "Public Relations & Outreach — Connecting MDC with the world through events, partnerships and communication.",
        color: "from-violet-500 to-purple-600",
        IconComponent: DomainAnimatedIcons.PR,
    },
    {
        title: "Photography",
        desc: "Photography & Videography — Documenting moments, events and behind-the-scenes stories visually.",
        color: "from-teal-500 to-cyan-600",
        IconComponent: DomainAnimatedIcons.Photography,
    },
]

export default function MDCHighlights() {
    return (
        <section className="py-8 bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                            What We Do
                        </h2>
                        <p className="text-gray-600 max-w-xl text-lg">
                            We bridge the gap between academia and industry through hands-on tracks specializing in the latest technologies.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {domains.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            whileHover={{ y: -6 }}
                            className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300"
                        >
                            {/* Top gradient bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`}></div>

                            <div className="p-6 flex flex-col items-center text-center">
                                {/* Icon — highly animated */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                                    <item.IconComponent />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>

                                {/* Desc */}
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}