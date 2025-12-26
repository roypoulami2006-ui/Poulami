
export enum AnalysisStatus {
  SCAM = 'SCAM',
  RISK = 'RISK',
  SAFE = 'SAFE'
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  inputText: string;
  status: AnalysisStatus;
  riskScore: number; // 0-100
  explanation: string;
  flaggedPhrases: string[];
  actionableTips: string[];
}

export interface HistoryItem extends AnalysisResult {}

export interface UserReport {
  messageId: string;
  content: string;
  aiClassification: AnalysisStatus;
  userReason: string;
  timestamp: number;
}
