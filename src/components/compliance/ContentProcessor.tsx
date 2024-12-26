import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processWithAI } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/compliance';

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

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (selectedTemplate) {
      const template = templates.find(t => t.name === selectedTemplate);
      if (template && apiKey) {
        try {
          setIsProcessing(true);
          const processedContent = await processWithAI(newContent, template, apiKey);
          setConvertedContent(processedContent);
          onContentProcessed();
        } catch (error) {
          toast({
            title: "Processing Error",
            description: "Failed to process content with AI. Please try again.",
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
      <Input
        type="password"
        placeholder="Enter your Perplexity API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
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