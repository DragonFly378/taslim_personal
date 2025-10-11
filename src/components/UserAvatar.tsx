"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
  xl: "h-10 w-10",
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    return email.substring(0, 2).toUpperCase();
  }

  return "U";
}

function getAvatarColor(name?: string | null, email?: string | null): string {
  const str = name || email || "user";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-green-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-orange-500",
  ];

  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const initials = getInitials(user.name, user.email);
  const colorClass = getAvatarColor(user.name, user.email);

  if (user.image) {
    return (
      <div className={cn("relative rounded-full overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all", sizeClasses[size], className)}>
        <img
          src={user.image}
          alt={user.name || user.email || "User"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br shadow-md hover:shadow-lg transition-all ring-2 ring-primary/10 hover:ring-primary/30",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
