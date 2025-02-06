
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Clipboard, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  isProcessing: boolean;
  setIsVerified: (verified: boolean) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  content,
  setContent,
  isProcessing,
  setIsVerified
}) => {
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsVerified(false);
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

  return (
    <div className="space-y-2">
      <label className="label">AI-Generated Content</label>
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
    </div>
  );
};
