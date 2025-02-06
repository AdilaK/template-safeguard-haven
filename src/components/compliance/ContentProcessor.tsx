
import React, { useState, useEffect } from 'react';
import { processWithAI, getStoredApiKey, setStoredApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/compliance';
import { APIKeyInput } from './APIKeyInput';
import { ContentInput } from './ContentInput';
import { ActionButtons } from './ActionButtons';

interface ContentProcessorProps {
  content: string;
  setContent: (content: string) => void;
  setConvertedContent: (content: string) => void;
  selectedTemplate: string;
  templates: Template[];
  onContentProcessed: () => void;
}

export const ContentProcessor: React.FC<ContentProcessorProps> = ({
  content,
  setContent,
  setConvertedContent,
  selectedTemplate,
  templates,
  onContentProcessed
}) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const verifyCompliance = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template before verifying compliance.",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.name === selectedTemplate);
    if (template) {
      try {
        setIsProcessing(true);
        const processedContent = await processWithAI(content, template, apiKey);
        setIsVerified(true);
        onContentProcessed();
        
        toast({
          title: "Verification Complete",
          description: "Content has been verified. You can now proceed with conversion.",
          variant: "default"
        });
      } catch (error: any) {
        toast({
          title: "Verification Error",
          description: error.message || "Failed to verify content",
          variant: "destructive"
        });
        setIsVerified(false);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const convertContent = async () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify the content before converting.",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.name === selectedTemplate);
    if (template) {
      try {
        setIsProcessing(true);
        const processedContent = await processWithAI(content, template, apiKey);
        setConvertedContent(processedContent);
        
        if (apiKey && apiKey !== getStoredApiKey()) {
          setStoredApiKey(apiKey);
        }

        toast({
          title: "Conversion Complete",
          description: "Content has been successfully converted according to the template.",
          variant: "default"
        });

        onContentProcessed();
      } catch (error: any) {
        toast({
          title: "Conversion Error",
          description: error.message || "Failed to convert content",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <APIKeyInput apiKey={apiKey} setApiKey={setApiKey} />
      <div className="input-group">
        <ContentInput
          content={content}
          setContent={setContent}
          isProcessing={isProcessing}
          setIsVerified={setIsVerified}
        />
        <ActionButtons
          isProcessing={isProcessing}
          content={content}
          isVerified={isVerified}
          onVerify={verifyCompliance}
          onConvert={convertContent}
        />
      </div>
    </div>
  );
};
