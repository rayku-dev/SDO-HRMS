import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate speed for text reveal based on length for the TextEffect component
export const calcSpeedReveal = (text: string, base: number) => {
  return text.length * base;
};
