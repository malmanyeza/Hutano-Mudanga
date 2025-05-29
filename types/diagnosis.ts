export type DiagnosisDetails = {
  disease: string;
  riskLevel: string;
  matchingSymptoms: string[];
  treatmentAdvice: string;
  preventionTips: string;
  references: string[];
  icon: string | null;
};

export type SavedDiagnosis = {
  id: number;
  condition: string;
  date: string;
  status: 'Monitoring' | 'Treated' | 'Critical' | 'Recovered';
  notes: string;
  details: DiagnosisDetails;
};
