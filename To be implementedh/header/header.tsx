import { LogoutButton } from "@/components/reusable/logout-button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { ClientDateTimeDisplay } from "../reusable/date-time";
import { BreadCrumb } from "@/components/header/breadcrumb";
import { FullScreenToggle } from "./fullscreen-toggle";
import { SidebarToggle } from "./sidebar-toggle";
// import { headers } from "next/headers";
import { Button } from "../ui/button";
import AppDrawer from "./app-drawer";
import { Bell } from "lucide-react";

const items = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/rayhernandez17",
    x: -1,
    y: -1,
  },
  {
    name: "Instagram",
    link: "https://github.com/hernandezraymondm",
    x: 0,
    y: -1,
  },
  {
    name: "Twitter",
    link: "https://github.com/hernandezraymondm",
    x: 1,
    y: -1,
  },
  {
    name: "Youtube",
    link: "https://github.com/hernandezraymondm",
    x: -1,
    y: 0,
  },
  {
    name: "Whatsapp",
    link: "https://github.com/hernandezraymondm",
    x: 1,
    y: 0,
  },
  {
    name: "Linkedin",
    link: "https://github.com/hernandezraymondm",
    x: -1,
    y: 1,
  },
  { name: "Twitch", link: "https://github.com/hernandezraymondm", x: 0, y: 1 },
  { name: "Github", link: "https://github.com/hernandezraymondm", x: 1, y: 1 },
];

export async function Header() {
  // const headersList = await headers();
  // const pathname = headersList.get("x-pathname") || "";
  // const isProtected = pathname.startsWith("/home");

  // if (!isProtected) {
  //   return null;
  // }
  return (
    <header className="border-b">
      <div className="flex h-14 items-center justify-between gap-10 px-6">
        <div className="flex items-center">
          <SidebarToggle />
          <BreadCrumb />
        </div>
        <div className="hidden flex-nowrap items-center justify-between gap-6 text-nowrap text-sm text-muted-foreground xl:flex">
          <ClientDateTimeDisplay showSeconds type="date" />
          <ClientDateTimeDisplay showSeconds type="time" />
        </div>
        <div className="-mr-2 flex items-center gap-2">
          {/* <SearchBox /> */}
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <FullScreenToggle />
          <AppDrawer items={items} />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
