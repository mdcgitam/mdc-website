// Static site content. Events live in Firestore (see lib/events.js);
// team rosters live in tenureData.js.

export const SOCIALS = {
    instagram: "https://www.instagram.com/mdc_gitam/",
    linkedin: "https://www.linkedin.com/company/meta-developer-communities/posts/",
    github: "https://github.com/mdcgitam",
}

export const FOUNDED = 2023

// `key` matches the domain keys in tenureData.js and the `domain` field on events.
export const DOMAINS = [
    {
        key: "DataVerse",
        short: "DATA",
        color: "#9dbdff",
        img: "/showcase/dataverse.webp",
        name: "DataVerse",
        track: "Engineering",
        focus: "AI · ML · Data Science",
        desc: "Turning data into insight through statistical modelling, machine learning and deep learning.",
        snippet: "model.fit(X_train, y_train)",
    },
    {
        key: "WebArcs",
        short: "WEB",
        color: "#3ddc97",
        img: "/showcase/webarc.webp",
        name: "WebArc",
        track: "Engineering",
        focus: "Frontend · Full-stack",
        desc: "Building modern, responsive web applications with React, Node.js and whatever ships best.",
        snippet: "export default function App()",
    },
    {
        key: "CP",
        short: "CP",
        color: "#4a80ff",
        img: "/showcase/cp.webp",
        name: "Competitive Programming",
        track: "Engineering",
        focus: "Algorithms · Contests",
        desc: "Sharpening problem-solving through algorithmic challenges, contests and hackathons.",
        snippet: "// O(n log n), AC in 0.12s",
    },
    {
        key: "Design",
        short: "DSGN",
        color: "#ff7a59",
        img: "/showcase/design.webp",
        name: "Design",
        track: "Creative",
        focus: "UI/UX · Brand · Graphics",
        desc: "Interfaces, visuals and brand identity that make every MDC touchpoint feel considered.",
    },
    {
        key: "Content",
        short: "CNT",
        color: "#f5b454",
        img: "/showcase/content.webp",
        name: "Content",
        track: "Creative",
        focus: "Writing · Storytelling",
        desc: "Stories, blogs and copy that carry MDC's voice on campus and online.",
    },
    {
        key: "PR",
        short: "PR",
        color: "#c084fc",
        img: "/showcase/pr.webp",
        name: "Public Relations",
        track: "Creative",
        focus: "Outreach · Partnerships",
        desc: "Connecting MDC with students, clubs and industry through events and partnerships.",
    },
    {
        key: "Photography",
        short: "PHOTO",
        color: "#ff6b9d",
        img: "/showcase/photography.webp",
        name: "Photography",
        track: "Creative",
        focus: "Photo · Video",
        desc: "Documenting every event, late night and behind-the-scenes moment.",
    },
]

// How a member grows at MDC. Drives the pinned pipeline on the home page.
export const PIPELINE = [
    { key: "join", title: "Join", desc: "Orientation, first meetups and picking the domain that pulls you in.", img: "/showcase/join.webp" },
    { key: "learn", title: "Learn", desc: "Workshops and sessions that take you from zero to working code.", img: "/showcase/learn.webp" },
    { key: "build", title: "Build", desc: "Projects and hackathons where ideas turn into demos overnight.", img: "/showcase/build.webp" },
    { key: "compete", title: "Compete", desc: "Timed contests that sharpen speed, logic and nerve.", img: "/showcase/compete.webp" },
    { key: "lead", title: "Lead", desc: "Run a domain, host events and bring the next cohort through.", img: "/showcase/lead.webp" },
]

