export default function GridBackground() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e7e5e4 1px, transparent 1px),
          linear-gradient(to bottom, #e7e5e4 1px, transparent 1px),
          radial-gradient(circle 500px at -10% 100px, #d5c5ff, transparent),
          radial-gradient(circle 500px at 110% 100px, #d5c5ff, transparent)
        `,
        backgroundSize: `
          20px 20px,    
          20px 20px,    
          100% 100%,    
          100% 100%  
        `,
        backgroundPosition: "0 0, 0 0, center, center",
        maskImage: `
          repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          )
        `,
        WebkitMaskImage: `
          repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          )
        `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
