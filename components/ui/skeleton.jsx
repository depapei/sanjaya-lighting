import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md border border-[#E5E7EB] bg-[#F6F6F6]", className)}
      {...props} />
  );
}

export { Skeleton }
