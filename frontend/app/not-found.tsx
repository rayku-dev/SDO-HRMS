import { ErrorPage } from "@/components/error";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Oops, I think we're lost... 🧭"
      description="Let's get you back to somewhere familiar."
      buttonText="Go Back"
    />
  );
}
