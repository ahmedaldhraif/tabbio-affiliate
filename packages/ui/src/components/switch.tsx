"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@refref/ui/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex size-11 shrink-0 items-center rounded-full outline-none before:absolute before:top-1/2 before:left-1/2 before:h-[1.15rem] before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-transparent before:shadow-xs before:transition-colors data-[state=checked]:before:bg-primary data-[state=unchecked]:before:bg-input focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:data-[state=unchecked]:before:bg-input/80",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none absolute top-1/2 left-[7px] z-10 block size-4 -translate-y-1/2 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
