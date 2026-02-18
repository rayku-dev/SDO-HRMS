import { Code2, Palette, ChartNoAxesCombined, Fingerprint } from "lucide-react";

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Fingerprint
        className="absolute text-muted-foreground/30 animate-float"
        style={{
          top: "15%",
          left: "15%",
          animationDelay: "0s",
        }}
        size={40}
      />

      <Fingerprint
        className="absolute text-muted-foreground/24 animate-float"
        style={{
          top: "8%",
          right: "12%",
          animationDelay: "0.6s",
        }}
        size={30}
      />

      <Fingerprint
        className="absolute text-muted-foreground/30 animate-float"
        style={{
          top: "48%",
          left: "5%",
          animationDelay: "0.9s",
        }}
        size={28}
      />

      <Palette
        className="absolute text-muted-foreground/30 animate-float"
        style={{
          bottom: "20%",
          left: "20%",
          animationDelay: "1s",
        }}
        size={30}
      />

      <ChartNoAxesCombined
        className="absolute text-muted-foreground/30 animate-float"
        style={{
          bottom: "15%",
          right: "20%",
          animationDelay: "0s",
        }}
        size={30}
      />

      <ChartNoAxesCombined
        className="absolute text-muted-foreground/24 animate-float"
        style={{
          top: "40%",
          right: "10%",
          animationDelay: "0.7s",
        }}
        size={36}
      />
    </div>
  );
}
