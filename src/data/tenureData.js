// Tenure data configuration
// Maps year -> domains -> members (with photo paths in public folder)
// To add members: place photos in the corresponding public folder and add entries here

const domainColors = {
    EB: { bg: "from-blue-600 to-indigo-600", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    WebArcs: { bg: "from-cyan-500 to-blue-600", light: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    DataVerse: { bg: "from-purple-500 to-indigo-600", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    CP: { bg: "from-amber-500 to-orange-600", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Content: { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    Design: { bg: "from-pink-500 to-rose-600", light: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
    PR: { bg: "from-violet-500 to-purple-600", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    Photography: { bg: "from-teal-500 to-cyan-600", light: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    ARVR: { bg: "from-red-500 to-orange-600", light: "bg-red-50", text: "text-red-700", border: "border-red-200" },
}

const domainLabels = {
    EB: "Executive Board",
    WebArcs: "WebArc",
    DataVerse: "DataVerse",
    CP: "Competitive Programming",
    Content: "Content",
    Design: "Design",
    PR: "Public Relations",
    Photography: "Photography",
    ARVR: "AR / VR",
}

// Helper: build image path from folder convention
// e.g., year "2025-26", folderPrefix "25_26", domain "EB" → "/25_26/EB_25-26/NAME.jpg"
function buildPath(folderPrefix, domain, yearSuffix, name, ext = "jpg") {
    return `/${folderPrefix}/${domain}_${yearSuffix}/${name}.${ext}`
}

const tenureData = {
    "2025-26": {
        folderPrefix: "25_26",
        yearSuffix: "25-26",
        domains: ["EB", "DataVerse", "WebArcs", "CP", "Content", "Design", "PR", "Photography"],
        members: {
            EB: [
                { name: "VINNAKOTA NITISH RAJ", role: "President", phone: "+91 98765 43210", email: "nvinnako2@gitam.in", linkedin: "https://www.linkedin.com/in/nitish-raj-v-b67484279" },
                { name: "RACHAKONDA V S S GAGAN", role: "Vice President", phone: "+91 98765 43211", email: "grachako2@gitam.in", linkedin: "https://www.linkedin.com/in/gaganrachakonda" },
                { name: "SNEHAL ANDAVARAPU", role: "Secretary", ext: "jpg", phone: "+91 98765 43212", email: "sandavar@gitam.in", linkedin: "https://www.linkedin.com/in/snehal-andavarapu-83b3b5293" },
                { name: "PALLA JOTHISK NANDAN", role: "Head of Operations", phone: "+91 98765 43213", email: "jpalla2@gitam.in", linkedin: "https://www.linkedin.com/in/jothisk-nandan-palla-121368293" },
                { name: "SRAVANI KALISETTY", role: "Creative Head", phone: "+91 98765 43214", email: "skaliset@gitam.in", linkedin: "https://www.linkedin.com/in/sravani-kalisetty-090730293" },
                { name: "ISHITA GUPTA", role: "Technical Head", phone: "+91 98765 43215", email: "igupta@gitam.in", linkedin: "https://www.linkedin.com/in/ishitagupta0811/" },
            ],
            WebArcs: [
                { name: "PONASANAPALLI MOHAN TANUJ", role: "Lead", email: "mponasan@gitam.in", linkedin: "https://www.linkedin.com/in/mohan-tanuj-09b4221a0" },
                { name: "PANANGIPALLI ABHISHIEK", role: "Member", email: "apanangi@gitam.in", linkedin: "http://www.linkedin.com/in/abhishiek-panangipalli" },
                { name: "KONA SUMANTTH", role: "Member", email: "skona5@gitam.in", linkedin: "https://www.linkedin.com/in/sumantth-kona-049b9932a/" },
                { name: "SHREYASH MASTOLI", role: "Member", email: "smastoli@gitam.in", linkedin: "https://www.linkedin.com/in/shreyash-mastoli-157997285" },
                { name: "KARRI AKASH KISHAN", role: "Member", email: "akarri4@gitam.in", linkedin: "https://www.linkedin.com/in/akash-kishan-karri-0b6165293/" },
                { name: "MOHAMED MAHABOOB ALI", role: "Member", email: "mmohamed@student.gitam.edu", linkedin: "https://www.linkedin.com/in/mohamed-mahaboob-ali-900198345" },
                { name: "GANNE ROHAN", role: "Member", email: "rganne@student.gitam.edu", linkedin: "https://www.linkedin.com/in/rohan-ganne-266082318" },
                { name: "PILLA PRAVEEN", role: "Member", email: "ppilla@student.gitam.edu", linkedin: "https://www.linkedin.com/in/praveen-pilla-273086383" },
            ],
            DataVerse: [
                { name: "DANDU HASINI", role: "Lead", email: "hdandu2@gitam.in", linkedin: "https://www.linkedin.com/in/hasini-dandu-341234293" },
                { name: "AKI SRI HARSHA", role: "Member", email: "saki@gitam.in", linkedin: "http://linkedin.com/in/harsha-aki-0001ab36a" },
                { name: "MATHALA SAI SINDHUJA", ext: "jpg", role: "Member", email: "smathala@gitam.in", linkedin: "https://www.linkedin.com/in/saisindhuja23" },
                { name: "KORADA CHANDANA PRIYA", role: "Member", email: "ckorada@gitam.in", linkedin: "https://www.linkedin.com/in/kchandanapriya/" },
                { name: "PALAPARTHI VENKATA VIKAS", role: "Member", email: "vpalapar@gitam.in", linkedin: "https://www.linkedin.com/in/palaparthi-venkata-vikas-04bb611b2" },
                { name: "KORUPALLI SAI NAVYA SRI", role: "Member", email: "skorupal@student.gitam.edu", linkedin: "https://www.linkedin.com/in/sai-navya-sri-korupalli-5034a3298" },
            ],
            CP: [
                { name: "KUNDRAPU TANISHQ", role: "Lead", email: "tkundrap@student.gitam.edu", linkedin: "https://www.linkedin.com/in/tanishqkundrapu" },
                { name: "MOMMINEEDI NAVYASREE DURGA", role: "Member", email: "nmommine@gitam.in", linkedin: "https://www.linkedin.com/in/navyasree-durga-mommineedi-62217228a" },
                { name: "GAJJALA JASWITHA REDDY", role: "Member", email: "jgajjala@student.gitam.edu", linkedin: "https://www.linkedin.com/in/jaswitha-reddy-gajjala-b36908320" },
                { name: "DADI DIVYA SREE", role: "Member", email: "ddadi2@student.gitam.edu", linkedin: "https://www.linkedin.com/in/dadidivyasree/" },
                { name: "AYYAGARI RAHUL NIYOGI", role: "Member", email: "rayyagar@student.gitam.edu", linkedin: "https://www.linkedin.com/in/rahul-ayyagari/" },
                { name: "D BHARGAVI", role: "Member", email: "bdevired@student.gitam.edu", linkedin: "https://www.linkedin.com/in/bhargavi-reddy-55627b372" },
            ],
            Content: [
                { name: "KANTIPUDI SAI PRANEETHA", role: "Lead", email: "pkantipu@gitam.in", linkedin: "https://www.linkedin.com/in/praneethakamesh" },
                { name: "IPPILI SAI PHANENDRA", role: "Member", email: "sippili6@gitam.in", linkedin: "https://www.linkedin.com/in/sai-phanindra-ippili-a92148293" },
                { name: "SIRAVURI LASYA VARMA", role: "Member", ext: "png", email: "lsiravur@gitam.in", linkedin: "https://www.linkedin.com/in/lasya-varma-5949a9279/" },
                { name: "POOSAPATI RAINA SAI SREE", role: "Member", email: "rpoosapa@gitam.in", linkedin: "https://www.linkedin.com/in/raina-poosapati-bb149b293" },
            ],
            Design: [
                { name: "ALLU SATYA SAMEEKSHA", role: "Lead", email: "sallu2@gitam.in", linkedin: "https://www.linkedin.com/in/sameeksha-allu-023579273" },
                { name: "SAMUEL VAIBHAV RAGAM", role: "Lead", email: "sragam@gitam.in", linkedin: "https://www.linkedin.com/in/samuel-vaibhav-ragam-77a8a932b" },
                { name: "ANANTHAPU RESHWANTH", role: "Member", email: "ranantha@gitam.in", linkedin: "https://in.linkedin.com/in/reshwanth-ananthapu-78b1b4342" },
                { name: "GANDI GNANA PRASOONA", role: "Member", email: "ggandi2@gitam.in", linkedin: "https://www.linkedin.com/in/gnanaprasoonagandi" },
                { name: "AFREEN NAAZ ALI", role: "Member", email: "aali2@student.gitam.edu", linkedin: "https://www.linkedin.com/in/afreen-naaz-ali-6bb47b331" },
            ],
            PR: [
                { name: "MOTAPARTHI JANAKI SAI SAMANVITHA", ext: "jpg", role: "Lead", email: "jmotapar@gitam.in", linkedin: "https://www.linkedin.com/in/motaparthi-janaki-sai-samanvitha-201242293" },
                { name: "JAMMU JASSMITHA", role: "Member", email: "jjammu@gitam.in", linkedin: "https://www.linkedin.com/in/jassmitha-jammu" },
                { name: "PENUGONDA MANMAYI", role: "Member", email: "mpenugon3@gitam.in", linkedin: "https://www.linkedin.com/in/manmayi-penugonda-5a4149293" },
                { name: "BUDDHA TANVI", role: "Member", email: "tbuddha@gitam.in", linkedin: "https://www.linkedin.com/in/tanvi-buddha" },
                { name: "POSAM ADRIJA", role: "Member", email: "aposam@student.gitam.edu", linkedin: "https://www.linkedin.com/in/adrija-posam-44b055370" },
                { name: "PIA SOLANKI JAIN", ext: "jpg", role: "Member", email: "ssolanki@student.gitam.edu", linkedin: "https://www.linkedin.com/in/pia-solanki-jain-882908311" },
            ],
            Photography: [
                { name: "AMBATI HARI NAGA TEJA", role: "Lead", email: "tambati2@gitam.in", linkedin: "https://www.linkedin.com/in/teja-a-841b43293" },
                { name: "ANNABATHULA JAABILY SRILEKHA", role: "Member", email: "jannabat@gitam.in", linkedin: "https://www.linkedin.com/in/jaabily-srilekha-400366293" },
                { name: "ANUKRITI TEEGALA", role: "Member", email: "ateegala@gitam.in", linkedin: "https://www.linkedin.com/in/anukriti-teegala-1314152bb" },
                { name: "SWAMIREDDY PAVAN DURGA KARTHIK", role: "Member", email: "pswamire@gitam.in", linkedin: "https://www.linkedin.com/in/karthikswamireddy25" },
                { name: "PALURU ARAVIND KUMAR", role: "Member", email: "apaluru@gitam.in", linkedin: "https://www.linkedin.com/in/aravind1554" },
            ],
        },
    },
    "2024-25": {
        folderPrefix: "24_25",
        yearSuffix: "24-25",
        domains: ["EB", "DataVerse", "WebArcs", "CP", "Content", "Design", "PR", "Photography"],
        members: {
            EB: [
                { name: "Baishali Baruah", ext: "png", role: "Creative Head", email: "bbaruah@gitam.in", phone: "+91 8106403930", linkedin: "https://www.linkedin.com/in/baishali-baruah-b84022261/" },
                { name: "Katari Revanth Kumar Chowdary", role: "President", email: "rkatari@gitam.in", phone: "+91 7670841281", linkedin: "https://www.linkedin.com/in/revanthkatari" },
                { name: "Khushi Bohra", role: "Technical Head", email: "kbohra@gitam.in", phone: "+91 6301427521", linkedin: "https://www.linkedin.com/in/khushi-bohra-357baa281/" },
                { name: "Nadamuni Venkata Sai Dhruv", ext: "jpeg", role: "Vice President", email: "vnadamun@gitam.in", phone: "+91 9000962938", linkedin: "https://www.linkedin.com/in/dhruvnvs" },
                { name: "Phaniharam Suraj Subramaniam", role: "Head of Operations", email: "sphaniha@gitam.in", phone: "+91 9010390690", linkedin: "https://www.linkedin.com/in/phaniharam-suraj-subramaniam" },
                { name: "Vinnakota Nitish Raj", role: "Secretary", email: "nvinnako2@gitam.in", phone: "+91 6304003099", linkedin: "https://www.linkedin.com/in/vnr-nitish/" },
            ],
            WebArcs: [
                { name: "Sudheer Sahu", role: "Lead", email: "ssahu3@gitam.in", phone: "+91 9346299230", linkedin: "https://www.linkedin.com/in/sudheer-sahu-97881824b" },
                { name: "Velaga Doondi Sampreetha", role: "Member", email: "dvelaga@gitam.in", phone: "+91 7013445393", linkedin: "https://www.linkedin.com/me" },
                { name: "Koyena Dutta", role: "Member", email: "kdutta@gitam.in", phone: "+91 9508541252", linkedin: "https://www.linkedin.com/in/koyena-dutta-6b8bb5250" },
                { name: "Padipurakkal Namish", role: "Member", email: "npadipur@gitam.in", phone: "+91 9110567207", linkedin: "https://www.linkedin.com/in/namish-p-69a59b272" },
                { name: "Ponasanapalli Mohan Tanuj", ext: "jpeg", role: "Member", email: "mponasan@gitam.in", phone: "+91 9347344965", linkedin: "https://www.linkedin.com/in/mohan-tanuj-09b4221a0" },
                { name: "Snehal Andavarapu ", role: "Lead", email: "sandavar@gitam.in", phone: "+91 8917562924", linkedin: "https://www.linkedin.com/in/snehal-andavarapu-83b3b5293" },
                { name: "Putti Pallav Sai Teja", ext: "jpeg", role: "Member", email: "pputti@gitam.in", phone: "+91 9014552799", linkedin: "https://www.linkedin.com/in/pallav-sai-teja-b3000326b" },
                { name: "Dhruv Sivan", role: "Member", email: "dsivan@student.gitam.edu", phone: "+91 9392680291", linkedin: "https://www.linkedin.com/in/dhruv-sivan-54232a324" },
            ],
            DataVerse: [
                { name: "Yash Karnani", role: "Lead", email: "ykarnani@gitam.in", phone: "+91 9960133283", linkedin: "https://www.linkedin.com/in/ykarnani07/" },
                { name: "Raj Kunwar", role: "Member", email: "rkunwar@gitam.in", phone: "+91 7815856991", linkedin: "https://www.linkedin.com/in/raj-kunwar25" },
                { name: "Mansi Singh", role: "Member", email: "msingh8@gitam.in", phone: "+91 7799914141", linkedin: "https://www.linkedin.com/in/mansi-singh-rajput-755332257" },
                { name: "Mathala Sai Sindhuja", ext: "jpg", role: "Member", email: "smathala@gitam.in", phone: "+91 9000230538", linkedin: "https://www.linkedin.com/in/sai-sindhuja-998682293" },
                { name: "Marupudi Ritvik ", ext: "jpg", role: "Member", email: "rmarupud@gitam.in", phone: "+91 7397266012", linkedin: "https://www.linkedin.com/in/marupudi-ritvik-38613a293" },
                { name: "Palla Jothisk Nandan", role: "Member", email: "jpalla2@gitam.in", phone: "+91 6304110542", linkedin: "https://www.linkedin.com/in/jothisk-nandan-palla-121368293" },
            ],
            CP: [
                { name: "Cherukupalli Ravali Sree Harshini ", role: "Lead", email: "rcheruku2@gitam.in", phone: "+91 8688421446", linkedin: "https://www.linkedin.com/in/ravali-sree-harshini-cherukupalli-979310250" },
                { name: "Rachakonda V S S Gagan", ext: "jpeg", role: "Member", email: "grachako2@gitam.in", phone: "+91 8978082388", linkedin: "https://www.linkedin.com/in/gaganrachakonda" },
                { name: "Manchem Manmohan", role: "Member", email: "mmanchem@gitam.in", phone: "+91 8977002998", linkedin: "https://www.linkedin.com/in/manmohan-manchem" },
                { name: "Lokdeep Adimulam", role: "Member", email: "ladimula@gitam.in", phone: "+91 8886953136", linkedin: "https://www.linkedin.com/in/adimulam-lokdeep" },
                { name: "Mohith Pilli", role: "Member", email: "mpilli4@gitam.in", phone: "+91 9831146899" },
                { name: "Ankita M Kumar ", role: "Member", email: "akumar8@student.gitam.edu", phone: "+91 8800729399", linkedin: "https://www.linkedin.com/in/ankita-m-kumar-b6a624327" },
            ],
            Content: [
                { name: "Sai Praseeda Atluri ", role: "Lead", email: "satluri3@gitam.in", phone: "+91 9182896723", linkedin: "https://www.linkedin.com/in/saipraseedaatluri" },
                { name: "Battula Karthikeya", ext: "jpeg", role: "Member", email: "kbattula3@gitam.in", phone: "+91 9014920104", linkedin: "https://www.linkedin.com/in/karthikeya-battula-46290pr" },
                { name: "Challa Venkata Anirudh", role: "Member", email: "vchalla3@gitam.in", phone: "+91 7675822599", linkedin: "https://www.linkedin.com/in/challa-venkata-anirudh-2607s/" },
                { name: "Yarlagadda Abhiram", role: "Member", email: "ayarlaga2@gitam.in", phone: "+91 9063313555", linkedin: "https://www.linkedin.com/in/y-abhiram" },
                { name: "Mogasala Sunaina", role: "Member", email: "msunaina@gitam.in", phone: "+91 9912893959", linkedin: "https://www.linkedin.com/in/sunaina-mogasala-70582b293" },
            ],
            Design: [
                { name: "Kesapragada Surya Sanjana", role: "Lead", email: "skesapra@gitam.in", phone: "+91 8331048428", linkedin: "https://www.linkedin.com/in/surya-sanjana-kesapragada" },
                { name: "Penmatsa Sathwika", role: "Member", email: "spenmats2@gitam.in", phone: "+91 9618136294", linkedin: "https://www.linkedin.com/in/sathwika-penmatsa/" },
                { name: "Shreya Karmakar", role: "Member", email: "skarmaka@gitam.in", phone: "+91 7995339702", linkedin: "https://www.linkedin.com/in/shreya-karmakar-110b57259" },
                { name: "B Bharath", ext: "jpeg", role: "Member", email: "bbolline@gitam.in", phone: "+91 8247370980", linkedin: "https://www.linkedin.com/in/bb-bollineni" },
                { name: "Sravani Kalisetty", role: "Member", email: "skaliset@gitam.in", phone: "+91 8919424414", linkedin: "https://www.linkedin.com/in/sravani-kalisetty-090730293" },
                { name: "Priyanshu P Behera", role: "Member", email: "pbehera@student.gitam.edu", phone: "+91 8018505809", linkedin: "https://www.linkedin.com/in/priyanshu-p-behera-14931a324" },
            ],
            PR: [
                { name: "Motaparthi Janaki Sai Samanvitha", ext: "jpg", role: "Lead", email: "jmotapar@gitam.in", phone: "+91 8247304693", linkedin: "https://www.linkedin.com/in/motaparthi-janaki-sai-samanvitha-201242293" },
                { name: "Ishita Gupta", role: "Member", email: "igupta@gitam.in", phone: "+91 7205640451", linkedin: "https://www.linkedin.com/in/ishitagupta0811/" },
                { name: "Mohamed Mahaboob Ali", role: "Member", email: "mmohamed@student.gitam.edu", phone: "+91 9848096151", linkedin: "https://www.linkedin.com/in/mohamed-mahaboob-ali-900198345" },
                { name: "Pia Solanki Jain", ext: "jpg", role: "Member", email: "ssolanki@student.gitam.edu", phone: "+91 7569027497", linkedin: "https://www.linkedin.com/in/pia-solanki-jain-882908311" },
            ],
            Photography: [
                { name: "Sahithi Mounika Patoju", role: "Lead", email: "spatoju@gitam.in", phone: "+91 8688060791", linkedin: "https://www.linkedin.com/in/sahithi-mounika-patoju-004488337" },
                { name: "V D S S S Sritej", role: "Member", email: "dvilaman@gitam.in", phone: "+91 8919387785", linkedin: "https://www.linkedin.com/in/v-d-s-s-s-sritej-b5a196295/" },
                { name: "Bhagavan Venkata Sri Sai Apuroop Alapati", role: "Member", email: "balapati2@gitam.in", phone: "+91 9346538919", linkedin: "https://www.linkedin.com/in/apuroop-alapati" },
                { name: "Ommi Rohan Aditya", role: "Member", email: "rommi@gitam.in", phone: "+91 9949331404", linkedin: "https://www.linkedin.com/in/rohanaditya-rohanadityaommi-796033356" },
                { name: "Boni Rakshak", role: "Member", email: "rboni@gitam.in", phone: "+91 8074339759", linkedin: "https://www.linkedin.com/in/boni-rakshak-15b727355" },
            ]
        },
    },
    "2023-24": {
        folderPrefix: "23_24",
        yearSuffix: "23-24",
        domains: ["EB", "DataVerse", "WebArcs", "CP", "Content", "Design", "PR", "Photography", "ARVR"],
        members: {
            EB: [],
            WebArcs: [],
            DataVerse: [],
            CP: [],
            Content: [],
            Design: [],
            PR: [],
            Photography: [],
            ARVR: [],
        },
    },
    "2022-23": {
        folderPrefix: "22_23",
        yearSuffix: "22-23",
        domains: ["EB", "DataVerse", "WebArcs", "CP", "Content", "Design", "PR", "Photography", "ARVR"],
        members: {
            EB: [],
            WebArcs: [],
            DataVerse: [],
            CP: [],
            Content: [],
            Design: [],
            PR: [],
            Photography: [],
            ARVR: [],
        },
    },
}

// Convert "FIRSTNAME LASTNAME" → "Firstname Lastname"
function formatName(raw) {
    return raw
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
}

// Build full member data with image paths
export function getTenureMembers(year) {
    const data = tenureData[year]
    if (!data) return []

    return data.domains.map(domain => ({
        domain,
        label: domainLabels[domain] || domain,
        colors: domainColors[domain] || domainColors.EB,
        members: (data.members[domain] || []).map(entry => {
            const memberName = typeof entry === "string" ? entry : entry.name
            const ext = typeof entry === "string" ? "jpg" : (entry.ext || "jpg")
            const role = typeof entry === "string" ? "Member" : (entry.role || "Member")
            return {
                name: formatName(memberName),
                role,
                img: buildPath(data.folderPrefix, domain, data.yearSuffix, memberName, ext),
                phone: entry.phone || "",
                email: entry.email || "",
                linkedin: entry.linkedin || "",
            }
        }),
    }))
}

export function getDomainsForYear(year) {
    return tenureData[year]?.domains || []
}

export { domainColors, domainLabels }
