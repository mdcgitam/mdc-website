// Downloads 2026-27 member photos from the "Member Photos (Responses)" form and
// saves them as public/26_27/<Domain>_26-27/<FULL NAME>.jpg (the path tenureData.js expects).
//
// The form's upload folder must be shared "Anyone with the link → Viewer" first,
// otherwise Drive returns a sign-in page. Uses macOS `sips` to convert to JPEG
// (handles HEIC/PNG) and cap the long edge at 900px.
//
//   node scripts/import-photos-26-27.mjs
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync, rmSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const PHOTOS = [
    ["DataVerse", "MEDIDI SANJANA", "1YX-KovqExyh-mQ5whmC0zSkzh_CJl8Gf"],
    ["DataVerse", "IKKARA RISHI KARTHIKEYAN", "1U7TI2a2rJyPp45hd6-kBbtNjWmoHIMcg"],
    ["DataVerse", "NIHAL MAREDLA", "1kKQk9m5rLGqq9BhxPWWEGCJTwKQqjaUw"],
    ["DataVerse", "DHANA TARUN BALIVADA", "1ag6Mkfk8_duWdEULmBjj7scRqn55KM31"],
    ["DataVerse", "SAGI LAKSHMI KAIVALYA", "1Q6SeImV4YHQ6YjMyk3mOJV9XLcp6ItxR"],
    ["DataVerse", "SIRIKI SAI SATYA YASWANTH", "1adT6R7OCHM8Caku9A-NiQNBXSK_vf7jn"],
    ["DataVerse", "SOMAYAJULA RAAM SASHANK", "1UQ6WWc8sYL34-39BAobKx13epJ2OUQUg"],
    ["WebArcs", "MOHAMED MAHABOOB ALI", "1B8Busq0v9JIuUhZVRWP48KgooKXk8CRT"],
    ["WebArcs", "GAJJALA JASWITHA REDDY", "1GpU2p5JfP7CErvmDUmPIBgBRowqDT1GC"],
    ["WebArcs", "DADI DIVYA SREE", "16yLW-yx147lRq9OAT56hL7Ukh4IiyaGP"],
    ["WebArcs", "YADLA SAI SUSHMA", "1v5JIK7UfLZeZixSR50LDD9_ZpfUGLIZz"],
    ["WebArcs", "TEDDI GUNA", "1mZtEnnWR2XSMVGNLZgz9H8c0pH15kTUD"],
    ["WebArcs", "AARUSH KUMAR TIWARI", "1CZkCyJksCEqtHBCGnkjKT-OR96gBpDB3"],
    ["WebArcs", "PANANGIPALLI NAGA ADITYA", "1clLb99dSn_GwN6EcrHjS8_Q8x-WKB-J_"],
    ["CP", "CHITROTHU SANJITA", "1yCOO6nny3ZlYwV7-1IJu6_o7MgB4V8zo"],
    ["CP", "KOUSTAV BOSE", "1ImfKR42VFAsl3Vb2vJeFBrX4F5qc_Oo7"],
    ["CP", "EATY VENKATA LAKSHMI PRIYANKA", "1pnzw-RI3ta_jijlO8Sn8lEYOuohcl6s0"],
    ["CP", "D BHARGAVI", "1O5t3fSBGK4eftVD7o0wMn-4e76sbaRmp"],
    ["CP", "PRIANSHU KUMAR SAHU", "1p81FFrpS7nGT-pflTJa9EGNlyO6CPmmz"],
    ["CP", "PARASUBOTU YASHASVI", "12JawxH238rT1SpDmuuqUWshwPRaTyheU"],
    ["Content", "TAMANNA HAZRA", "1N5GCNdK7R7JSkTE5VsNeCL3aYTwjaUhb"],
    ["Content", "BALABHADRUNI AKSHAYA", "1Qlu0uujO2DrumY0v3Y4k_041Lfn7U0xS"],
    ["Content", "GOLI SAHITHI", "1MC_vEpK3qXgh9CoaQSIOnpvQSwyHkaQC"],
    ["Design", "AFREEN NAAZ ALI", "1Bf_97OTfcAusaHnr_XJoWEJI1FWpe4Sc"],
    ["Design", "WARIZ SHAIK", "1GqOua4KhrN-eTVXPILXdopfVAQ4NGx4b"],
    ["Design", "SONALI SRIPATHI", "1_Nlj0AAa3lNmmsOdp3lfGP3LJ9tupt6T"],
    ["Design", "HIMESH KAMAL ESARLA", "1mFgiKbGfuVFcPXsh9C-IS8J-GiNK1YhJ"],
    ["Design", "ARPAN PANDA", "1k0uaUQGixskyKYKG03fNjLQbLG99RdTR"],
    ["Design", "MADHUMIKA VEMANA", "1YQM5N14xk1dKHv1wOiTvsHVxsIE56hTs"],
    ["PR", "POSAM ADRIJA", "1dL3IyLQ-YWqCFT4y66KUDfxm5-OtLsab"],
    ["PR", "PENMETSA CHANDRA HASINI", "1_kKX7-9M_qEUA-zfSyqdR7IUV96bta3K"],
    ["PR", "ANIKETH KUMAR YADAV", "1Ju61wTCYhu7u6bE-HwB7w0dhoWsnVWNg"],
    ["PR", "KANNEKANTI MADHULIKA", "1F0vE1kxmd7rO-nHVAylD7ETo61SquMPY"], // later of two submissions
    ["Photography", "K VAMSI KRISHNA", "1Sl3Q-hsQPS6NqJrfJC3a6RrhLOh-jcZT"],
    ["Photography", "KALAGARLA SAI SATHVIKA", "1yh_takgiVUzJbz4jfPNgySH3pORt8_sa"],
    ["Photography", "SRADDHA KASARA", "10Dq-VeVLS6mbsFqt407G5VchYhZ3iIbt"],
    ["Photography", "MUNGANDA JASWANTH BALAJI", "1VYhsBsJPAGuWcGv6O1hIc7WMmvxtG9HO"],
    ["Photography", "MADEM HANISH", "1T8TNyCjHF9Gcbdf8em7Eu72CIujol7s3"],
]

const tmp = mkdtempSync(join(tmpdir(), "mdc-photos-"))
const failed = []

for (const [domain, name, id] of PHOTOS) {
    const dir = join("public", "26_27", `${domain}_26-27`)
    const out = join(dir, `${name}.jpg`)
    try {
        const res = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`)
        const type = res.headers.get("content-type") || ""
        if (!res.ok || type.startsWith("text/html")) throw new Error(`not shared publicly (got ${res.status} ${type})`)
        const raw = join(tmp, id)
        writeFileSync(raw, Buffer.from(await res.arrayBuffer()))
        mkdirSync(dir, { recursive: true })
        execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", "-Z", "900", raw, "--out", out], { stdio: "ignore" })
        console.log("✓", out)
    } catch (e) {
        failed.push(name)
        console.error("✗", name, "—", e.message)
    }
}

rmSync(tmp, { recursive: true, force: true })
console.log(`\n${PHOTOS.length - failed.length}/${PHOTOS.length} photos saved.`)
if (failed.length) process.exitCode = 1
