import { ErrorPage } from "@/components/error";

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      title="Whoops! Our servers had a little meltdown... 🫟"
      description="We’re gonna fix it — promise! 🤪"
      buttonText="Try Again"
    />
  );
}

