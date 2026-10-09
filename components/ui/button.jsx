import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-base font-normal transition-colors focus-visible:outline-none focus-visible:outline-1 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-black bg-transparent text-black hover:bg-black hover:text-white",
        destructive:
          "border border-[#B00020] bg-transparent text-[#B00020] hover:bg-[#B00020] hover:text-white",
        outline:
          "border border-black bg-transparent text-black hover:bg-black hover:text-white",
        secondary:
          "border border-[#E5E7EB] bg-transparent text-black hover:border-black hover:bg-black hover:text-white",
        ghost: "text-black hover:bg-[#F6F6F6]",
        link: "h-auto p-0 text-sm text-black underline-offset-4 hover:opacity-60 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-10 rounded-sm px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
