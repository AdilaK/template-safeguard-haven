
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ActionButtonsProps {
  isProcessing: boolean;
  content: string;
  isVerified: boolean;
  onVerify: () => void;
  onConvert: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isProcessing,
  content,
  isVerified,
  onVerify,
  onConvert
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onVerify}
        className="flex-1"
        disabled={isProcessing || !content}
      >
        Verify Compliance
      </Button>
      <Button
        onClick={onConvert}
        className="flex-1"
        disabled={isProcessing || !isVerified}
        variant={isVerified ? "default" : "secondary"}
      >
        {isVerified && <CheckCircle className="w-4 h-4 mr-2" />}
        Convert Content
      </Button>
    </div>
  );
};
