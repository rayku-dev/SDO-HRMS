"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-4 w-10 rounded-full bg-muted animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Improved easing functions based on high-end UI patterns
  const mainTransition = "duration-700 cubic-bezier(0.4, 0, 0.2, 1.2)";
  const circleTransition = "duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <div className="relative w-16 h-7.5 flex items-center justify-end">
      <div className="scale-[0.38] origin-right absolute">
        <button
          onClick={handleToggle}
          className={cn(
            "relative block w-[5.625em] h-[2.5em] rounded-[6.25em] cursor-pointer overflow-hidden transition-all group active:scale-95 select-none",
            mainTransition,
            isDark ? "bg-[#241d2c]" : "bg-[#ad8ccc]",
            "shadow-[0em_-0.062em_0.062em_rgba(0,0,0,0.25),0em_0.062em_0.125em_rgba(255,255,255,0.94)]",
          )}
          style={{ fontSize: "30px" }}
        >
          {/* Inner shadow overlay for depth */}
          <div className="absolute inset-0 z-1 rounded-[6.25em] shadow-[0em_0.1em_0.3em_rgba(0,0,0,0.4)_inset,0em_0.1em_0.3em_rgba(0,0,0,0.4)_inset] pointer-events-none transition-opacity duration-500" />

          {/* Sky Layers for smooth color transition */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              isDark ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: "linear-gradient(to right, #350067, #2D3047)",
            }}
          />

          {/* Clouds - with improved staggering and floating animation */}
          <div
            className={cn(
              "absolute w-[1.25em] h-[1.25em] bg-[#75529c] rounded-full left-[0.312em] transition-all z-1 ease-in-out",
              mainTransition,
              isDark
                ? "bottom-[-5em] opacity-0"
                : "bottom-[-0.625em] opacity-100",
            )}
            style={{
              boxShadow: `
              0.937em 0.312em #F3FDFF, 
              -0.312em -0.312em #AACADF, 
              1.437em 0.375em #F3FDFF, 
              0.5em -0.125em #AACADF, 
              2.187em 0 #F3FDFF, 
              1.25em -0.062em #AACADF, 
              2.937em 0.312em #F3FDFF, 
              2em -0.312em #AACADF, 
              3.625em -0.062em #F3FDFF, 
              2.625em 0em #AACADF, 
              4.5em -0.312em #F3FDFF, 
              3.375em -0.437em #AACADF, 
              4.625em -1.75em 0 0.437em #F3FDFF, 
              4em -0.625em #AACADF, 
              4.125em -2.125em 0 0.437em #F3FDFF
            `,
            }}
          />

          {/* Stars - with twinkling and staggered entrance */}
          <div
            className={cn(
              "absolute left-[0.4em] w-[2.8em] text-white transition-all z-1",
              mainTransition,
              isDark
                ? "top-1/2 -translate-y-1/2 opacity-100 delay-150"
                : "top-[-120%] opacity-0",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 144 55"
              fill="none"
              className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>

          {/* Outer Glow - Sun or Moon Glow */}
          <div
            className={cn(
              "absolute inset-0 z-0 transition-all duration-1000 blur-[1em] opacity-40",
              isDark ? "bg-[#C4C9D1]/20 right-0" : "bg-[#ECCA2F]/40 left-0",
            )}
          />

          {/* Sun/Moon Circle Container */}
          <div
            className={cn(
              "absolute w-[3.375em] h-[3.375em] rounded-full flex transition-all pointer-events-none z-2",
              circleTransition,
              isDark
                ? "left-[calc(100%-(-0.4375em)-3.375em)] group-hover:left-[calc(100%-(-0.4375em)-3.375em-0.187em)]"
                : "left-[-0.4375em] group-hover:left-[calc(-0.4375em+0.187em)]",
              "top-[-0.4375em]",
              "shadow-[inset_0_0_0_3.375em_rgba(255,255,255,0.05),0_0_0_0.625em_rgba(255,255,255,0.05),0_0_0_1.25em_rgba(255,255,255,0.1)]",
            )}
          >
            {/* Main Body (Sun or Moon) */}
            <div
              className={cn(
                "relative z-2 w-[2.125em] h-[2.125em] m-auto rounded-full overflow-hidden transition-all duration-700 shadow-[0.2em_0.2em_0.2em_0em_rgba(255,255,255,0.3)_inset,-0.2em_-0.2em_0.2em_0em_rgba(0,0,0,0.2)_inset] filter drop-shadow-[0.1em_0.2em_0.3em_rgba(0,0,0,0.4)]",
                isDark
                  ? "bg-[#C4C9D1] rotate-0"
                  : "bg-[#ECCA2F] rotate-[-20deg] group-hover:rotate-0",
              )}
            >
              {/* Moon Face - slides in from right when dark */}
              <div
                className={cn(
                  "absolute inset-0 bg-[#c8c4d1] rounded-inherit transition-transform duration-700 ease-in-out",
                  isDark ? "translate-x-0" : "translate-x-full",
                )}
                style={{
                  boxShadow:
                    "0.062em 0.062em 0.062em 0em rgba(254,255,239,0.61) inset, 0em -0.062em 0.062em 0em #969696 inset",
                }}
              >
                {/* Moon Craters */}
                <div className="absolute top-[0.75em] left-[0.312em] w-[0.75em] h-[0.75em] rounded-full bg-[#959DB1] shadow-[0.05em_0.05em_0.1em_rgba(0,0,0,0.3)_inset]" />
                <div className="absolute top-[0.937em] left-[1.375em] w-[0.375em] h-[0.375em] rounded-full bg-[#959DB1] shadow-[0.05em_0.05em_0.1em_rgba(0,0,0,0.3)_inset]" />
                <div className="absolute top-[0.312em] left-[0.812em] w-[0.25em] h-[0.25em] rounded-full bg-[#959DB1] shadow-[0.05em_0.05em_0.1em_rgba(0,0,0,0.3)_inset]" />
              </div>

              {/* Sun Rays / Shine effect (visible when light) */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-white/40 mix-blend-overlay transition-opacity duration-700",
                  isDark ? "opacity-0" : "opacity-100",
                )}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
