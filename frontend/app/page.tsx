import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Rocket, Sparkles } from "lucide-react";
import { RiNextjsLine } from "react-icons/ri";
import { SiNestjs } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiPrisma } from "react-icons/si";
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
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `
          linear-gradient(to right, transparent 1px, transparent 1px),
          linear-gradient(to bottom, transparent, transparent 1px),
          radial-gradient(circle 600px at -10% 200px, #d5c5ff, transparent),
          radial-gradient(circle 600px at 110% 200px, #d5c5ff, transparent)
        `,
        backgroundSize: `
          96px 64px,    
          96px 64px,    
          100% 100%,    
          100% 100%  
        `,
      }}
    >
      <GridBackground />
      <SoundWaveAnimation className="bottom-4 -translate-y-1/2" />
      <Header />
      {/* Hero Section */}
      <section className="pb-4 relative">
        <FloatingIcons />
        <div className="container mx-auto px-4 space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-28 overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground border border-primary/20 mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-primary">
                Professional Web design & Development
              </span>
            </div>
            <h1 className="font-mono text-5xl md:text-6xl lg:text-7xl text-primary text-balance">
              Craft Secure
            </h1>
            <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl gradient-text text-balance pb-2">
              Digital Experiences
            </h1>
            <p className="text-md sm:text-lg text-secondary-foreground/70 max-w-3xl mx-auto animate-fade-in-up animate-delay-100 leading-relaxed">
              Enterprise‑grade authentication and access control built for
              modern SaaS applications. Integrate JWT, role‑based permissions,
              and automatic token refresh without the hassle. Powered by Next.js
              and NestJS to scale with your business and keep your users secure.
            </p>

            {/* Tech Stack Section */}
            <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto text-start relative">
              {/* Next.js */}
              <div className="flex items-center bg-card/10 p-4 rounded-xl shadow-lg border border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <div className="w-10 h-10 bg-purple-500/60 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <RiNextjsLine className="text-white text-2xl" />
                </div>
                <div>
                  <p className="font-semibold">Next.js 16</p>
                  <p className="text-sm">React-based framework</p>
                </div>
              </div>

              {/* NestJS */}
              <div className="flex items-center bg-card/10 p-4 rounded-xl shadow-lg border border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <div className="w-10 h-10 bg-pink-500/60 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <SiNestjs className="text-white text-2xl" />
                </div>
                <div>
                  <p className="font-semibold">NestJS</p>
                  <p className="text-sm">Node.js backend framework</p>
                </div>
              </div>

              {/* PostgreSQL */}
              <div className="flex items-center bg-card/10 p-4 rounded-xl shadow-lg border border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <div className="w-10 h-10 bg-blue-500/60 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <BiLogoPostgresql className="text-white text-2xl" />
                </div>
                <div>
                  <p className="font-semibold">PostgreSQL</p>
                  <p className="text-sm">Relational database</p>
                </div>
              </div>

              {/* Prisma */}
              <div className="flex items-center bg-card/10 p-4 rounded-xl shadow-lg border border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <div className="w-10 h-10 bg-teal-500/60 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <SiPrisma className="text-white text-2xl" />
                </div>
                <div>
                  <p className="font-semibold">Prisma</p>
                  <p className="text-sm">ORM for Node.js</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4 relative">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg drop-shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Rocket className="size-5" />
                <Link href="/login">Launch Demo</Link>
              </Button>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg drop-shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <DownloadIcon className="size-5" />
                <Link href="/register">Download Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg drop-shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>JWT Authentication</CardTitle>
                <CardDescription>
                  Three-layer token system with access and refresh tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure authentication with short-lived access tokens and
                  long-lived refresh tokens stored in httpOnly cookies.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg drop-shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  ADMIN and USER roles with protected routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fine-grained access control with role-based guards and
                  middleware protection for sensitive routes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg drop-shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Database-backed session tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track active sessions with the ability to logout from all
                  devices for enhanced security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// here is a sample code for frontend/app/page.tsx
