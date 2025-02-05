import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processWithAI, getStoredApiKey, setStoredApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/compliance';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clipboard } from 'lucide-react';

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

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const checkWarningWords = (processedContent: string, template: Template) => {
    const warnings: string[] = [];
    template.warningWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(processedContent)) {
        warnings.push(word);
      }
    });
    return warnings;
  };

  const processContent = async (contentToProcess: string) => {
    if (selectedTemplate) {
      const template = templates.find(t => t.name === selectedTemplate);
      if (template) {
        try {
          setIsProcessing(true);
          const processedContent = await processWithAI(contentToProcess, template, apiKey);
          setConvertedContent(processedContent);
          
          if (apiKey && apiKey !== getStoredApiKey()) {
            setStoredApiKey(apiKey);
          }

          // Check for warning words
          const warnings = checkWarningWords(processedContent, template);
          if (warnings.length > 0) {
            toast({
              title: "Warning Words Detected",
              description: `Found warning words: ${warnings.join(', ')}`,
              variant: "destructive",
            });
          }

          onContentProcessed();
        } catch (error: any) {
          toast({
            title: "Processing Error",
            description: error.message || "Failed to process content with OpenAI",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setContent(clipboardText);
      await processContent(clipboardText);
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
          <Button 
            variant="outline" 
            onClick={handlePasteFromClipboard}
            className="w-full flex items-center justify-center gap-2"
            type="button"
          >
            <Clipboard className="w-4 h-4" />
            Paste from Clipboard
          </Button>
          {content && (
            <Button
              onClick={() => processContent(content)}
              className="w-full"
              disabled={isProcessing}
            >
              Process Content
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};