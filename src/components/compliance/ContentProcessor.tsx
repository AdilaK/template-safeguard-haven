import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processWithAI, getStoredApiKey, setStoredApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/compliance';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    
    if (selectedTemplate && apiKey) {
      const template = templates.find(t => t.name === selectedTemplate);
      if (template) {
        try {
          setIsProcessing(true);
          const processedContent = await processWithAI(newContent, template, apiKey);
          setConvertedContent(processedContent);
          onContentProcessed();
          setStoredApiKey(apiKey);
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your Google Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mb-4"
        />
        {!apiKey && (
          <Alert>
            <AlertDescription>
              You need a Google Gemini API key to process content. Get one from{' '}
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
        )}
      </div>
      <div className="input-group">
        <label className="label">AI-Generated Content</label>
        <Textarea 
          value={content}
          onChange={handleContentChange}
          placeholder="Paste your AI-generated content here..."
          className="h-40"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};