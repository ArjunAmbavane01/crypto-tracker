import { Link } from 'react-router-dom'
import { CryptoLogo } from "./crypto-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container px-4 h-16 flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center group">
          <CryptoLogo className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="ml-2 text-xl font-bold text-black">
            CryptoTrack
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="#about"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            About
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="#features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                to="#about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
