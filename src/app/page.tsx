"use client"

import React, { useState } from "react";
import type { GeneratedContent } from "@/features/resume/types/GeneratedContent";
import { useGenerateDocuments } from "@/features/resume/hooks/useGenerateDocuments";
import ResumeForm from "@/components/ResumeForm";
import OutputDisplay from "@/components/OutputDisplay";
import Title from "@/components/ui/Title";
// O tipo GeneratedContent foi movido para features/resume/types

export default function Home() {
  // Use generics to type the state. It can be GeneratedContent or null.
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ jobDescription: "", currentResume: "", tone: "" });
  const { generate } = useGenerateDocuments();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setGeneratedContent(null);
      const result = await generate(form);
      setGeneratedContent(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro inesperado';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Title />

          {/* Grid para Form e Output */}
          <div className="grid xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="space-y-6">
              <ResumeForm
                value={form}
                onChange={setForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
            <div className="space-y-6">
              <OutputDisplay
                content={generatedContent}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}