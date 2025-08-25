import Button from "./ui/Button";
import { LoaderCircle, Briefcase } from "lucide-react";
import { ToneSelect } from "@/features/resume/components/ToneSelect";
import { LabeledTextarea } from "@/features/resume/components/LabeledTextarea";
import React from "react";

// Define the props interface for type safety
interface ResumeFormProps {
  value: { jobDescription: string; currentResume: string; tone: string };
  onChange: (next: ResumeFormProps['value']) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ResumeForm({ value, onChange, onSubmit, isLoading }: ResumeFormProps) {
  const { jobDescription, currentResume, tone } = value;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handlePdfToText = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/pdf-extract', { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Falha ao extrair texto do PDF');
    }
    const data = await res.json();
    return (data?.text ?? '') as string;
  };

  return (
    <section className="w-full rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
      <div className="p-6 pb-0">
        <h1 className='text-black-400 flex flex items-center gap-2 text-lg font-semibold pb-1'>
          <Briefcase className='w-5 h-5' />
          Generate Your Tailored Resume & Cover Letter
        </h1>

        <p className='text-sm text-muted-foreground text-gray-500'>
          Provide your job details and current resume to get AI-powered, tailored documents.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description */}
          <LabeledTextarea
            id="job-description-textarea"
            label="Job Description"
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(v) => onChange({ ...value, jobDescription: v })}
            minHeight={140}
          />

          {/* Current Resume */}
          <LabeledTextarea
            id="current-resume-textarea"
            label="Your Current Resume"
            placeholder="Paste your current resume content here..."
            value={currentResume}
            onChange={(v) => onChange({ ...value, currentResume: v })}
            minHeight={220}
          />

          {/* Tone & Style */}
          <ToneSelect value={tone} onChange={(v) => onChange({ ...value, tone: v })} />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Resume & Cover Letter'
            )}
          </Button>

        </form>
      </div>
    </section>
  );
}