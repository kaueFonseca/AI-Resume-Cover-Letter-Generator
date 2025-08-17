"use client"

import React, { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import OutputDisplay from "@/components/OutputDisplay";

// Define the type for our generated content. This can be shared between components.
export interface GeneratedContent {
  resume: string;
  coverLetter: string;
}

export default function Home() {
  // Use generics to type the state. It can be GeneratedContent or null.
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerationComplete = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setIsLoading(false);
  };

  const handleGenerationStart = () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
  };

  const handleGenerationError = (errMessage: string) => {
    setError(errMessage);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Título e descrição */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 bg-gray-200">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-muted-foreground mb-4 tracking-tight">
              AI-Powered Resume & Cover Letter Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your resume and create compelling cover letters tailored to any job using advanced AI technology
            </p>
          </div>

          {/* Grid para Form e Output */}
          <div className="grid xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="space-y-6">
              <ResumeForm
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
                onGenerationError={handleGenerationError}
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