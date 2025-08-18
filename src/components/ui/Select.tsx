import * as Select from "@radix-ui/react-select";
import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

export function SelectUI({ ...props }: React.ComponentProps<typeof Select.Root>) {
  return <Select.Root {...props} data-slot="select" />
}

export function SelectTrigger({ children, ...props }: React.ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      {...props}
      className="data-[placeholder]:text-gray-500 flex min-w-[8rem] items-center justify-between gap-2 rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
      <Select.Content
        {...props}
        className="bg-white text-black relative z-50 min-w-[8rem] rounded-md border shadow-md translate-y-1"
        >
        <Select.Viewport className="p-1 max-h-64">
          {children}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

export function SelectItem({ children, ...props }: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item
      {...props}
      className="focus:bg-gray-100 relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2">
        <CheckIcon className="h-4 w-4" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}