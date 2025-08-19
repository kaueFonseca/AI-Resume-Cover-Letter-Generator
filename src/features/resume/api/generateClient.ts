import type { GeneratedContent } from "@/features/resume/types/GeneratedContent";

export interface GenerationRequest {
  jobDescription: string;
  currentResume: string;
  tone: string;
}

export async function generateDocuments(payload: GenerationRequest): Promise<GeneratedContent> {
  const normalized = { ...payload, tone: payload.tone || 'professional' };
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalized),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong');
  }

  return data as GeneratedContent;
}


