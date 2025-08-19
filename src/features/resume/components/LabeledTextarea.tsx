"use client";
import { FileText } from "lucide-react";
import React from "react";

interface LabeledTextareaProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

export function LabeledTextarea({ id, label, placeholder, value, onChange, minHeight = 140 }: LabeledTextareaProps) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="flex items-center gap-2 font-medium">
        <FileText className="h-5 w-5" /> {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        className="min-h-[140px] resize-none w-full rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] p-3"
        style={{ minHeight }}
        required
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
    </div>
  );
}


