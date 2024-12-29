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
    
    if (selectedTemplate) {
      const template = templates.find(t => t.name === selectedTemplate);
      if (template) {
        try {
          setIsProcessing(true);
          const processedContent = await processWithAI(newContent, template, apiKey);
          setConvertedContent(processedContent);
          onContentProcessed();
          if (apiKey && apiKey !== getStoredApiKey()) {
            setStoredApiKey(apiKey);
          }
          toast({
            title: "Success",
            description: "Content processed successfully",
          });
        } catch (error: any) {
          toast({
            title: "Processing Error",
            description: error.message || "Failed to process content with AI",
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
      const event = {
        target: { value: clipboardText }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleContentChange(event);
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
          placeholder="Enter your Google Gemini API key (optional)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mb-4"
        />
        <Alert>
          <AlertDescription>
            A default API key is provided, but you can use your own from{' '}
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Google AI Studio
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
        </div>
      </div>
    </div>
  );
};