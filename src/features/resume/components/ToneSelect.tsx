"use client";
import { SelectContent, SelectTrigger, SelectValue, SelectUI, SelectItem } from "@/components/ui/Select";

interface ToneSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function ToneSelect({ value, onChange, id }: ToneSelectProps) {
  return (
    <SelectUI required value={value || undefined} onValueChange={onChange}>
      <SelectTrigger id={id} className="text-gray-500 w-[300px] rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] p-2">
        <SelectValue placeholder='Choose the tone for your application materials' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="professional">
          <div className="flex flex-col items-start">
            <span className="font-medium">Professional</span>
            <span className="text-gray-500 text-xs text-muted-foreground">Formal, corporate-friendly tone</span>
          </div>
        </SelectItem>
        <SelectItem value="friendly">
          <div className="flex flex-col items-start">
            <span className="font-medium">Friendly</span>
            <span className="text-gray-500 text-xs text-muted-foreground">Warm, approachable tone</span>
          </div>
        </SelectItem>
        <SelectItem value="persuasive">
          <div className="flex flex-col items-start">
            <span className="font-medium">Persuasive</span>
            <span className="text-gray-500 text-xs text-muted-foreground">Confident, compelling tone</span>
          </div>
        </SelectItem>
      </SelectContent>
    </SelectUI>
  );
}


