"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  selectedTheme: string,
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, selectedTheme, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center ",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={`relative h-1 w-full grow overflow-hidden rounded-full
     ${selectedTheme == 'dark' ? 'bg-zinc-700' : 'bg-[#D0E7D2]'}`}>
      <SliderPrimitive.Range className={`${selectedTheme == 'dark' ? 'bg-white' : 'bg-[#22311d]'} 
      absolute h-full`} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={`${selectedTheme == 'dark' ? 'bg-background border-2 border-primary' : 'bg-[#22311d] border-2 border-[#D0E7D2]'} 
    block h-4 w-4 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
