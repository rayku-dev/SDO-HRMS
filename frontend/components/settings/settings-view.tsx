"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsView() {
  const [settings, setSettings] = useState({
    emailVerificationEnabled: true,
    qrCodeEnabled: true,
    webAuthnEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    pushNotificationsEnabled: false,
    notificationFrequency: "daily",
    theme: "light",
    seasonalThemeEnabled: false,
    language: "en",
    publicRegistrationEnabled: true,
    maxUsers: 100,
    backupFrequency: "daily",
    auditLogRetentionDays: 365,
  });

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleChange = (setting: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="rounded-full bg-card p-3">
            <Settings className="h-6 w-6" />
          </span>

          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleChange("theme", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="seasonalTheme"
                  checked={settings.seasonalThemeEnabled}
                  onCheckedChange={() => handleToggle("seasonalThemeEnabled")}
                />
                <Label htmlFor="seasonalTheme">Enable Seasonal Theme</Label>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailVerification"
                  checked={settings.emailVerificationEnabled}
                  onCheckedChange={() =>
                    handleToggle("emailVerificationEnabled")
                  }
                />
                <Label htmlFor="emailVerification">
                  Enable Email Verification
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="qrCode"
                  checked={settings.qrCodeEnabled}
                  onCheckedChange={() => handleToggle("qrCodeEnabled")}
                />
                <Label htmlFor="qrCode">Enable QR Code Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="webAuthn"
                  checked={settings.webAuthnEnabled}
                  onCheckedChange={() => handleToggle("webAuthnEnabled")}
                />
                <Label htmlFor="webAuthn">Enable WebAuthn</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotificationsEnabled}
                  onCheckedChange={() =>
                    handleToggle("emailNotificationsEnabled")
                  }
                />
                <Label htmlFor="emailNotifications">
                  Enable Email Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotificationsEnabled}
                  onCheckedChange={() =>
                    handleToggle("smsNotificationsEnabled")
                  }
                />
                <Label htmlFor="smsNotifications">
                  Enable SMS Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotificationsEnabled}
                  onCheckedChange={() =>
                    handleToggle("pushNotificationsEnabled")
                  }
                />
                <Label htmlFor="pushNotifications">
                  Enable Push Notifications
                </Label>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notificationFrequency">
                  Notification Frequency
                </Label>
                <Select
                  value={settings.notificationFrequency}
                  onValueChange={(value) =>
                    handleChange("notificationFrequency", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Manage advanced application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publicRegistration"
                  checked={settings.publicRegistrationEnabled}
                  onCheckedChange={() =>
                    handleToggle("publicRegistrationEnabled")
                  }
                />
                <Label htmlFor="publicRegistration">
                  Enable Public Registration
                </Label>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="maxUsers">Maximum Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) =>
                    handleChange("maxUsers", Number.parseInt(e.target.value))
                  }
                  className="w-[180px]"
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) =>
                    handleChange("backupFrequency", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auditLogRetention">
                  Audit Log Retention (days)
                </Label>
                <Input
                  id="auditLogRetention"
                  type="number"
                  value={settings.auditLogRetentionDays}
                  onChange={(e) =>
                    handleChange(
                      "auditLogRetentionDays",
                      Number.parseInt(e.target.value),
                    )
                  }
                  className="w-[180px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
