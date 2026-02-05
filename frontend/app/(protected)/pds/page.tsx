"use client";

import { useState, useEffect } from "react";
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

export default function MyPdsPage() {
  const router = useRouter();
  const { user } = useAuth({ required: true });
  const [pdsData, setPdsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPds();
    }
  }, [user?.id]);

  const loadPds = async () => {
    try {
      setIsLoading(true);
      const data = await pdsApi.getByUserId(user!.id);
      // getByUserId returns null for 404, so this handles both cases
      setPdsData(data || null);
    } catch (error: any) {
      // Only catch actual errors (404 is handled in pdsApi.getByUserId)
      toast.error(error.response?.data?.message || "Failed to load PDS");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }

    try {
      setIsSaving(true);

      // Clean up arrays one more time to ensure they're proper arrays of objects
      const cleanedData = { ...data };

      // Ensure workExperience is an array of objects (not nested arrays)
      if (Array.isArray(cleanedData.workExperience)) {
        cleanedData.workExperience = cleanedData.workExperience.filter(
          (item: any) =>
            item && typeof item === "object" && !Array.isArray(item)
        );
      } else {
        cleanedData.workExperience = [];
      }

      // Ensure voluntaryWork is an array of objects
      if (Array.isArray(cleanedData.voluntaryWork)) {
        cleanedData.voluntaryWork = cleanedData.voluntaryWork.filter(
          (item: any) =>
            item && typeof item === "object" && !Array.isArray(item)
        );
      } else {
        cleanedData.voluntaryWork = [];
      }

      // Ensure trainingPrograms is an array of objects
      if (Array.isArray(cleanedData.trainingPrograms)) {
        cleanedData.trainingPrograms = cleanedData.trainingPrograms.filter(
          (item: any) =>
            item && typeof item === "object" && !Array.isArray(item)
        );
      } else {
        cleanedData.trainingPrograms = [];
      }

      await pdsApi.upsert({ ...cleanedData, userId: user.id });
      toast.success("PDS saved successfully!");
      // Reload PDS to get the saved data with all fields
      await loadPds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save PDS");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!pdsData) {
      toast.error("Please save the form first");
      return;
    }

    try {
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PDS...</p>
        </div>
      </div>
    );
  }

  // Get initial empty data structure for new PDS
  const getInitialData = () => ({
    userId: user?.id || "",
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
      email: user?.email || "",
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
  });

  // If no PDS exists, show create form instead of error message
  const displayData = pdsData || getInitialData();
  const isNewPds = !pdsData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Personal Data Sheet</h1>
            <p className="text-muted-foreground mt-1">
              {isNewPds
                ? "Create your Personal Data Sheet"
                : "View and update your PDS information"}
            </p>
          </div>
        </div>
        {!isNewPds && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!pdsData}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide Preview" : "Preview PDF"}
            </Button>
            <Button onClick={handleGeneratePdf} disabled={!pdsData || isSaving}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        )}
      </div>

      {showPreview && displayData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <PdfPreview pdsData={displayData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <PdsForm
            key={pdsData ? "edit" : "new"} // Force re-render when switching between new/edit
            initialData={displayData}
            onSave={handleSave}
            isLoading={isSaving}
          />
        </CardContent>
      </Card>
    </div>
  );
}
