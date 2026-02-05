"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { stringify } from "querystring";

// Set up PDF.js worker - Use local worker file (most reliable)
if (typeof window !== "undefined") {
  // Use local worker file from public directory (avoids CDN issues)
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  // Fallback to CDN if local file doesn't work (uncomment if needed)
  // pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
}

interface PdfPreviewProps {
  pdsData: any;
}

export function PdfPreview({ pdsData }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const urlRef = useRef<string | null>(null);
  const documentLoadedRef = useRef(false);

  // Memoize document options to prevent unnecessary reloads (must be at top level)
  const documentOptions = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@4.8.69/cmaps/",
      cMapPacked: true,
    }),
    []
  );

  // Generate PDF when pdsData changes
  useEffect(() => {
    let isCancelled = false;

    const generatePdf = async () => {
      try {
        setLoading(true);
        setError(null);
        // Only reset to initial load if this is truly a new PDF (not just an update)
        // Don't reset page number when regenerating

        // Import the pdsApi dynamically
        const { pdsApi } = await import("@/lib/api/pds");
        const blob = await pdsApi.generatePdf(pdsData);

        // Only update if this effect hasn't been cancelled
        if (!isCancelled) {
          setPdfBlob(blob);
          // Only mark as initial load if we don't have a current PDF (first time)
          if (!pdfBlob) {
            setIsInitialLoad(true);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("PDF generation error:", err);
          const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to generate PDF preview. Please ensure the PDF template file is placed in backend/src/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf";
          setError(errorMessage);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (pdsData) {
      generatePdf();
    }

    // Cleanup function to cancel if component unmounts or pdsData changes
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdsData]);

  // Create blob URL when pdfBlob changes and clean up old URL
  useEffect(() => {
    if (!pdfBlob) {
      if (urlRef.current) {
        // Delay revocation to allow Document to finish cleanup
        setTimeout(() => {
          URL.revokeObjectURL(urlRef.current!);
          urlRef.current = null;
        }, 500);
      }
      setPdfUrl(null);
      return;
    }

    // Store old URL for cleanup
    const oldUrl = urlRef.current;

    // Create new URL
    const url = URL.createObjectURL(pdfBlob);
    urlRef.current = url;
    setPdfUrl(url);

    // Revoke old URL after delay to allow smooth transition
    if (oldUrl && oldUrl !== url) {
      setTimeout(() => {
        if (urlRef.current !== oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
      }, 500);
    }

    // Cleanup function - revoke URL when component unmounts
    return () => {
      if (urlRef.current === url) {
        URL.revokeObjectURL(url);
        urlRef.current = null;
      }
    };
  }, [pdfBlob]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    documentLoadedRef.current = true;
    // Only reset to page 1 on initial load, not on re-renders
    if (isInitialLoad) {
      setPageNumber(1);
      setIsInitialLoad(false);
    }
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Failed to load PDF: ${error.message}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 border rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating PDF preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-destructive/10 p-6">
        <p className="text-destructive font-semibold mb-2">
          Failed to generate PDF preview
        </p>
        <p className="text-destructive text-sm text-center max-w-2xl">
          {error}
        </p>
        <p className="text-muted-foreground text-xs mt-4 text-center">
          Please check the backend console for more details. Make sure the PDF
          template file exists in:
          backend/src/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf
        </p>
      </div>
    );
  }

  if (!pdfBlob || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 border rounded-lg">
        <p className="text-muted-foreground">No PDF available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-20 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.min(2, scale + 0.25))}
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-25 text-center">
            Page {pageNumber} of {numPages || "?"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPageNumber(Math.min(numPages || 1, pageNumber + 1))
            }
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-auto bg-gray-100 max-h-200">
        {pdfUrl && (
          <Document
            key={pdfUrl} // Force remount when URL changes
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("PDF Document load error:", error);
              onDocumentLoadError(error);
            }}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading PDF...</p>
                </div>
              </div>
            }
            options={documentOptions}
          >
            <Page
              key={`page-${pageNumber}`}
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading page...</p>
                  </div>
                </div>
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
}
