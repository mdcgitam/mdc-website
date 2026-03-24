import { motion } from "framer-motion"

export default function Mentors() {
    const mentors = [
        { name: "Prof. UmaDevi Kancharla", role: "Senior Director & Head - GCGC", img: "/mentors/umadevi.jpeg", linkedin: "https://www.linkedin.com/in/umadevi-kancharla-a712b8113/", email: "headgcgc@gitam.edu" },
        { name: "Dr. Rojeena Mathew", role: "Director - TMCG, GCGC", img: "/mentors/rojeena.JPG", linkedin: "https://www.linkedin.com/in/dr-rojeena-mathew/", email: "directortmcg_gcgc@gitam.edu" },
        { name: "Mr. Jitendra Dasari", role: "Assistant Manager", img: "/mentors/jitendra.jpeg", linkedin: "https://www.linkedin.com/in/jitendra-dasari-aa4368171/", email: "jdasari2@gitam.edu" },
    ]

    return (
        <div className="w-full">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Our Mentors
            </h2>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
                {mentors.map((mentor, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15, duration: 0.4 }}
                        whileHover={{ y: -10 }}
                        className="group relative w-full sm:w-[280px]"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-indigo-100/50 rounded-3xl blur-xl group-hover:bg-indigo-200/50 transition-colors duration-500"></div>

                        <div className="relative bg-white border border-gray-100 rounded-3xl p-6 text-center overflow-hidden h-full shadow-lg">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-full blur-[40px]"></div>

                            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-br from-indigo-400 to-purple-600">
                                <img
                                    src={mentor.img}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-white"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${mentor.name.split(' ').join('+')}&background=f3f4f6&color=4f46e5&size=150`
                                    }}
                                />
                            </div>

                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{mentor.name}</h3>
                            <p className="text-indigo-600 font-medium">{mentor.role}</p>

                            <div className="mt-6 flex justify-center gap-4">
                                {/* LinkedIn */}
                                {mentor.linkedin && (
                                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors" title="LinkedIn">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                )}
                                {/* Email */}
                                {mentor.email && (
                                    <a href={`mailto:${mentor.email}`} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Email">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}