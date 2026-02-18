"use client";

import { useEffect, useRef } from "react";

interface SoundWaveAnimationProps {
  className?: string;
}

export function SoundWaveAnimation({ className }: SoundWaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = 400;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Wave parameters — each wave has unique color, frequency, and speed
    const waves = [
      {
        amplitude: 35,
        frequency: 0.01,
        speed: 0.12,
        color: "rgba(16, 185, 129, 0.34)", // emerald
        strokeColor: "rgba(16, 185, 129, 0.55)",
        offset: 0,
      },
      {
        amplitude: 28,
        frequency: 0.025,
        speed: 0.3,
        color: "rgba(99, 102, 241, 0.28)", // indigo
        strokeColor: "rgba(99, 102, 241, 0.5)",
        offset: 120,
      },
      {
        amplitude: 22,
        frequency: 0.04,
        speed: 0.6,
        color: "rgba(244, 63, 94, 0.26)", // pink/red
        strokeColor: "rgba(244, 90, 3 4, 0.45)",
        offset: 240,
      },
      {
        amplitude: 40,
        frequency: 0.006,
        speed: 0.08,
        color: "rgba(59, 130, 246, 0.32)", // blue
        strokeColor: "rgba(59, 130, 246, 0.5)",
        offset: 360,
      },
    ];

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave) => {
        drawWave(ctx, wave, time, canvas.width, canvas.height);
      });

      time += 0.05;
      animationFrameId = requestAnimationFrame(animate);
    };

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      wave: {
        amplitude: number;
        frequency: number;
        speed: number;
        color: string;
        strokeColor: string;
        offset: number;
      },
      time: number,
      width: number,
      height: number,
    ) => {
      const { amplitude, frequency, speed, color, strokeColor, offset } = wave;
      const y = height / 2;

      // First draw the filled wave
      ctx.beginPath();

      // Store the wave points to reuse for stroke
      const points: [number, number][] = [];

      // Draw the top curve of the wave
      for (let x = 0; x < width; x++) {
        // Create a sine wave pattern
        const dx = x * frequency;
        const sine = Math.sin(dx + time * speed + offset);
        const dy = sine * amplitude;

        const point: [number, number] = [x, y + dy];
        points.push(point);

        if (x === 0) {
          ctx.moveTo(x, y + dy);
        } else {
          ctx.lineTo(x, y + dy);
        }
      }

      // Complete the path by drawing to the bottom right and back to start
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      // Now draw just the top curve with a stroke for more visibility
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute w-full h-[400px] opacity-80 ${className}`}
      aria-hidden="true"
    />
  );
}
