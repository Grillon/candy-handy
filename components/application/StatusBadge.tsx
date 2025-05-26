'use client';

import { ApplicationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.TODO:
        return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
      case ApplicationStatus.SENT:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case ApplicationStatus.INTERVIEW:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case ApplicationStatus.ACCEPTED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusStyles(status)
    )}>
      {status}
    </span>
  );
}