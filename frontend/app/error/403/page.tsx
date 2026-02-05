import { ErrorPage } from "@/components/error";

export default function AccessDenied() {
  return (
    <ErrorPage
      code="403"
      title="Whoa! This page is off-limits... ✋"
      description="Check your access rights or return to safety."
      buttonText="Back to Safety"
    />
  );
}
