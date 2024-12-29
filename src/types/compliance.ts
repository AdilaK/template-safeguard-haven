export type TemplateType = 
  | 'Customer Service Email'
  | 'Marketing Copy'
  | 'Internal Communication'
  | 'Sales Pitch'
  | 'Product Description';

export interface Template {
  id?: number;
  name: string;
  type?: string;  // Made completely optional
  content: string;
  prohibitedKeywords: string[];
  warningWords: string[];
  synonyms: Record<string, string[]>;
}

export interface ComplianceResult {
  isCompliant: boolean;
  issues: Array<{
    type: string;
    word?: string;
    message: string;
  }>;
  warnings: Array<{
    type: string;
    word: string;
    message: string;
  }>;
}