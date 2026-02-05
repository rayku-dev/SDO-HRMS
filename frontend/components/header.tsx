import Link from "next/link";
import { Button } from "./ui/button";
import Logo201 from "./icons/epds-icon";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="container max-w-5xl flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1">
            <div className="rounded-md">
              <Logo201 className="h-6 w-6 text-primary" />
            </div>
            <span className="inline-block font-bold text-xl tracking-tight">
              EPDS
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg drop-shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
