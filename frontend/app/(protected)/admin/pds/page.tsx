"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { pdsApi, type PdsData } from "@/lib/api/pds";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { FileText, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function PdsAdminPage() {
  const { user } = useAuth();
  const [pdsList, setPdsList] = useState<PdsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      loadPdsList();
    }
  }, [user]);

  const loadPdsList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await pdsApi.getAll();
      setPdsList(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load PDS list");
      toast.error("Failed to load PDS list");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPds = pdsList.filter((pds) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const user = (pds as any).user;
    const email = user?.email?.toLowerCase() || "";
    const firstName = user?.firstName?.toLowerCase() || "";
    const lastName = user?.lastName?.toLowerCase() || "";
    return (
      email.includes(searchLower) ||
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      pds.userId.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PDS list...</p>
        </div>
      </div>
    );
  }

  if (error && !pdsList.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">PDS Management</h1>
            <p className="text-muted-foreground">Manage Personal Data Sheets</p>
          </div>
          <Link href="/admin/pds/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New PDS
            </Button>
          </Link>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Data Sheets</CardTitle>
          <CardDescription>
            {filteredPds.length} PDS record{filteredPds.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPds.length > 0 ? (
              filteredPds.map((pds) => {
                const pdsUser = (pds as any).user;
                return (
                  <div
                    key={pds.userId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {pdsUser?.firstName || pdsUser?.lastName
                              ? `${pdsUser?.firstName || ""} ${
                                  pdsUser?.lastName || ""
                                }`.trim()
                              : "Unnamed Users"}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pdsUser?.email || pds.userId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          pds.status === "submitted"
                            ? "default"
                            : pds.status === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {pds.status || "draft"}
                      </Badge>
                      <Link href={`/admin/pds/${pds.userId}`}>
                        <Button variant="outline" size="sm">
                          View/Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No PDS found matching your search"
                    : "No PDS records found"}
                </p>
                {!searchTerm && (
                  <Link href="/admin/pds/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First PDS
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
