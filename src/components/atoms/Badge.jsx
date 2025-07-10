import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-secondary",
    error: "bg-error text-white",
    sale: "bg-gradient-to-r from-error to-primary text-white"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;