import AppIcon from "@/components/icons/app-icon";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="container max-w-5xl flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <AppIcon className="h-10 w-10 text-violet-500" />
            <span className="inline-block font-bold text-xl">SystemCraft</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg drop-shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
