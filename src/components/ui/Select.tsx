import * as Select from "@radix-ui/react-select";
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

export function SelectUI({ ...props }: React.ComponentProps<typeof Select.Root>) {
  return <Select.Root {...props} data-slot="select" />
}

export function SelectTrigger({ children, ...props }: React.ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      {...props}
      className="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    >
      {children}
      <Select.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </Select.Icon>
    </Select.Trigger>
  )
}

export function SelectValue({ ...props }: React.ComponentProps<typeof Select.Value>) {
  return <Select.Value data-slot="select-value" {...props} />
}

export function SelectContent({ children, ...props }: React.ComponentProps<typeof Select.Content>) {
  return (
    <Select.Portal>
      <Select.Content {...props}>
        <Select.Viewport>
          {children}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

export function SelectItem({ children, ...props }: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item {...props}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}