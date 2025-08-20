'use client'
import React from "react";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useReactToPrint } from "react-to-print";
import Button from "@/components/ui/Button";
import type { GeneratedContent } from "@/features/resume/types/GeneratedContent";
import { CopyButton } from "@/features/resume/components/CopyButton";
import { LabeledTextarea } from "@/features/resume/components/LabeledTextarea";
// Define props for the main component
interface OutputDisplayProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
}

// CopyButton foi extraído para um componente reutilizável

export default function OutputDisplay({ content, isLoading, error }: OutputDisplayProps) {
  const resumeRef = React.useRef<HTMLDivElement | null>(null);
  const coverRef = React.useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [resumeMarkdown, setResumeMarkdown] = React.useState<string>(content?.resume ?? "");
  const [coverMarkdown, setCoverMarkdown] = React.useState<string>(content?.coverLetter ?? "");

  React.useEffect(() => {
    setResumeMarkdown(content?.resume ?? "");
    setCoverMarkdown(content?.coverLetter ?? "");
  }, [content?.resume, content?.coverLetter]);

  const handlePrintResume = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "Curriculo",
  });

  const handlePrintCover = useReactToPrint({
    contentRef: coverRef,
    documentTitle: "Cover-Letter",
  });

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-10"><p>Generating...</p></div>;
    }
    if (error) {
      return <div className="p-6 text-red-600"><h3 className="font-semibold">Error</h3><p>{error}</p></div>;
    }
    if (content) {
      return (
        <div className="p-6 space-y-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Tailored Resume</h3>
              <div className="no-print flex gap-2">
                <Button onClick={() => setIsEditing((v) => !v)} className="w-auto h-9 px-3">{isEditing ? 'Concluir edição' : 'Editar'}</Button>
                <Button onClick={handlePrintResume} className="w-auto h-9 px-3">Salvar PDF</Button>
                <CopyButton textToCopy={resumeMarkdown} />
              </div>
            </div>
            {isEditing && (
              <div className="no-print">
                <LabeledTextarea
                  id="resume-edit-textarea"
                  label="Editar Currículo (Markdown)"
                  placeholder="Edite o conteúdo em Markdown..."
                  value={resumeMarkdown}
                  onChange={setResumeMarkdown}
                  minHeight={220}
                />
              </div>
            )}
            <div ref={resumeRef} className="print-area relative p-6 rounded-lg bg-white text-black text-base leading-7 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
              <ReactMarkdown>{resumeMarkdown}</ReactMarkdown>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Cover Letter</h3>
              <div className="no-print flex gap-2">
                <Button onClick={() => setIsEditing((v) => !v)} className="w-auto h-9 px-3">{isEditing ? 'Concluir edição' : 'Editar'}</Button>
                <Button onClick={handlePrintCover} className="w-auto h-9 px-3">Salvar PDF</Button>
                <CopyButton textToCopy={coverMarkdown} />
              </div>
            </div>
            {isEditing && (
              <div className="no-print">
                <LabeledTextarea
                  id="cover-edit-textarea"
                  label="Editar Cover Letter (Markdown)"
                  placeholder="Edite o conteúdo em Markdown..."
                  value={coverMarkdown}
                  onChange={setCoverMarkdown}
                  minHeight={220}
                />
              </div>
            )}
            <div ref={coverRef} className="print-area relative p-6 rounded-lg bg-white text-black text-base leading-7 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.08)]">
              <ReactMarkdown>{coverMarkdown}</ReactMarkdown>
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
