import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  Printer,
  UserCircle,
  CheckCircle2,
  Lock,
  History,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GridBackground from "@/components/backgrounds/grid-background";
import { SoundWaveAnimation } from "@/components/backgrounds/sound-wave-animation";
import FloatingIcons from "@/components/backgrounds/floating-icons";
import Header from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Pink Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <GridBackground />
      <SoundWaveAnimation className="translate-y-1/4 opacity-50" />
      {/* Clouds SVG overlay at top (moved after waves/grid so it overlaps them) */}
      <div
        className="absolute inset-x-0 top-0 h-80 pointer-events-none"
        style={{
          backgroundImage: "url('/images/clouds.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "contain",
          opacity: 0.95,
          zIndex: 20,
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="pb-8 pt-6 relative">
        <FloatingIcons />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-8 pt-6 md:pt-12 pb-8">
            {/* Left: main content (moved left) */}
            <div className="text-center md:text-left space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-primary shadow-sm transform transition-all hover:scale-105">
                    <picture>
                      <source srcSet="/ring-logo.webp" type="image/webp" />
                      <img
                        src="/ring-logo.svg"
                        alt="logo"
                        className="w-16 h-16"
                      />
                    </picture>
                  </div>

                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-primary shadow-sm transform transition-all hover:scale-105">
                    <picture>
                      <source srcSet="/ring-logo.webp" type="image/webp" />
                      <img
                        src="/ring-logo.svg"
                        alt="logo"
                        className="w-16 h-16"
                      />
                    </picture>
                  </div>

                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-primary shadow-sm transform transition-all hover:scale-105">
                    <picture>
                      <source srcSet="/ring-logo.webp" type="image/webp" />
                      <img
                        src="/ring-logo.svg"
                        alt="logo"
                        className="w-16 h-16"
                      />
                    </picture>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in-up">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Official Document Management System
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary text-balance tracking-tight">
                  Electronic
                </h1>
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl gradient-text text-balance">
                  Personal Data Sheet
                </h1>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                A secure, digital solution for managing your Civil Service Form
                No. 212. Update your records, generate standardized PDFs, and
                ensure data accuracy with ease.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up animate-delay-200 relative z-10">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 h-12 px-8 text-base"
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <UserCircle className="size-5" />
                    Access Portal
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 text-foreground hover:text-primary transition-all duration-300 hover:scale-105 h-12 px-8 text-base"
                >
                  <Link href="#features" className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Key Benefits (moved from below) */}
            <div aria-hidden="false" className="hidden md:block w-full">
              <div className="space-y-6">
                <div className="group relative overflow-hidden bg-card/40 backdrop-blur-md p-4 max-w-sm mx-auto rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 flex flex-col items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                      <FileText className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Smart Management
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Easily fill out and update your Personal Data Sheet with
                        intelligent validation and auto-saving features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-card/40 backdrop-blur-md p-4 max-w-sm mx-auto rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 flex flex-col items-start gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                      <Printer className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Print Ready
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Instantly generate CS Form No. 212 (Revised 2017)
                        compliant PDFs ready for submission and printing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-card/40 backdrop-blur-md p-4 max-w-sm mx-auto rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 flex flex-col items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <Lock className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Secure Storage
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Enterprise-grade encryption and role-based access
                        control ensure your personal data stays private.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits Grid moved into hero right column */}
        </div>
      </section>

      {/* Detailed Features Section */}
      <section
        id="features"
        className="py-20 relative bg-primary/5"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(236,72,153,0.06), rgba(236,72,153,0.02))",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="pb-2 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Why use the e-PDS System?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Replace manual handwritten forms with a streamlined digital
              experience designed for government employees and HR professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                <CardTitle>Standardized Format</CardTitle>
                <CardDescription>Fully compliant layout</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your exported documents perfectly match the Civil Service
                  Commission's required format, eliminating rejection risks due
                  to formatting errors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <History className="w-10 h-10 text-blue-500 mb-2" />
                <CardTitle>Version History</CardTitle>
                <CardDescription>Track your career progression</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep a digital history of your work experience, educational
                  background, and achievements. easily look back at your career
                  milestones.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <ShieldCheck className="w-10 h-10 text-indigo-500 mb-2" />
                <CardTitle>Data Integrity</CardTitle>
                <CardDescription>
                  Accurate and validated records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in validation helpers ensure your dates, names, and
                  other critical information are entered correctly before
                  submission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
