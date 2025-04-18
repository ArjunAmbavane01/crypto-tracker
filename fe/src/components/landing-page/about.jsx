import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function About() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-full text-white bg-violet-500  px-3 py-1 text-sm">About Us</div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
            About CryptoTrack
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg mx-auto">
            CryptoTrack is a powerful cryptocurrency portfolio tracker designed to help you manage your investments with
            ease. Our platform provides real-time data, advanced analytics, and intuitive portfolio management tools to
            help you make informed decisions.
          </p>
          <div className="mx-auto w-full max-w-md space-y-2 mt-8">
            <a href="/dashboard">
              <Button
                className="w-full bg-gradient-to-r from-blue-300 to-violet-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-primary/20 group text-white"
                size="lg"
              >
                Start Tracking Now
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
