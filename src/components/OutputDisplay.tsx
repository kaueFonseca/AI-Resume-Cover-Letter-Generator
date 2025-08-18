  'use client'
  import { FileText, Clipboard, Check } from "lucide-react";
  import { useState } from "react";
  import type { GeneratedContent } from "@/app/page";
  // Define props for the main component
  interface OutputDisplayProps {
    content: GeneratedContent | null;
    isLoading: boolean;
    error: string | null;
  }

  // Define props for the helper component
  interface CopyButtonProps {
    textToCopy: string;
  }

  function CopyButton({ textToCopy }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
      </button>
    );
  }

  export default function OutputDisplay({ content, isLoading, error }: OutputDisplayProps) {
    const renderContent = () => {
      if (isLoading) {
        return <div className="flex items-center justify-center p-10"><p>Generating...</p></div>;
      }
      if (error) {
        return <div className="p-6 text-red-600"><h3 className="font-semibold">Error</h3><p>{error}</p></div>;
      }
      if (content) {
        return (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Tailored Resume</h3>
              <div className="relative p-4 rounded-lg bg-gray-50 whitespace-pre-wrap font-mono text-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
                <CopyButton textToCopy={content.resume} />
                {content.resume}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="relative p-4 rounded-lg bg-gray-50 whitespace-pre-wrap font-mono text-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
                <CopyButton textToCopy={content.coverLetter} />
                {content.coverLetter}
              </div>
            </div>
          </div>
        );
      }
      return <div className="p-6 text-sm text-muted-foreground">Ready to display your generated content here.</div>;
    };

    return (
      <div className="w-full rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            Your Generated Documents
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }