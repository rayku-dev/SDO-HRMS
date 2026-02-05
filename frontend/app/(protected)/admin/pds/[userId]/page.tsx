"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditPdsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { user } = useAuth({ required: true });
  const [pdsData, setPdsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (userId) {
      loadPds();
    }
  }, [userId]);

  const loadPds = async () => {
    try {
      setIsLoading(true);
      const data = await pdsApi.getByUserId(userId);
      setPdsData(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load PDS");
      router.push("/admin/pds");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      setIsSaving(true);

      await pdsApi.upsert({ ...data, userId });
      toast.success("PDS saved successfully!");
      setPdsData(data);
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

  if (!pdsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              PDS not found
            </p>
            <Link href="/admin/pds">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to PDS List
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pds">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Personal Data Sheet</h1>
            <p className="text-muted-foreground mt-1">Update PDS information</p>
          </div>
        </div>
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
            initialData={pdsData}
            onSave={handleSave}
            isLoading={isSaving}
          />
        </CardContent>
      </Card>
    </div>
  );
}
