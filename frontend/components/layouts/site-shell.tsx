import React from "react";
import GridBackground from "@/components/backgrounds/grid-background";
import { SoundWaveAnimation } from "@/components/backgrounds/sound-wave-animation";
import FloatingIcons from "@/components/backgrounds/floating-icons";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      {/* Pink radial glow (site-wide) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)`,
          backgroundSize: "100% 100%",
        }}
      />
      <GridBackground />
      <SoundWaveAnimation className="translate-y-1/4 opacity-50 absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingIcons />
      </div>

      <main className="relative z-10">{children}</main>

      <footer className="w-full backdrop-blur-md bg-white/5 border-t border-white/10">
        <div className="container max-w-5xl mx-auto h-16 flex items-center justify-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EPDS — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
