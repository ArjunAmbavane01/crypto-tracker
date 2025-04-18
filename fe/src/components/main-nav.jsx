import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <Link
        to="/dashboard?tab=portfolios"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Portfolios
      </Link>
      <Link
        to="/dashboard?tab=market"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Market
      </Link>
    </nav>
  );
}
