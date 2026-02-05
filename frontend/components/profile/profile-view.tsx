"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Link, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/home/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </a>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="Profile picture"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">John Doe</CardTitle>
              <CardDescription>Full Stack Developer</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-muted-foreground" />
              <a
                href="https://johndoe.com"
                className="text-primary hover:underline"
              >
                https://johndoe.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Joined January 2023</span>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <p className="text-muted-foreground">No posts yet.</p>
            </TabsContent>
            <TabsContent value="projects">
              <p className="text-muted-foreground">No projects yet.</p>
            </TabsContent>
            <TabsContent value="activity">
              <p className="text-muted-foreground">No recent activity.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
