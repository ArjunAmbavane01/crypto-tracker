import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { CryptoLogo } from "./landing-page/crypto-logo";

export function MainNav({ className, ...props }) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link to="/" className="flex items-center group">
        <CryptoLogo className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
        <span className="ml-2 text-xl font-bold text-black">CryptoTrack</span>
      </Link>
    </nav>
  );
}
