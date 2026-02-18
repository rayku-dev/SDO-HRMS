"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GridBackground from "@/components/backgrounds/grid-background";
import { SoundWaveAnimation } from "@/components/backgrounds/sound-wave-animation";
import FloatingIcons from "@/components/backgrounds/floating-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthError } from "@/@types/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      const from = searchParams.get("from") || "/dashboard";
      toast.success("Welcome back!");
      router.push(from);
      router.refresh();
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-4">
        <Button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="bg-transparent backdrop-blur-sm border border-border/50 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* <p className="text-sm text-center text-muted-foreground">
                {"Don't have an account? "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register
                </Link>
              </p> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
