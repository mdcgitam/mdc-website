import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="relative pt-10 pb-8 border-t border-blue-100 bg-white overflow-hidden">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative z-10">
                {/* Brand Section */}
                <div>
                    <Link to="/" className="text-2xl font-bold tracking-widest flex items-center gap-2 mb-4">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MDC</span>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        Meta Developer Communities at GITAM. Empowering developers, building communities and fostering innovation.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-blue-700 font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link
                                to="/about"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/events"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                            >
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tenure"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                            >
                                Tenures
                            </Link>
                        </li>
                        <li>

                            <Link
                                to="/contact"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Connect + Contact Us Button */}
                <div>
                    <h3 className="text-blue-700 font-semibold mb-4">Connect</h3>
                    <div className="flex gap-4 mb-8">
                        {/* Instagram */}
                        <a href="https://www.instagram.com/mdc_gitam/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/meta-developer-communities/posts/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    <h3 className="text-blue-700 font-semibold mb-3">Interested in MDC?</h3>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Us
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-blue-100 pt-8 flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Meta Developer Communities - GITAM. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</a>
                </div>
            </div>

            {/* Background blur effects */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50/60 blur-[120px] pointer-events-none -z-10 rounded-full"></div>
        </footer>
    )
}