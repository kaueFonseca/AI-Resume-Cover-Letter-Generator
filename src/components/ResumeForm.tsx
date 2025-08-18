import { useState } from "react";
import Button from "./ui/Button";
import { FileText, Palette, LoaderCircle } from "lucide-react";
import type { GeneratedContent } from "@/app/page";
import Title from "./ui/Title";
import { SelectContent, SelectTrigger, SelectValue, SelectUI, SelectItem } from "@/components/ui/Select"

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
    <section className="w-full rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
      <div className="p-6 pb-0">
        <Title />
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
              className="min-h-[140px] resize-none w-full rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] p-3"
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
              className="min-h-[220px] resize-none w-full rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] p-3"
              required
              value={currentResume}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentResume(e.target.value)}
            />
          </div>

          {/* Tone & Style */}
          <SelectUI>
            <SelectTrigger className="text-gray-500 w-[300px] rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_5px_rgba(0,0,0,0.08)] p-2">
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