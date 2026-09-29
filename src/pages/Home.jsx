import Hero from "../components/home/Hero"
import MarqueeBand from "../components/home/MarqueeBand"
import Manifesto from "../components/home/Manifesto"
import Stats from "../components/home/Stats"
import Pipeline from "../components/home/Pipeline"
import Domains from "../components/home/Domains"
import EventsReel from "../components/home/EventsReel"
import EventOrbit from "../components/home/EventOrbit"
import BoardPreview from "../components/home/BoardPreview"
import AskTerminal from "../components/home/AskTerminal"
import FinalCTA from "../components/home/FinalCTA"

export default function Home() {
    return (
        <main>
            <Hero />
            <Manifesto />
            <Stats />
            <Pipeline />
            <MarqueeBand />
            <Domains />
            <EventsReel />
            <EventOrbit />
            <BoardPreview />
            <AskTerminal />
            <FinalCTA />
        </main>
    )
}
