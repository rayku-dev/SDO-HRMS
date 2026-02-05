export const tokenStorage = {
  get: () =>
    typeof window === "undefined"
      ? null
      : sessionStorage.getItem("accessToken"),
  set: (token: string) => {
    if (typeof window !== "undefined")
      sessionStorage.setItem("accessToken", token);
  },
  remove: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("accessToken");
    }
  },
};
