"use client";
import { Loader2 } from "lucide-react";
import { Loader } from "../ui/loader";

interface LoadingOverlayProps {
  isLoading: boolean;
  variant: "circle" | "custom";
  text?: string;
}

export function LoadingOverlay({
  isLoading,
  variant,
  text = "Loading...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-2xl rounded-xl">
      <div className="flex flex-col items-center justify-center gap-6 p-4 rounded-xl">
        {variant === "circle" && (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
        {variant === "custom" && <Loader size="lg" />}
        <p className="text-lg font-semibold text-center">{text}</p>
      </div>
    </div>
  );
}
