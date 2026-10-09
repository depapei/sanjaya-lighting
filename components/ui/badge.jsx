import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-normal transition-colors focus:outline-none focus:outline-1 focus:outline-black",
  {
    variants: {
      variant: {
        default:
          "border-[#E5E7EB] bg-[#F6F6F6] text-black",
        secondary:
          "border-[#E5E7EB] bg-white text-black",
        destructive:
          "border-[#B00020] bg-transparent text-[#B00020]",
        outline: "border-[#E5E7EB] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