// Club milestones, oldest first. `turning` marks the moment MDC became independent.
export const HISTORY = [
    {
        date: "Jan 2023",
        title: "Meta Developer Circles comes to GITAM",
        desc: "Inaugurated at GITAM Visakhapatnam on 4 January to build a collaborative developer ecosystem for students.",
    },
    {
        date: "2023",
        title: "Eight technical domains",
        desc: "Members were organised into structured learning tracks so they could specialise and build together.",
    },
    {
        date: "Apr 2024",
        title: "Meta ends the program worldwide",
        desc: "On 27 April, Meta discontinued Developer Circles globally, closing university chapters everywhere.",
    },
    {
        date: "Jul 2024",
        turning: true,
        title: "We become Meta Developer Communities",
        desc: "Instead of dissolving, the student leadership chose to continue independently under a new name, and MDC was born.",
    },
    {
        date: "2024–25",
        title: "Seven focused domains",
        desc: "The structure was streamlined from eight domains to seven, with clearer ownership and more focused work.",
    },
    {
        date: "Today",
        title: "A student-run tech community",
        desc: "Contests, hackathons, workshops and industry sessions, all run end-to-end by students.",
    },
]

export const MISSION =
    "An innovator's network: technical skill-sharing, expert guidance and room to collaborate, with real exposure to open-source technology and the people who build it."

export const VISION =
    "Abundant technical resources, open peer discussion and real contributions to open source, so every member leaves more capable than they arrived."

export const FOUNDERS = [
    { name: "Gurumoorthy Gangadharan", role: "Founder", img: "/founders/gurumurthy.jpg", linkedin: "https://www.linkedin.com/in/ggurumoorthy", email: "ggmiitm@gmail.com" },
    { name: "Vikas B", role: "Founder", img: "/founders/Vikas.jpg", linkedin: "https://www.linkedin.com/in/vikas-b-6a4476171/", email: "vikasboddu30@gmail.com" },
]

export const MENTORS = [
    { name: "Dr. Rojeena Mathew", role: "Director — TMCG, GCGC", img: "/mentors/rojeena.JPG", linkedin: "https://www.linkedin.com/in/dr-rojeena-mathew/", email: "directortmcg_gcgc@gitam.edu" },
    { name: "Mr. Jitendra Dasari", role: "Assistant Manager", img: "/mentors/jitendra.jpeg", linkedin: "https://www.linkedin.com/in/jitendra-dasari-aa4368171/", email: "jdasari2@gitam.edu" },
]

// Current Executive Board: the people to contact.
export const CURRENT_BOARD_YEAR = "2026-27"
export const CURRENT_BOARD = [
    { name: "Mohan Tanuj", role: "President", email: "mponasan@gitam.in", linkedin: "https://www.linkedin.com/in/vnr-Tanuj/", phone: "+91 9347344965", img: "/26_27/EB_26-27/Tanuj.jpeg" },
    { name: "Hasini", role: "Vice President", email: "hdandu2@gitam.in", linkedin: "https://www.linkedin.com/in/hasini-dandu", phone: "+91 6305327994", img: "/26_27/EB_26-27/Hasini.jpg" },
    { name: "Tanishq", role: "Secretary", email: "tkundrap@student.gitam.edu", linkedin: "https://www.linkedin.com/in/tanishqkundrapu", phone: "+91 9652177526", img: "/26_27/EB_26-27/Tanishq.jpeg" },
    { name: "Srinivas", role: "Head of Operations", email: "skatrag1@student.gitam.edu", linkedin: "https://www.linkedin.com/in/srinivaskatragaddak", phone: "+91 6302655976", img: "/26_27/EB_26-27/Srinivas.jpg" },
    { name: "Akash Kishan", role: "Technical Head", email: "akarri4@gitam.in", linkedin: "http://www.linkedin.com/in/akashkishankarri", phone: "+91 8374849797", img: "/26_27/EB_26-27/Akash.png" },
    { name: "Likhita", role: "Creative Head", email: "lmannem@student.gitam.edu", linkedin: "https://www.linkedin.com/in/likhita-mannem/", phone: "+91 9849497687", img: "/26_27/EB_26-27/Likhita.jpg" },
]

export const NAV = [
    { label: "About", to: "/about" },
    { label: "Domains", to: "/domains" },
    { label: "Events", to: "/events" },
    { label: "Team", to: "/team" },
    { label: "Contact", to: "/contact" },
]

export const gmailCompose = (email) => `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`
