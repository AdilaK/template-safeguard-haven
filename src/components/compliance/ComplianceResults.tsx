import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';
import { ComplianceResult } from '@/types/compliance';

interface ComplianceResultsProps {
  results: ComplianceResult;
  convertedContent: string;
}

export const ComplianceResults: React.FC<ComplianceResultsProps> = ({
  results,
  convertedContent
}) => {
  return (
    <div className="results-area space-y-4">
      <Alert variant={results.isCompliant ? "default" : "destructive"}>
        <AlertTitle className="flex items-center gap-2">
          {results.isCompliant ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          Compliance Check Results
        </AlertTitle>
      </Alert>

      {results.issues.map((issue, index) => (
        <Alert key={index} variant="destructive">
          <AlertTitle>{issue.type === 'prohibited' ? 'Prohibited Keyword Found' : 'Structure Issue'}</AlertTitle>
          <AlertDescription>{issue.message}</AlertDescription>
        </Alert>
      ))}

      {results.warnings.map((warning, index) => (
        <Alert key={index}>
          <AlertTitle className="flex items-center gap-2">Warning</AlertTitle>
          <AlertDescription>{warning.message}</AlertDescription>
        </Alert>
      ))}

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
    </div>
  );
};