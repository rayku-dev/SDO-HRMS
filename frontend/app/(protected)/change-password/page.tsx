"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, mutate, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setIsSuccessModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLogout = async () => {
    await logout();
    router.push("/login");
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Matches confirm password", met: newPassword === confirmPassword && newPassword !== "" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/50 to-background">
      <AnimatePresence>
        {!isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-white/10 shadow-2xl bg-card/50 backdrop-blur-xl">
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Set New Password
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    To continue to your workstation, please update your temporary
                    credentials.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Temporary Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="pr-10 h-12 bg-background/50 border-white/10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrent ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="pr-10 h-12 bg-background/50 border-white/10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNew ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 bg-background/50 border-white/10"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-primary" /> Security
                      Baseline
                    </h4>
                    <ul className="space-y-2">
                      {passwordRequirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          {req.met ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-muted-foreground/30 shrink-0" />
                          )}
                          <span
                            className={
                              req.met ? "text-foreground" : "text-muted-foreground"
                            }
                          >
                            {req.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
                    disabled={isLoading || !passwordRequirements.every((r) => r.met)}
                  >
                    {isLoading ? "Updating Secure Layer..." : "Finalize Changes"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    This process is mandatory for all newly provisioned accounts
                    to maintain system-wide integrity.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isSuccessModalOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader className="text-center pt-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold">Security Updated</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Your account has been successfully hardened with your new credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 text-center">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Account Protection Active
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For your security, you must re-authenticate with your new password to access the system workstation.
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center pb-4">
            <Button
              onClick={handleConfirmLogout}
              className="w-full h-12 rounded-xl text-md font-bold flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Re-authenticate Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
