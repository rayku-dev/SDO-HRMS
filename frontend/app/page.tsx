import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  Printer,
  CheckCircle2,
  Lock,
  History,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-background selection:bg-primary/30 font-sans">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[600px] rounded-full bg-primary/20 opacity-50 blur-[120px]"></div>
      </div>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Animated Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">
                Next-generation Document Management
              </span>
            </div>

            {/* Typography */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground">
                Electronic <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">
                  Personal Data Sheet
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                A highly secure, digital solution for managing your Civil Service Form No. 212. 
                Experience seamless record updates, instant standardized PDF generation, and unparalleled data accuracy.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <Button
                size="lg"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(192,132,252,0.6)] hover:shadow-[0_0_60px_-15px_rgba(192,132,252,0.8)] transition-all duration-300 hover:scale-105 h-14 px-8 text-base rounded-full"
              >
                <Link href="/login" className="flex items-center gap-2 font-semibold">
                  Access Portal
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-background/50 backdrop-blur-md border-border hover:bg-muted text-foreground hover:text-primary transition-all duration-300 hover:scale-105 h-14 px-8 text-base rounded-full"
              >
                <Link href="#features" className="flex items-center gap-2 font-medium">
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative subtle glows */}
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Value Proposition Grid (Bento style) */}
      <section className="pb-24 pt-12 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Smart Management */}
            <div className="group relative overflow-hidden bg-background/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10 flex flex-col items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Smart Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Intelligently fill out your Personal Data Sheet with dynamic validation, auto-saving, and an intuitive interface.
                  </p>
                </div>
              </div>
            </div>

            {/* Print Ready */}
            <div className="group relative overflow-hidden bg-background/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10 flex flex-col items-start gap-6">
                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                  <Printer className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Print Ready</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Instantly generate pixel-perfect CS Form No. 212 compliant PDFs, ready for official submission and printing.
                  </p>
                </div>
              </div>
            </div>

            {/* Secure & Private */}
            <div className="group relative overflow-hidden bg-background/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10 flex flex-col items-start gap-6">
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Enterprise Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bank-grade encryption, role-based access control, and robust privacy measures ensure your data stays protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section id="features" className="py-32 relative border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20 space-y-5 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Excellence</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Transition from manual, error-prone handwritten forms to a frictionless digital ecosystem designed specifically for government professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <CardTitle className="text-xl">Standardized Format</CardTitle>
                <CardDescription className="text-sm font-medium">100% Civil Service Compliant</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Exported documents impeccably match the Civil Service Commission's rigid standards, permanently eliminating rejection risks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <History className="w-7 h-7 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Version History</CardTitle>
                <CardDescription className="text-sm font-medium">Traceable Career Progression</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Maintain an immutable, digital log of your work experience and achievements. Effortlessly access your complete professional timeline.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-7 h-7 text-indigo-500" />
                </div>
                <CardTitle className="text-xl">Data Integrity</CardTitle>
                <CardDescription className="text-sm font-medium">Zero-Error Tolerant</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Sophisticated validation algorithms scan your entries in real-time, completely preventing formatting mistakes before they happen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Premium Footer */}
      <footer className="border-t border-border/50 py-12 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground flex flex-col items-center justify-center">
          <p className="text-sm font-medium">© {new Date().getFullYear()} e-PDS System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
