import Hero from "../components/home/Hero"
import AboutMDC from "../components/home/AboutMDC"
import WhatWeDo from "../components/home/WhatWeDo"
import Domains from "../components/home/Domains"
import MissionVision from "../components/home/MissionVision"
import EventsSection from "../components/home/EventsSection"

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMDC />
      <WhatWeDo />
      <Domains />
      <MissionVision />
      <EventsSection />
    </main>
  )
}