import { useCallback } from "react";
import { toast } from "sonner";
import { generateDocuments } from "@/features/resume/api/generateClient";
import type { GeneratedContent } from "@/features/resume/types/GeneratedContent";

interface Payload {
  jobDescription: string;
  currentResume: string;
  tone: string;
}

export function useGenerateDocuments() {
  const generate = useCallback(async (payload: Payload): Promise<GeneratedContent> => {
    toast.info('Gerando documentos...');
    try {
      const result = await generateDocuments(payload);
      toast.success('Documentos gerados com sucesso!');
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro inesperado';
      toast.error(message);
      throw e;
    }
  }, []);

  return { generate };
}


