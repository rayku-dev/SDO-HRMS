"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import TallyCard from "@/components/reusable/tally-card";
import { Users, ShoppingCart, Activity, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { users, isLoading: usersLoading } = useUsers();

  if (authLoading || usersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TallyCard
          icon={Users}
          title="Total Users"
          value={users?.length.toString() || "0"}
          change="12% from last month"
          changeType="increase"
          iconColor="text-white"
          iconBgColor="bg-emerald-500"
        />
        <TallyCard
          icon={ShoppingCart}
          title="Active Users"
          value={users?.filter((u) => u.isActive).length.toString() || "0"}
          change="8% from last month"
          changeType="increase"
          iconColor="text-white"
          iconBgColor="bg-blue-500"
        />
        <TallyCard
          icon={Activity}
          title="Admins"
          value={
            users?.filter((u) => u.role === "ADMIN").length.toString() || "0"
          }
          change="2 new this week"
          changeType="neutral"
          iconColor="text-white"
          iconBgColor="bg-purple-500"
        />
        <TallyCard
          icon={AlertTriangle}
          title="Pending"
          value="3"
          change="Needs attention"
          changeType="decrease"
          iconColor="text-white"
          iconBgColor="bg-amber-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your recent activity and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart or content goes here
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Activity list goes here
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            Actions go here
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Important updates</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            Notifications go here
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
