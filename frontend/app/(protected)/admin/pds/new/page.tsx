"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { pdsApi } from "@/lib/api/pds";
import { PdsForm } from "@/components/pds/pds-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useUsers } from "@/hooks/use-users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Dynamically import PDF preview to avoid SSR issues
const PdfPreview = dynamic(
  () =>
    import("@/components/pds/pdf-preview").then((mod) => ({
      default: mod.PdfPreview,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 border rounded-lg">
        Loading PDF preview...
      </div>
    ),
  }
);

export default function NewPdsPage() {
  const router = useRouter();
  const { user } = useAuth({ required: true });
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [pdsData, setPdsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);

  // Check if PDS already exists when user selection changes
  useEffect(() => {
    if (!selectedUserId) return;

    const checkExistingPds = async () => {
      try {
        setCheckingExisting(true);
        const existing = await pdsApi.getByUserId(selectedUserId);
        if (existing) {
          // PDS exists - redirect to edit page
          toast.warning(
            "A PDS already exists for this user. Redirecting to edit page..."
          );
          setTimeout(() => {
            router.push(`/admin/pds/${selectedUserId}`);
          }, 1000);
          return;
        }
      } catch (error: any) {
        // PDS doesn't exist (404), that's fine - we can create new one
        if (error.response?.status !== 404) {
          console.error("Error checking existing PDS:", error);
          toast.error("Error checking for existing PDS");
        }
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingPds();
  }, [selectedUserId, router]);

  const initialData = useMemo(
    () => ({
      userId: selectedUserId || "",
      personalData: {
        surname: "",
        firstName: "",
        middleName: "",
        nameExtension: "",
        dateOfBirth: "",
        placeOfBirth: "",
        sex: "",
        civilStatus: "",
        civilStatusOthersText: "",
        height: "",
        weight: "",
        bloodType: "",
        gsisId: "",
        pagibigId: "",
        philhealthId: "",
        sssId: "",
        tin: "",
        agencyEmployeeNo: "",
        citizenship: "Filipino",
        dualCitizenshipType: "",
        dualCitizenshipCountry: "",
        residentialAddress: {
          houseBlockLotNo: "",
          street: "",
          subdivisionVillage: "",
          barangay: "",
          cityMunicipality: "",
          province: "",
          zipCode: "",
        },
        permanentAddress: {
          houseBlockLotNo: "",
          street: "",
          subdivisionVillage: "",
          barangay: "",
          cityMunicipality: "",
          province: "",
          zipCode: "",
        },
        telephoneNo: "",
        mobileNo: "",
        email: users?.find((u) => u.id === selectedUserId)?.email || "",
      },
      familyData: {
        spouse: {
          surname: "",
          firstName: "",
          middleName: "",
          nameExtension: "",
          occupation: "",
          employer: "",
          businessAddress: "",
          telephone: "",
        },
        father: {
          surname: "",
          firstName: "",
          middleName: "",
          nameExtension: "",
        },
        mother: {
          surname: "",
          firstName: "",
          middleName: "",
        },
        children: [],
      },
      educationalData: {
        elementary: {
          name: "",
          basicEducation: "",
          periodFrom: "",
          periodTo: "",
          highestLevel: "",
          yearGraduated: "",
          scholarship: "",
        },
        secondary: {
          name: "",
          basicEducation: "",
          periodFrom: "",
          periodTo: "",
          highestLevel: "",
          yearGraduated: "",
          scholarship: "",
        },
        vocational: {
          name: "",
          basicEducation: "",
          periodFrom: "",
          periodTo: "",
          highestLevel: "",
          yearGraduated: "",
          scholarship: "",
        },
        college: {
          name: "",
          basicEducation: "",
          periodFrom: "",
          periodTo: "",
          highestLevel: "",
          yearGraduated: "",
          scholarship: "",
        },
        graduate: {
          name: "",
          basicEducation: "",
          periodFrom: "",
          periodTo: "",
          highestLevel: "",
          yearGraduated: "",
          scholarship: "",
        },
      },
      civilServiceData: {
        eligibility: [],
      },
      workExperienceData: {
        workExperience: [],
      },
      voluntaryWorkData: {
        voluntaryWork: [],
      },
      trainingProgramsData: {
        trainingPrograms: [],
      },
      otherInfo: {
        skills: [],
        nonAcad: [],
        member: [],
      },
      lastpData: {
        answers: Array(12)
          .fill(null)
          .map(() => ({ value: "", details: "", dateFiled: "", status: "" })),
        references: [{ name: "", address: "", tel: "" }],
        declaration: {
          issuedId: "",
          adminOath: "",
          datePlaceOfIssuance: "",
          dateAccomplished: "",
          place: "",
        },
        declarationChecked: false,
      },
      status: "draft",
    }),
    [selectedUserId, user?.id, user?.email, users]
  );

  const handleSave = async (data: any) => {
    try {
      setIsLoading(true);

      // Ensure userId is set - user must select a user
      if (!selectedUserId) {
        toast.error("Please select a user before saving the PDS.");
        setIsLoading(false);
        return;
      }

      const targetUserId = selectedUserId;

      // Use the selected user ID (or current user if not admin selection)
      const payload = {
        ...data,
        userId: targetUserId,
      };

      console.log("Saving PDS with payload:", payload);

      const response = await pdsApi.upsert(payload);
      console.log("PDS saved successfully:", response);

      toast.success("PDS saved successfully!");
      setPdsData(payload);
    } catch (error: any) {
      console.error("Error saving PDS:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to save PDS";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!pdsData) {
      toast.error("Please save the form first");
      return;
    }

    try {
      setIsLoading(true);
      const blob = await pdsApi.generatePdf(pdsData);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Personal_Data_Sheet.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border bg-card/50 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/pds">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5 text-primary" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">New Personal Data Sheet</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Fill out all required fields
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!pdsData}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Eye className="h-4 w-4 mr-2 text-primary" />
              {showPreview ? "Hide Preview" : "Preview PDF"}
            </Button>
            <Button onClick={handleGeneratePdf} disabled={!pdsData || isLoading} className="shadow-lg shadow-primary/20">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* User selector section */}
        {user?.role === "ADMIN" && users && (
          <div className="max-w-xl rounded-xl border bg-background/50 p-4">
            <Label
              htmlFor="user-select"
              className="text-sm font-medium text-foreground"
            >
              Select User <span className="text-primary">*</span>
            </Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={checkingExisting}
            >
              <SelectTrigger id="user-select" className="mt-2 bg-background border-primary/20 h-10">
                <SelectValue placeholder="Select a user to create PDS for..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName || u.lastName
                      ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                      : "Unnamed User"}{" "}
                    - {u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {checkingExisting && (
              <p className="text-xs text-primary mt-2 animate-pulse">
                Checking for existing PDS...
              </p>
            )}
            {!selectedUserId && (
              <p className="text-xs text-amber-500 mt-2 font-medium">
                ⚠️ Please select a user before filling out the form
              </p>
            )}
          </div>
        )}
      </div>

      {showPreview && pdsData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <PdfPreview pdsData={pdsData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <PdsForm
            key={selectedUserId || user?.id} // Force re-initialize when user changes
            initialData={initialData}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
