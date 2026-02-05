export function isJwtExpired(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code === "ERR_JWT_EXPIRED"
  );
}
