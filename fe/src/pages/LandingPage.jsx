import { Header } from "@/components/landing-page/header"
import { Hero } from "@/components/landing-page/hero"
import { Features } from "@/components/landing-page/features"
import { About } from "@/components/landing-page/about"
import { Footer } from "@/components/landing-page/footer"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <About />
      </main>
      <Footer />
    </div>
  )
}
