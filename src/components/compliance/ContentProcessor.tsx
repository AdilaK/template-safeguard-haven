
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processWithAI, getStoredApiKey, setStoredApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/compliance';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clipboard, CheckCircle, Eraser } from 'lucide-react';

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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsVerified(false);
  };

  const cleanPrefatoryPhrases = () => {
    const prefatoryPhrases = [
      /^Here is a summary:[\s]*/i,
      /^Here's a response I've drafted:[\s]*/i,
      /^Is there anything else you need help with\?[\s]*/i,
      /^Here's what I've come up with:[\s]*/i,
      /^I hope this helps\.[\s]*/i,
      /^Let me know if you need any clarification\.[\s]*/i,
      /^Here's my response:[\s]*/i,
    ];

    let cleanedContent = content;
    prefatoryPhrases.forEach(phrase => {
      cleanedContent = cleanedContent.replace(phrase, '');
    });

    // Trim any leading/trailing whitespace
    cleanedContent = cleanedContent.trim();

    if (cleanedContent !== content) {
      setContent(cleanedContent);
      toast({
        title: "Content Cleaned",
        description: "Unnecessary prefatory phrases have been removed.",
        variant: "default"
      });
    } else {
      toast({
        title: "No Changes Needed",
        description: "No prefatory phrases were found in the content.",
        variant: "default"
      });
    }
  };

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

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setContent(clipboardText);
      setIsVerified(false);
    } catch (error) {
      toast({
        title: "Clipboard Error",
        description: "Unable to paste from clipboard. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mb-4"
        />
        <Alert>
          <AlertDescription>
            Get your OpenAI API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              OpenAI Platform
            </a>
          </AlertDescription>
        </Alert>
      </div>
      <div className="input-group">
        <label className="label">AI-Generated Content</label>
        <div className="space-y-2">
          <Textarea 
            value={content}
            onChange={handleContentChange}
            placeholder="Paste your AI-generated content here..."
            className="h-40"
            disabled={isProcessing}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePasteFromClipboard}
              className="flex-1 items-center justify-center gap-2"
              type="button"
            >
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </Button>
            <Button
              variant="outline"
              onClick={cleanPrefatoryPhrases}
              className="flex-1 items-center justify-center gap-2"
              type="button"
            >
              <Eraser className="w-4 h-4" />
              Clean Phrases
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={verifyCompliance}
              className="flex-1"
              disabled={isProcessing || !content}
            >
              Verify Compliance
            </Button>
            <Button
              onClick={convertContent}
              className="flex-1"
              disabled={isProcessing || !isVerified}
              variant={isVerified ? "default" : "secondary"}
            >
              {isVerified && <CheckCircle className="w-4 h-4 mr-2" />}
              Convert Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
