import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Template, ComplianceResult } from '@/types/compliance';
import { ContentProcessor } from './ContentProcessor';

interface ComplianceCheckerProps {
  content: string;
  setContent: (content: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  templates: Template[];
  complianceResults: ComplianceResult | null;
  convertedContent: string;
  setConvertedContent: (content: string) => void;
  onCheckCompliance: () => void;
}

export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({
  content,
  setContent,
  selectedTemplate,
  setSelectedTemplate,
  templates,
  complianceResults,
  convertedContent,
  setConvertedContent,
  onCheckCompliance
}) => {
  return (
    <div className="space-y-6">
      <div className="input-group">
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.name}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ContentProcessor
        content={content}
        setContent={setContent}
        setConvertedContent={setConvertedContent}
        selectedTemplate={selectedTemplate}
        templates={templates}
        onContentProcessed={onCheckCompliance}
      />

      {convertedContent && (
        <div className="input-group">
          <label className="label">Converted Content</label>
          <Textarea 
            value={convertedContent}
            readOnly
            className="h-40 bg-gray-50"
          />
        </div>
      )}

      {complianceResults && (
        <div className="results-area space-y-4">
          <Alert variant={complianceResults.isCompliant ? "default" : "destructive"}>
            <AlertTitle className="flex items-center gap-2">
              {complianceResults.isCompliant ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              Compliance Check Results
            </AlertTitle>
          </Alert>

          {complianceResults.warnings && complianceResults.warnings.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" />
                Warning Words Detected
              </AlertTitle>
              <AlertDescription className="mt-2">
                <ul className="list-disc pl-4 space-y-1">
                  {complianceResults.warnings.map((warning, index) => (
                    <li key={index}>
                      Found warning word: "{warning.word}" in converted content
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};