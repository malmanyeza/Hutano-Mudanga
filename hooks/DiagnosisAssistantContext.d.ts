import { SavedDiagnosis } from '../types/diagnosis';

export interface DiagnosisAssistantContextType {
  savedDiagnoses: SavedDiagnosis[];
  updateDiagnosisStatus: (id: number, status: SavedDiagnosis['status'], notes?: string) => Promise<void>;
  assistantMessages: any[];
  sendDiagnosisMessage: (message: string) => Promise<void>;
  isAssistantProcessing: boolean;
  setAssistantMessages: (messages: any[]) => void;
  currentDiagnosis: any | null;
  setCurrentDiagnosis: (diagnosis: any) => void;
  saveDiagnosis: (notes?: string) => Promise<any>;
  clearChat: () => void;
}

export function useDiagnosisAssistant(): DiagnosisAssistantContextType;

export const DiagnosisAssistantContext: React.Context<DiagnosisAssistantContextType>;
