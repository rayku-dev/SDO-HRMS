"use client";

import { ErrorPage } from "@/components/error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html>
      <body>
        <ErrorPage
          code="???"
          title="Well, that wasn’t supposed to happen... 🎲"
          description="Looks like we rolled the dice and got chaos!"
          error={error.message}
          buttonText="Try Again"
          reset={reset}
        />
      </body>
    </html>
  );
}
