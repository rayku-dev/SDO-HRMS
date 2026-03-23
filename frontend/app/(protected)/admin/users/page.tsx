"use client";

import { useState, useRef } from "react";
import { useUsers } from "@/hooks/use-users";
import { usersApi, CreateUserData } from "@/lib/api/users";
import * as XLSX from "xlsx";
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
  FileSpreadsheet,
  Copy,
  Check,
  Calendar,
  Briefcase,
  Building,
  UserCheck,
  Download,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  MapPin,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";
import { toast } from "sonner";
import { Role } from "@/@types/auth";
import { Separator } from "@/components/ui/separator";

export default function UserManagementPage() {
  const { users, isLoading, mutate } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [createdUserInfo, setCreatedUserInfo] = useState<{
    employeeNumber: string;
    temporaryPassword: string;
    email: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New user form state
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    nameExtension: "",
    role: "SCHOOL_PERSONNEL",
    isActive: true,
    designation: "",
    appointmentDate: "",
    schedule: "",
    appointment: "",
    jobTitle: "",
    unit: "",
    supervisor: "",
    hrHead: "",
    approver: "",
  });

  const roles: Role[] = [
    "ADMIN",
    "APPROVING_AUTHORITY",
    "EMPLOYEE",
    "HR_ASSOCIATE",
    "HR_HEAD",
    "UNIT_HEAD",
    "SCHOOL_PERSONNEL",
  ];

  const downloadTemplate = () => {
    const headers = [
      "email", "password", "firstName", "lastName", "middleName", "nameExtension", 
      "role", "designation", "jobTitle", "unit", "appointment", "appointmentDate", 
      "schedule", "supervisor", "hrHead", "approver"
    ];
    
    // Example row with instructions
    const data = [
      {
        email: "example.user@sdo.gov.ph",
        password: "Welcome123!",
        firstName: "Example",
        lastName: "User",
        middleName: "Test",
        nameExtension: "Jr.",
        role: "SCHOOL_PERSONNEL",
        designation: "DISTRICT OFFICE",
        jobTitle: "TEACHER I",
        unit: "ELEMENTARY",
        appointment: "PERMANENT",
        appointmentDate: "2024-03-24",
        schedule: "8:00 AM - 5:00 PM",
        supervisor: "LORENA B. SANTOS",
        hrHead: "CARLOS P. REYES",
        approver: "DR. EMELITA G. PATAWARAN"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    
    // Set column widths
    const wscols = headers.map(() => ({ wch: 20 }));
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Template");
    
    XLSX.writeFile(workbook, "EPDS_User_Bulk_Import_Template.xlsx");
    toast.success("Download started!");
  };

  const filteredUsers =
    users?.filter((u) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        u.email.toLowerCase().includes(searchLower) ||
        u.firstName?.toLowerCase().includes(searchLower) ||
        u.lastName?.toLowerCase().includes(searchLower) ||
        u.employeeNumber?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await usersApi.create(formData);
      
      setCreatedUserInfo({
        employeeNumber: (data as any).employeeNumber,
        temporaryPassword: (data as any).temporaryPassword,
        email: data.email,
      });
      
      toast.success("User account created successfully");
      setIsAddDialogOpen(false);
      setIsSuccessModalOpen(true);
      
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        middleName: "",
        nameExtension: "",
        role: "SCHOOL_PERSONNEL",
        isActive: true,
        designation: "",
        appointmentDate: "",
        schedule: "",
        appointment: "",
        jobTitle: "",
        unit: "",
        supervisor: "",
        hrHead: "",
        approver: "",
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
        toast.warning(
          `Import partial: ${response.success} success, ${response.failed} failed`,
          {
            id: "import-toast",
            duration: 5000,
          },
        );
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

  const openUserView = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl h-[80vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-6"></div>
        <p className="text-muted-foreground animate-pulse">
          Gathering system accounts...
        </p>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              System Accounts
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
              Primary administrative control for {users?.length || 0} system
              identities. Manage core authentication and roles.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            className="h-12 px-6 rounded-xl hover:bg-white/5 border border-white/5"
            onClick={downloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>

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
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2rem] border-white/10 bg-card/95 backdrop-blur-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <DialogTitle className="text-xl">Create Account</DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground/80">
                  Provision a new system identity. Employee number will be automatically generated.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Users className="h-4 w-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="middleName" className="text-xs uppercase tracking-wider opacity-70">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        placeholder="Quincy"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameExtension" className="text-xs uppercase tracking-wider opacity-70">Extension (e.g. Jr, III)</Label>
                      <Input
                        id="nameExtension"
                        value={formData.nameExtension}
                        onChange={(e) => setFormData({ ...formData, nameExtension: e.target.value })}
                        placeholder="Jr."
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Account Credentials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Label htmlFor="password" className="text-xs uppercase tracking-wider opacity-70">Temporary Password (Optional)</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password || ""}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Leave blank for auto-gen"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Employment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-xs uppercase tracking-wider opacity-70">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="School/Station"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-xs uppercase tracking-wider opacity-70">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="Teacher I"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-xs uppercase tracking-wider opacity-70">Unit/Department</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="MAPEH"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointment" className="text-xs uppercase tracking-wider opacity-70">Appointment</Label>
                      <Input
                        id="appointment"
                        value={formData.appointment}
                        onChange={(e) => setFormData({ ...formData, appointment: e.target.value })}
                        placeholder="Permanent/Casual"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate" className="text-xs uppercase tracking-wider opacity-70">Appointment Date</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule" className="text-xs uppercase tracking-wider opacity-70">Schedule</Label>
                      <Input
                        id="schedule"
                        value={formData.schedule}
                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                        placeholder="7:00 AM - 4:00 PM"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <UserCheck className="h-4 w-4" /> Hierarchy & Signatories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supervisor" className="text-xs uppercase tracking-wider opacity-70">Immediate Supervisor</Label>
                      <Input
                        id="supervisor"
                        value={formData.supervisor}
                        onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                        placeholder="Name of Supervisor"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrHead" className="text-xs uppercase tracking-wider opacity-70">HR Head</Label>
                      <Input
                        id="hrHead"
                        value={formData.hrHead}
                        onChange={(e) => setFormData({ ...formData, hrHead: e.target.value })}
                        placeholder="Name of HR Head"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approver" className="text-xs uppercase tracking-wider opacity-70">Approving Officer</Label>
                      <Input
                        id="approver"
                        value={formData.approver}
                        onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                        placeholder="Name of Approver"
                        className="bg-background/50 border-white/10 h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs uppercase tracking-wider opacity-70">System Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-11">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role.replace(/_/g, " ")}</SelectItem>
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

          {/* User Creation Success Modal */}
          <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-white/10 bg-card/95 backdrop-blur-2xl">
              <DialogHeader>
                <div className="flex flex-col items-center justify-center pt-4 pb-2">
                  <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <DialogTitle className="text-2xl font-bold">User Created Successfully!</DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground mt-2">
                    Please securely share these credentials with the new employee.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-6" id="success-modal-content">
                <div className="p-6 rounded-3xl bg-black/20 border border-white/10 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Employee Number</p>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="font-mono text-xl font-bold tracking-wider">{createdUserInfo?.employeeNumber || "PENDING"}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(createdUserInfo?.employeeNumber || "");
                          toast.success("Employee number copied!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Temporary Password</p>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="font-mono text-xl font-bold tracking-wider">{createdUserInfo?.temporaryPassword || "••••••••"}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(createdUserInfo?.temporaryPassword || "");
                          toast.success("Password copied!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-500/80 leading-relaxed">
                    This password is temporary. The employee will not be asked to change it on first login automatically, 
                    but they can update it in their profile settings.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full h-12 rounded-xl text-lg font-bold shadow-xl shadow-primary/20"
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* User View Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2rem] border-white/10 bg-card/95 backdrop-blur-2xl p-0 overflow-hidden">
             {selectedUser && (
               <div className="relative">
                 {/* Decorative background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
                 
                 <div className="p-8 space-y-8 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-primary/40 ring-4 ring-primary/20">
                          {selectedUser.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-3xl font-black tracking-tighter text-foreground">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                             <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] px-3 py-1">
                               {selectedUser.role?.replace(/_/g, " ")}
                             </Badge>
                             <div className={`h-2 w-2 rounded-full ${selectedUser.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                             <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                               {selectedUser.isActive ? "Registry Active" : "Account Suspended"}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Personal & Account Section */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60 flex items-center gap-2">
                          <Fingerprint className="h-3 w-3" /> Identity & Access
                        </h3>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Employee ID</span>
                            <span className="text-sm font-mono font-bold tracking-wider">{selectedUser.employeeNumber || "N/A"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Email Address</span>
                            <span className="text-sm font-medium">{selectedUser.email}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Full Name</span>
                            <span className="text-sm font-medium">
                              {selectedUser.firstName} {selectedUser.middleName && selectedUser.middleName + " "}{selectedUser.lastName} {selectedUser.nameExtension}
                            </span>
                          </div>
                        </div>
                      </section>

                      {/* Employment Section */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60 flex items-center gap-2">
                          <BriefcaseBusiness className="h-3 w-3" /> Professional Status
                        </h3>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Job Title</span>
                            <span className="text-sm font-medium">{selectedUser.jobTitle || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Designation</span>
                            <span className="text-sm font-medium">{selectedUser.designation || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Unit / Dept</span>
                            <span className="text-sm font-medium">{selectedUser.unit || "---"}</span>
                          </div>
                        </div>
                      </section>

                      {/* Schedule & Appointment */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60 flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Timing & Tenure
                        </h3>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Work Schedule</span>
                            <span className="text-sm font-medium">{selectedUser.schedule || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Appointment</span>
                            <span className="text-sm font-medium uppercase text-[10px] tracking-widest">{selectedUser.appointment || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Appointment Date</span>
                            <span className="text-sm font-medium">
                              {selectedUser.appointmentDate ? new Date(selectedUser.appointmentDate).toLocaleDateString() : "---"}
                            </span>
                          </div>
                        </div>
                      </section>

                      {/* Hierarchy Section */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60 flex items-center gap-2">
                          <MapPin className="h-3 w-3" /> Reporting Path
                        </h3>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Supervisor</span>
                            <span className="text-sm font-medium">{selectedUser.supervisor || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">HR Head</span>
                            <span className="text-sm font-medium">{selectedUser.hrHead || "---"}</span>
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Approving Officer</span>
                            <span className="text-sm font-medium">{selectedUser.approver || "---"}</span>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="pt-4 flex justify-end">
                       <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="rounded-xl border-white/10 hover:bg-white/5 px-8">
                         Close
                       </Button>
                    </div>
                 </div>
               </div>
             )}
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
              placeholder="Search by name, email or employee ID..."
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
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">
                    Identity
                  </th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">
                    System Role
                  </th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70">
                    Connectivity
                  </th>
                  <th className="px-8 py-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground opacity-70 text-right">
                    Admin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => openUserView(u)}
                      className="group hover:bg-white/[0.04] transition-all duration-300 cursor-pointer active:scale-[0.99]"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/5 flex items-center justify-center text-primary font-bold shadow-inner ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            {u.firstName?.[0] || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                                {u.firstName || u.lastName
                                  ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                                  : "Uninitialized User"}
                              </div>
                              {u.employeeNumber && (
                                <Badge variant="outline" className="h-5 text-[9px] uppercase tracking-tighter bg-white/5 border-white/10 opacity-60">
                                  ID: {u.employeeNumber}
                                </Badge>
                              )}
                            </div>
                            <div className="text-muted-foreground/60 text-xs flex items-center gap-1.5 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] bg-white/5 border-white/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest letter-spacing-1"
                        >
                          <Shield className="h-3 w-3 mr-2 opacity-70" />
                          {(u.role || "REGULAR").replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${u.isActive ? "bg-emerald-500 shadow-emerald-500/50" : "bg-red-500 shadow-red-500/50"}`}
                          />
                          <span
                            className={`text-xs font-medium uppercase tracking-wider ${u.isActive ? "text-emerald-500/80" : "text-red-500/80"}`}
                          >
                            {u.isActive ? "Registry Active" : "Suspended"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground group-hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(u.id, u.email);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
                        <h3 className="text-lg font-semibold text-foreground/70 mb-2">
                          No identities found
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Refine your search parameters or synchronize your
                          registry via bulk import.
                        </p>
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
            Administrative Control Layer • Registry v1.0 •{" "}
            {new Date().toLocaleDateString()}
          </div>
        )}
      </Card>

      {/* Import Guidance */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 hover:bg-primary/10 transition-all cursor-pointer group" onClick={downloadTemplate}>
          <FileSpreadsheet className="h-5 w-5 text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">Get Format Template <Download className="h-3 w-3" /></h4>
            <p className="text-xs text-muted-foreground">
              Click here to download the correct XLSX structure. Required headers: Email, Role, Proper Names.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
          <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Auto-Provisioning</h4>
            <p className="text-xs text-muted-foreground">
              Default passwords (Welcome123!) and default roles (School
              Personnel) are applied automatically if missing.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Row Interaction</h4>
            <p className="text-xs text-muted-foreground">
              Click any user row to view their full employment data, hierarchy path, and system status across registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
