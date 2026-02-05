import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface IconCardProps {
  icon: LucideIcon | IconType;
  iconColor?: string;
  iconBgColor?: string;
  children: React.ReactNode;
}

const IconCard = ({
  icon: Icon,
  iconColor = "text-white",
  iconBgColor = "bg-purple-600",
  children,
}: IconCardProps) => {
  return (
    <Card className="relative w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
      <div
        className={`z-10 absolute -top-9 left-1/2 -translate-x-1/2 ${iconBgColor} card-icon flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800`}
      >
        <Icon className={`h-9 w-9 ${iconColor}`} strokeWidth={3} />
      </div>
      <CardContent className="flex items-end justify-center">
        {children}
      </CardContent>
    </Card>
  );
};

export default IconCard;
