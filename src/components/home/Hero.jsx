import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section className="relative min-h-[80vh] flex items-center bg-gray-50 overflow-hidden py-10">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-20">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-200/50 text-blue-600 text-sm font-semibold mb-8 backdrop-blur-md shadow-sm"
                    >
                        {/* <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span>Empowering GITAMites</span> */}
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-gray-900">
                        Meta <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-2">
                            Developer Communities
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed font-normal">
                        A student-led technical ecosystem focused on innovation,
                        collaboration and forging the next generation of real-world developers.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/about">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.4)] transition-all duration-300"
                            >
                                Explore MDC
                            </motion.button>
                        </Link>

                        <Link to="/events">
                            <motion.button
                                whileHover={{ backgroundColor: "rgba(243,244,246,1)", y: -2 }}
                                className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
                            >
                                View Events
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Floating Elements (3D abstract composition) */}
                <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-20"
                    />

                    {/* Main floating card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="absolute top-20 left-10 w-90 h-80 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 p-[1px] shadow-sm">
                                <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center border border-blue-100">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                        </div>

                        {/* NEW TOP TEXT */}
                        <div className="text-xl font-mono font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Empowering Innovators of Tomorrow
                        </div>

                        <div>
                            <div className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                {"print(\"Welcome to MDC\")"}
                            </div>
                            {/* <div className="h-2 w-1/3 bg-gray-200 rounded-full mb-3"></div> */}
                        </div>
                    </motion.div>

                    {/* Secondary floating card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: [0, 15, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.6,
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                        }}
                        className="absolute bottom-20 right-0 w-64 h-48 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-5"
                    >
                        <div className="flex gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400">~</span>
                                <span className="text-gray-300">npm run build</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400">~</span>
                                <span className="text-green-400">Compiled successfully!</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-gray-400 tracking-widest font-semibold uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center p-1"
                >
                    <div className="w-1 h-2 bg-blue-500 rounded-full"></div>
                </motion.div>
            </motion.div> */}

        </section>
    )
}