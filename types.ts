
export enum InjusticeType {
  SEXUAL_HARASSMENT = 'Sexual Harassment',
  ABUSE_OF_AUTHORITY = 'Abuse of Authority',
  DISCRIMINATION = 'Discrimination',
  INTIMIDATION = 'Intimidation/Bullying',
  OTHER = 'Other'
}

export interface IncidentEntry {
  id: string;
  timestamp: number;
  rawContent: string;
  redactedContent: string;
  classifications: InjusticeType[];
  urgency: 'high' | 'medium' | 'low';
  legalContext: string;
  placeholders: Record<string, string>;
}

export interface AIAnalysisResponse {
  classifications: InjusticeType[];
  urgency: 'high' | 'medium' | 'low';
  redactedText: string;
  legalGuidance: {
    whatTheLawSays: string;
    whyItMatters: string;
    nextSteps: string;
  };
  placeholders: Record<string, string>;
  isVague: boolean;
}

export type AppState = 'cloak' | 'dashboard' | 'disclosure' | 'vault' | 'redaction' | 'listening';
