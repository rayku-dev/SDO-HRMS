"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Users, Activity, FileStack, Shield, ShoppingCart, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { pdsApi, type PdsData } from "@/lib/api/pds";
import { files201Api } from "@/lib/api/files201";
import { toast } from "sonner";
import TallyCard from "@/components/reusable/tally-card";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { users, isLoading: usersLoading } = useUsers();
  const [pdsCount, setPdsCount] = useState<number>(0);
  const [file201Count, setFile201Count] = useState<number>(0);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      const fetchStats = async () => {
        try {
          setIsStatsLoading(true);
          const [pdsList, filesList] = await Promise.all([
            pdsApi.getAll(),
            files201Api.getAll()
          ]);
          setPdsCount(pdsList.length);
          setFile201Count(filesList.length);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        } finally {
          setIsStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show admin dashboard
  if (user.role === "ADMIN") {
    return (
      <AdminDashboard 
        users={users} 
        isLoading={usersLoading || isStatsLoading} 
        pdsCount={pdsCount} 
        file201Count={file201Count} 
      />
    );
  }

  // Show regular user dashboard
  return <UserDashboard user={user} />;
}

function AdminDashboard({
  users,
  isLoading,
  pdsCount,
  file201Count,
}: {
  users?: any[];
  isLoading: boolean;
  pdsCount: number;
  file201Count: number;
}) {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground tracking-tight">System Registry Metrics</h1>
        <p className="text-muted-foreground">
          Real-time administrative overview of system identities and records.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <TallyCard
          icon={FileStack}
          title="Uploaded 201"
          value={file201Count.toString()}
          change="System documents"
          changeType="neutral"
          iconColor="text-white"
          iconBgColor="bg-amber-500"
        />
        <TallyCard
          icon={FileText}
          title="PDS"
          value={pdsCount.toString()}
          change="Personal data sheets"
          changeType="neutral"
          iconColor="text-white"
          iconBgColor="bg-purple-500"
        />
        <TallyCard
          icon={Users}
          title="Total users"
          value={users?.length.toString() || "0"}
          change="Registered accounts"
          changeType="increase"
          iconColor="text-white"
          iconBgColor="bg-emerald-500"
        />
        <TallyCard
          icon={Activity}
          title="Active user"
          value={users?.filter((u) => u.isActive).length.toString() || "0"}
          change="Active connections"
          changeType="increase"
          iconColor="text-white"
          iconBgColor="bg-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/pds">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    PDS Management
                  </CardTitle>
                  <CardDescription>Manage Personal Data Sheets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, view, and manage Personal Data Sheets for all users
              </p>
              <Button className="w-full">Go to PDS Management</Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users && users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">
                          {user.firstName || user.lastName
                            ? `${user.firstName || ""} ${
                                user.lastName || ""
                              }`.trim()
                            : "Unnamed User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No users found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDashboard({ user }: { user: any }) {
  const [pdsData, setPdsData] = useState<PdsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadUserPds();
    }
  }, [user?.id]);

  const loadUserPds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await pdsApi.getByUserId(user.id);
      // getByUserId returns null for 404, so this handles both cases
      setPdsData(data || null);
    } catch (err: any) {
      // Only catch actual errors (404 is handled in pdsApi.getByUserId)
      setError(err.response?.data?.message || "Failed to load PDS");
      toast.error("Failed to load PDS");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your account
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">
                {user.firstName || user.lastName
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                  : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Current account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Access Level</span>
              <span className="text-sm">Standard</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PDS Status</span>
              <Badge
                variant={
                  pdsData
                    ? pdsData.status === "submitted" ||
                      pdsData.status === "approved"
                      ? "default"
                      : "secondary"
                    : "outline"
                }
              >
                {pdsData ? pdsData.status || "draft" : "Not Created"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDS Section for Regular Users */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Personal Data Sheet
          </CardTitle>
          <CardDescription>
            View and manage your Personal Data Sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your PDS...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : pdsData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Your Personal Data Sheet</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated:{" "}
                      {new Date(pdsData.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      pdsData.status === "submitted" ||
                      pdsData.status === "approved"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {pdsData.status || "draft"}
                  </Badge>
                  <Link href="/pds">
                    <Button variant="outline" size="sm">
                      View/Edit PDS
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You don't have a Personal Data Sheet yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Create your Personal Data Sheet to get started.
              </p>
              <Link href="/pds">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create My PDS
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
