import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-600 text-white hover:bg-amber-700",
        secondary:
          "border-transparent bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-slate-800 border-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
