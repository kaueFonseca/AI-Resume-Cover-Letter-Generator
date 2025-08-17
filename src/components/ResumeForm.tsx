import { useState } from "react";
import Button from "./ui/Button";
import { FileText, Palette, LoaderCircle } from "lucide-react";
import type { GeneratedContent } from "@/app/page";

// Define the props interface for type safety
interface ResumeFormProps {
  onGenerationStart: () => void;
  onGenerationComplete: (content: GeneratedContent) => void;
  onGenerationError: (error: string) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onGenerationStart, onGenerationComplete, onGenerationError, isLoading }: ResumeFormProps) {
  // Use generics for state types
  const [jobDescription, setJobDescription] = useState<string>("");
  const [currentResume, setCurrentResume] = useState<string>("");
  const [tone, setTone] = useState<string>("professional");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onGenerationStart();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, currentResume, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onGenerationComplete(data as GeneratedContent);
    } catch (err: unknown) { // Catch block variable can be of type 'any' or 'unknown'
      if (err instanceof Error) {
        onGenerationError(err.message);
      } else {
        onGenerationError("An unexpected error occurred");
      }

    }
  };

  return (
    <section className="w-full rounded-2xl bg-card text-card-foreground border">
      <div className="p-6 border-b">
        {/* ... header ... */}
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description */}
          <div className="space-y-3">
            <label htmlFor="job-description-textarea" className="flex items-center gap-2 font-medium">
              <FileText className="h-5 w-5" /> Job Description
            </label>
            <textarea
              id="job-description-textarea"
              placeholder="Paste the complete job description here..."
              className="min-h-[140px] resize-none w-full rounded-lg border ..."
              required
              value={jobDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Current Resume */}
          <div className="space-y-3">
            <label htmlFor="current-resume-textarea" className="flex items-center gap-2 font-medium">
              <FileText className="h-5 w-5" /> Your Current Resume
            </label>
            <textarea
              id="current-resume-textarea"
              placeholder="Paste your current resume content here..."
              className="min-h-[220px] resize-none w-full rounded-lg border ..."
              required
              value={currentResume}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentResume(e.target.value)}
            />
          </div>

          {/* Tone & Style */}
          <div className="space-y-3">
            <label htmlFor="tone-style-select" className="flex items-center gap-2 font-medium">
              <Palette className="h-5 w-5" /> Tone & Style
            </label>
            <select
              id="tone-style-select"
              className="w-full rounded-lg border ..."
              required
              value={tone}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="persuasive">Persuasive</option>
              <option value="bold">Bold</option>
            </select>
          </div>

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