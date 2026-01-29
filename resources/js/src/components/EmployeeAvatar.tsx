import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeAvatarProps {
  name: string;
  color: string;
}

export default function EmployeeAvatar({ name, color }: EmployeeAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback style={{ backgroundColor: color }} className="text-white text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
