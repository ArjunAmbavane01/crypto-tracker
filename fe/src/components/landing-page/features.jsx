import { FeatureCard } from "./feature-card"

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 bg-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block bg-violet-500 text-white rounded-full px-3 py-1 text-sm text-primary">Features</div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
            Everything You Need
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-lg">
            Powerful tools to track and manage your cryptocurrency investments
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    title: "Real-Time Tracking",
    description: "Track cryptocurrency prices and market trends in real-time with live updates",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Advanced Charts",
    description: "Visualize performance with interactive charts and detailed analytics",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    title: "Multiple Portfolios",
    description: "Create and manage multiple portfolios to test different investment strategies",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Portfolio Locking",
    description: "Test portfolios before committing with our unique locking feature",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Secure & Private",
    description: "Your portfolio data is secure and private with our robust security measures",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    title: "Market Insights",
    description: "Get valuable insights and analytics to make informed investment decisions",
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 16v-4M12 8h.01" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
]
