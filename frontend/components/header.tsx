import Link from "next/link";
import { Button } from "./ui/button";
import Logo201 from "./icons/epds-icon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-background/70 border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="container px-4 md:px-6 flex h-16 items-center justify-between mx-auto max-w-7xl">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Logo201 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="inline-block font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              e-PDS
            </span>
          </Link>
          <nav className="hidden gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(192,132,252,0.4)] hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.6)] transition-all duration-300 hover:-translate-y-0.5 rounded-full px-6 font-semibold"
          >
            <Link href="/login">Access Portal</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
