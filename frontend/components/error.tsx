"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "./animated-number";
import { TextEffect } from "./motion-primitives/text-effect";
import { calcSpeedReveal } from "@/lib/utils";
import { CircleArrowLeft, Loader, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  error?: string;
  buttonText: string;
  reset?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    transform: "translateY(10px)", // GPU-friendly slide
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeInOut" as any,
    },
  },
};

const cloudVariants = {
  animate: { x: "-50%" },
  transition: {
    duration: 50,
    ease: "linear" as any,
    repeat: Infinity,
  },
};

const zoomIn = {
  animate: {
    scale: [1.4, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.9,
      ease: "easeOut" as any,
    },
  },
};

export function ErrorPage({
  code,
  title,
  description,
  error,
  buttonText = "Back Home",
  reset,
}: ErrorPageProps) {
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);
  const codeDigits = code.split("");
  const goBackCodes = ["403", "404"];
  const Icon = goBackCodes.includes(code) ? CircleArrowLeft : RotateCcw;
  const [loading, setLoading] = useState(false);
  const { user, retryAuth } = useAuth();
  const [lastGoodRoute, setLastGoodRoute] = useState("/");

  // Guard with typeof window because sessionStorage runs immediately when the component is initialized or mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("lastGoodRoute");
      setLastGoodRoute(stored || "/");
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  const handleClick = () => {
    setLoading(true);
    if (code === "500") {
      console.log(code);
      console.log(reset);
      retryAuth();
      router.push(lastGoodRoute); // go back to last good route
    }
    if (reset) {
      // use Next.js reset if no buttonText
      console.log("Reset");
      reset();
      return;
    }
    if (goBackCodes.includes(code)) {
      router.push(user ? "/dashboard" : "/");
    } else {
      // For other codes (e.g. 500, 502), retry current route
      console.log("Refreshed");

      router.refresh();
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-linear-to-b from-indigo-300/80 via-indigo-200 to-slate-300 flex flex-col items-center justify-center">
      <motion.div
        variants={zoomIn}
        animate="animate"
        className="relative w-full h-full flex flex-col items-center justify-center"
      >
        <motion.div
          variants={cloudVariants}
          animate="animate"
          transition={cloudVariants.transition}
          className="absolute inset-0 w-[400%] h-80vh self-end flex pointer-events-none"
        >
          <img
            src="/images/clouds.svg"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <img
            src="/images/clouds.svg"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-end min-h-screen min-w-full">
          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            <div className="flex items-start justify-center gap-4 md:gap-12">
              {codeDigits.map((digit, index) => (
                <AnimatedNumber
                  key={index}
                  number={digit}
                  delay={index * 0.3}
                />
              ))}
            </div>
          </div>

          {/* animated character */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20 h-[clamp(300px,60vh,700px)] w-auto overflow-hidden"
          >
            {!videoError ? (
              <video
                src="/videos/character.webm"
                autoPlay
                muted
                playsInline
                preload="none"
                onError={() => setVideoError(true)}
                className="h-full w-auto object-cover filter brightness-115 contrast-80"
              />
            ) : (
              <img
                src="/images/character.webp"
                alt="Fallback character"
                loading="lazy"
                className="h-full w-auto object-cover filter brightness-115 contrast-80"
              />
            )}
          </motion.div>

          {/* Text content with staggered animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-full space-y-3 relative z-20 pb-20 overflow-hidden"
          >
            <TextEffect
              preset="fade-in-blur"
              speedReveal={calcSpeedReveal(title, 0.02)} // base factor
              speedSegment={0.3}
              className="text-4xl md:text-5xl font-bold text-slate-800 py-2"
            >
              {title}
            </TextEffect>

            <TextEffect
              preset="fade-in-blur"
              speedReveal={calcSpeedReveal(description, 0.02)} // same base factor
              speedSegment={0.3}
              className="text-lg md:text-xl text-slate-600"
            >
              {description}
            </TextEffect>

            {error && (
              <TextEffect
                preset="fade-in-blur"
                speedReveal={calcSpeedReveal(error, 0.02)} // same base factor
                speedSegment={0.3}
                className="text-lg md:text-xl text-slate-600"
              >
                {`Technical details: ${error}`}
              </TextEffect>
            )}

            <motion.div variants={itemVariants} className="pt-6">
              <Button
                size="lg"
                onClick={handleClick}
                disabled={loading}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 drop-shadow-md rounded-lg px-8 font-semibold hover:scale-105 h-12 text-lg shadow-lg hover:shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: -360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Loader className="size-5" />
                    </motion.div>
                    {buttonText}
                  </>
                ) : (
                  <>
                    <div>
                      <Icon className="size-5" />
                    </div>
                    {buttonText}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
