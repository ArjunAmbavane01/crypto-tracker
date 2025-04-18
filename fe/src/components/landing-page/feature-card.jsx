export function FeatureCard({ icon, title, description }) {
    return (
      <div className="flex flex-col space-y-2 rounded-lg p-6 border border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
          <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
        </div>
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    )
  }
  