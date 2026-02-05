"use client";

import { useState, useRef } from "react";
import { useUsers } from "@/hooks/use-users";
import { usersApi, CreateUserData } from "@/lib/api/users";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  Trash2, 
  Upload,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { Role } from "@/@types/auth";

export default function UserManagementPage() {
  const { users, isLoading, mutate } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New user form state
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "REGULAR",
    isActive: true, // Matching Account schema behavior
  });

  const roles: Role[] = [
    "ADMIN",
    "APPROVING_AUTHORITY",
    "EMPLOYEE",
    "HR_ASSOCIATE",
    "HR_HEAD",
    "UNIT_HEAD",
    "SCHOOL_PERSONNEL",
    "REGULAR",
  ];

  const filteredUsers = users?.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(searchLower) ||
      u.firstName?.toLowerCase().includes(searchLower) ||
      u.lastName?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await usersApi.create(formData);
      toast.success("User account created successfully");
      setIsAddDialogOpen(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "REGULAR",
        isActive: true,
      });
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      toast.loading("Importing users...", { id: "import-toast" });
      
      const response = await usersApi.import(file);
      
      if (response.failed > 0) {
        toast.warning(`Import partial: ${response.success} success, ${response.failed} failed`, {
          id: "import-toast",
          duration: 5000,
        });
        console.error("Import failures:", response.details);
      } else {
        toast.success(`Successfully imported ${response.success} users!`, {
          id: "import-toast",
        });
      }
      
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import file", {
        id: "import-toast",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      await usersApi.delete(id);
      toast.success("User deleted successfully");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl h-[80vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-6"></div>
        <p className="text-muted-foreground animate-pulse">Gathering system accounts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />

      {/* Header Panel */}
      <div className="mb-8 flex flex-col gap-6 rounded-[2rem] border bg-card/40 p-8 shadow-2xl backdrop-blur-2xl md:flex-row md:items-center md:justify-between border-white/10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/20 rounded-2xl shadow-inner border border-primary/20">
            <Users className="h-8 w-8 text-primary shadow-sm" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">System Accounts</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
              Primary administrative control for {users?.length || 0} system identities. Manage core authentication and roles.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 h-12 px-6 rounded-xl"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? "Processing..." : "Import Bulk (XLSX)"}
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 rounded-xl shadow-xl shadow-purple-500/30 font-semibold">
                <UserPlus className="mr-2 h-4 w-4" />
                Individual Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-white/10 bg-card/95 backdrop-blur-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-primary/10 rounded-lg">
                      <UserPlus className="h-5 w-5 text-primary" />
                   </div>
                   <DialogTitle className="text-xl">Create Account</DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground/80">
                  Provision a new system identity. This matches the core Account schema requirements.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs uppercase tracking-wider opacity-70">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="bg-background/50 border-white/10 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs uppercase tracking-wider opacity-70">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="bg-background/50 border-white/10 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider opacity-70">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="bg-background/50 border-white/10 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider opacity-70">Initial Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="bg-background/50 border-white/10 h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs uppercase tracking-wider opacity-70">System Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/10 h-11">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider opacity-70">Account Status</Label>
                    <div className="flex items-center h-11 px-3 bg-background/50 border border-white/10 rounded-md">
                      <Label htmlFor="is-active" className="flex-1 text-sm font-normal text-muted-foreground mr-4">Enabled</Label>
                      <Switch
                        id="is-active"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-md font-bold">
                    {isSubmitting ? "Provisioning..." : "Confirm Identity"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-white/10 bg-card/40 backdrop-blur-md shadow-3xl rounded-[2rem] overflow-hidden border-none ring-1 ring-white/10">
        <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search system registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 text-lg w-full md:w-[400px]"
              />
           </div>
           <div className="text-sm text-muted-foreground bg-black/20 px-4 py-2 rounded-full border border-white/5">
              Showing <strong>{filteredUsers.length}</strong> accounts in registry
           </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">Identity</th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">System Role</th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">Connectivity</th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70 text-right">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="group hover:bg-primary/[0.03] transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/5 flex items-center justify-center text-primary font-bold shadow-inner ring-1 ring-primary/20">
                            {u.firstName?.[0] || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-base tracking-tight mb-0.5">
                              {u.firstName || u.lastName 
                                ? `${u.firstName || ""} ${u.lastName || ""}`.trim() 
                                : "Uninitialized User"}
                            </div>
                            <div className="text-muted-foreground/60 text-xs flex items-center gap-1.5">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest letter-spacing-1">
                          <Shield className="h-3 w-3 mr-2 opacity-70" />
                          {(u.role || "REGULAR").replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${u.isActive ? "bg-emerald-500 shadow-emerald-500/50" : "bg-red-500 shadow-red-500/50"}`} />
                          <span className={`text-xs font-medium uppercase tracking-wider ${u.isActive ? "text-emerald-500/80" : "text-red-500/80"}`}>
                            {u.isActive ? "Primary Active" : "Suspended"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground group-hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <div className="max-w-xs mx-auto">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Users className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground/70 mb-2">No identities found</h3>
                        <p className="text-muted-foreground text-sm">Refine your search parameters or synchronize your registry via bulk import.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        {filteredUsers.length > 0 && (
           <div className="px-8 py-4 bg-black/10 border-t border-white/5 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
              Administrative Control Layer • Registry v1.0 • {new Date().toLocaleDateString()}
           </div>
        )}
      </Card>

      {/* Import Guidance */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
            <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
               <h4 className="font-semibold text-sm mb-1">XLSX Support</h4>
               <p className="text-xs text-muted-foreground">Import thousands of teachers instantly. Supported headers: Email, First Name, Last Name, Role.</p>
            </div>
         </div>
         <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
            <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
               <h4 className="font-semibold text-sm mb-1">Auto-Provisioning</h4>
               <p className="text-xs text-muted-foreground">Default passwords (Welcome123!) and default roles (School Personnel) are applied automatically if missing.</p>
            </div>
         </div>
         <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
            <div>
               <h4 className="font-semibold text-sm mb-1">Schema Integrity</h4>
               <p className="text-xs text-muted-foreground">All imports are validated against the core Account schema before being committed to the database.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
