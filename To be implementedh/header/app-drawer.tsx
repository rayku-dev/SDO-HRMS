"use client";

import {
  LayoutGrid,
  Facebook,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Twitch,
  Youtube,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BsWhatsapp } from "react-icons/bs";
import { useState } from "react";
import Link from "next/link";

// Icon map to resolve string names to actual components
const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Twitch,
  Github,
  Whatsapp: BsWhatsapp, // React Icons must be referenced properly
};

interface ItemData {
  name: string;
  link: string;
  x: number;
  y: number;
}

interface AppDrawerProps {
  items: ItemData[];
}

export function AppDrawer({ items }: AppDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <LayoutGrid className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative flex items-center justify-center w-48 h-48 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {items.map(({ name, link, x, y }, index) => {
                const Icon = iconMap[name]; // Get the actual icon component
                return (
                  <Link
                    key={index}
                    href={link}
                    target="_blank"
                    className="absolute"
                  >
                    <motion.span
                      className="flex items-center justify-center rounded-md bg-primary hover:scale-110 transition-transform"
                      initial={{ x: 0, y: 0, width: 8, height: 8 }}
                      animate={{ x: x * 60, y: y * 60, width: 45, height: 45 }}
                      exit={{ x: 0, y: 0, width: 8, height: 8 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      {Icon && <Icon size={24} className="text-white" />}
                    </motion.span>
                  </Link>
                );
              })}

              <Button
                size="icon"
                className="absolute w-11 h-11 p-1 bg-white/20 hover:bg-white/40"
                onClick={() => setIsOpen(false)}
              >
                <LayoutGrid className="text-white hover:text-red-400 transition-colors duration-300" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AppDrawer;
