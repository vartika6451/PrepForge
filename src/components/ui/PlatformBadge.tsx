import React from "react";
import { formatPlatformBadge } from "@/lib/utils";
import { Platform } from "@/types";

interface PlatformBadgeProps {
  platform: Platform | string;
  className?: string;
}

export function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const colorClass = formatPlatformBadge(platform);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${colorClass} ${className}`}
    >
      {platform}
    </span>
  );
}
