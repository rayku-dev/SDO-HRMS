import { ThemeToggle } from "@/components/header/theme-toggle";
import { FullScreenToggle } from "../header/fullscreen-toggle";
import AppDrawer from "../header/app-drawer";
import { AppLogo } from "./app-logo";

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

export function Navbar() {
  return (
    <header className="fixed top-0 w-full border-b border-[#1e293b] bg-transparent text-white z-20">
      <div className="flex h-14 items-center gap-4 px-8">
        <AppLogo size="xs" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <FullScreenToggle />
          <AppDrawer items={items} />
        </div>
      </div>
    </header>
  );
}
