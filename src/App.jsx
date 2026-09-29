import { lazy, Suspense } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ScrollManager from "./components/layout/ScrollManager"
import CommandPalette from "./components/layout/CommandPalette"
import Preloader from "./components/fx/Preloader"

import Home from "./pages/Home"
import About from "./pages/About"
import DomainsPage from "./pages/Domains"
import Events from "./pages/Events"
import Team from "./pages/Team"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

// Admin screens pull in Firebase Auth; keep them out of the public bundle.
const AdminLogin = lazy(() => import("./pages/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === "/admin" || pathname === "/dashboard"

  return (
    <>
      <ScrollManager />
      <Preloader />
      <CommandPalette />
      <div className="grain" aria-hidden />
      {!isAdmin && <Navbar />}

      <Suspense fallback={<main className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/domains" element={<DomainsPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/tenure" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>

      {!isAdmin && <Footer />}
    </>
  )
}
