"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export default function EditProfileForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "I'm a software developer...",
    url1: "https://shadcn.com",
    url2: "http://twitter.com/shadcn",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Profile updated successfully!", {
      description: "Your changes have been saved.",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="shadcn"
                value={formData.username}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                This is your public display name. It can be your real name or a
                pseudonym.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="shadcn@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                You can manage verified email addresses in your email settings.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                value={formData.bio}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                You can <span>@mention</span> other users and organizations to
                link to them.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url1">URLs</Label>
              <p className="text-sm text-muted-foreground">
                Add links to your website, blog, or social media profiles.
              </p>
              <Input
                id="url1"
                name="url1"
                type="url"
                value={formData.url1}
                onChange={handleChange}
              />
              <Input
                id="url2"
                name="url2"
                type="url"
                value={formData.url2}
                onChange={handleChange}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
