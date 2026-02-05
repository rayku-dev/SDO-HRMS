"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { files201Api, type File201 } from "@/lib/api/files201";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, File, Trash2, Grid, List, FolderOpen } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useSWR from "swr";

export default function Files201Page() {
  const { user } = useAuth({ required: true });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: files, mutate, isLoading } = useSWR<File201[]>(
    "/files201/my-files",
    files201Api.getMyFiles,
  );

  const { data: stats } = useSWR("/files201/stats", files201Api.getStats);

  const handleUpload = useCallback(
    async (file: File, categoryId: string, description?: string) => {
      try {
        // Pass categoryId as the 5th argument, category string (legacy) as undefined
        await files201Api.upload(file, undefined, description, undefined, categoryId);
        toast.success("File uploaded successfully");
        mutate();
        setIsUploadOpen(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to upload file");
      }
    },
    [mutate],
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">201 Files</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal files and documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>
                  Upload a file to your 201 folder. Maximum file size is 50MB.
                </DialogDescription>
              </DialogHeader>
              <UploadForm onUpload={handleUpload} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(stats.categories).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>Your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {files && files.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.fileName}</TableCell>
                      <TableCell>{file.category || (file as any).fileCategory?.name || "Uncategorized"}</TableCell>
                      <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                      <TableCell>
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No files uploaded yet. Click "Upload File" to get started.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files && files.length > 0 ? (
            files.map((file) => (
              <Card key={file.id}>
                <CardHeader>
                  <CardTitle className="text-sm truncate">{file.fileName}</CardTitle>
                  <CardDescription>{file.category || (file as any).fileCategory?.name || "Uncategorized"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Size: {formatFileSize(file.fileSize)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No files uploaded yet. Click "Upload File" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UploadForm({
  onUpload,
}: {
  onUpload: (file: File, categoryId: string, description?: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { data: categories } = useSWR("/files201/categories", files201Api.getCategories);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && categoryId) {
      onUpload(file, categoryId, description || undefined);
      setFile(null);
      setCategoryId("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="File description..."
        />
      </div>
      <Button type="submit" className="w-full" disabled={!file || !categoryId}>
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
    </form>
  );
}

