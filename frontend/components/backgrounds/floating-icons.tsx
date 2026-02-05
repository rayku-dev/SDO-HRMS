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
      <Code2
        className="absolute text-muted-foreground/30 animate-float"
        style={{
          top: "25%",
          right: "15%",
          animationDelay: "2s",
        }}
        size={35}
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
    </div>
  );
}
