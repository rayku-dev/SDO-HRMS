"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { files201Api, type File201 } from "@/lib/api/files201";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Files201ManagementPage() {
  const { user } = useAuth({ required: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: allFiles, mutate, isLoading } = useSWR<File201[]>(
    "/files201/all",
    files201Api.getAll,
  );

  const { data: accountFiles } = useSWR<File201[]>(
    selectedAccountId ? `/files201/account/${selectedAccountId}` : null,
    () => selectedAccountId ? files201Api.getByAccount(selectedAccountId) : [],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this file?")) return;
      try {
        await files201Api.delete(id);
        toast.success("File deleted successfully");
        mutate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete file");
      }
    },
    [mutate],
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getUserName = (file: File201) => {
    if (file.account?.employeeProfile) {
      return `${file.account.employeeProfile.firstName || ""} ${
        file.account.employeeProfile.lastName || ""
      }`.trim();
    }
    if (file.account?.teacherProfile?.teacherData) {
      return `${file.account.teacherProfile.teacherData.firstName || ""} ${
        file.account.teacherProfile.teacherData.lastName || ""
      }`.trim();
    }
    return file.account?.email || "Unknown";
  };

  const filteredFiles = allFiles?.filter((file) => {
    const matchesSearch =
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserName(file).toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.account?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || file.account?.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Get unique accounts for user selection
  const accounts = allFiles
    ? Array.from(
        new Map(
          allFiles.map((file) => [file.accountId, file.account]),
        ).entries(),
      ).map(([id, account]) => ({ id, account }))
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">201 Files Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all user files
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name, user name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="REGULAR">Regular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>
            {filteredFiles?.length || 0} file(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles && filteredFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.fileName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getUserName(file)}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.account?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{file.account?.role}</Badge>
                    </TableCell>
                    <TableCell>{file.category || (file as any).fileCategory?.name || "Uncategorized"}</TableCell>
                    <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                    <TableCell>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedAccountId(file.accountId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>User Files</DialogTitle>
                              <DialogDescription>
                                Files for {getUserName(file)} ({file.account?.email})
                              </DialogDescription>
                            </DialogHeader>
                            <UserFilesView accountId={file.accountId} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No files found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UserFilesView({ accountId }: { accountId: string }) {
  const { data: files, isLoading } = useSWR<File201[]>(
    `/files201/account/${accountId}`,
    () => files201Api.getByAccount(accountId),
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!files || files.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No files found.</div>;
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <div>
            <div className="font-medium">{file.fileName}</div>
            <div className="text-sm text-muted-foreground">
              {file.category || (file as any).fileCategory?.name || "Uncategorized"} • {formatFileSize(file.fileSize)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(file.uploadedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
