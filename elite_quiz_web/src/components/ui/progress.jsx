import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value,color, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all rounded-full"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` , background: `${color ? color: '#01BF7A'}`}} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
