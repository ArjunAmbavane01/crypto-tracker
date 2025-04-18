import { CryptoLogo } from "./crypto-logo"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10 mx-auto">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 group hover:bg-primary/20 transition-all duration-300">
          <CryptoLogo className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Track Your Crypto Portfolio in Real-Time
          </h1>
          <p className="text-xl text-muted-foreground mx-auto max-w-2xl">
            Monitor your investments, create multiple portfolios, and stay updated with the latest cryptocurrency trends
            all in one place.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/dashboard">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-300 to-violet-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-primary/20 text-white"
            >
              Get Started
              <ArrowRight className="h-4 w-4 animate-pulse" />
            </Button>
          </Link>
        </div>
        <div className="mt-16 w-full max-w-3xl p-8 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-xl hover:shadow-primary/5 transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              }
              title="Create Portfolio"
              description="Start tracking your investments in minutes"
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              }
              title="Track Performance"
              description="Monitor in real-time with live data"
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              }
              title="Optimize Strategy"
              description="Make data-driven investment decisions"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg hover:bg-card/60 transition-all duration-300">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group hover:bg-primary/20 transition-all duration-300">
        <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
