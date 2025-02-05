import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus } from 'lucide-react';
import { Template } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';

interface TemplateFormProps {
  newTemplate: Template;
  setNewTemplate: (template: Template) => void;
  onSave: () => void;
}

const suggestedWarningWords = [
  'confidential',
  'private',
  'secret',
  'sensitive',
  'proprietary',
  'classified',
  'restricted',
  'internal',
  'offensive',
  'discriminatory',
  'inappropriate',
  'harmful',
  'biased',
  'explicit',
  'personal'
];

export const TemplateForm: React.FC<TemplateFormProps> = ({
  newTemplate,
  setNewTemplate,
  onSave,
}) => {
  const { toast } = useToast();
  const [warningWordInput, setWarningWordInput] = useState('');

  const handleWarningWordAdd = (word: string) => {
    const trimmedWord = word.trim().toLowerCase();
    if (trimmedWord) {
      if (!newTemplate.warningWords.includes(trimmedWord)) {
        const updatedTemplate = {
          ...newTemplate,
          warningWords: [...newTemplate.warningWords, trimmedWord]
        };
        setNewTemplate(updatedTemplate);
        setWarningWordInput('');
        toast({
          title: "Warning Word Added",
          description: `"${trimmedWord}" has been added to warning words.`
        });
      } else {
        toast({
          title: "Warning Word Exists",
          description: "This warning word is already in the list.",
          variant: "destructive"
        });
      }
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleWarningWordAdd(e.currentTarget.value);
    }
  };

  const removeWarningWord = (word: string) => {
    const updatedTemplate = {
      ...newTemplate,
      warningWords: newTemplate.warningWords.filter(w => w !== word)
    };
    setNewTemplate(updatedTemplate);
    toast({
      title: "Warning Word Removed",
      description: `"${word}" has been removed from warning words.`
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Template Name"
        value={newTemplate.name}
        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
      />

      <Textarea
        placeholder="Example prompt: 
Hi (Customer name),

make message casual, omit anything thats not to the context, also in under 25 words

finish by saying kind regards.

adil, 

anything in bracket should be replaced from the copied content ai-generated content, for eg; customer name should be replaced by the name in the input by user"
        value={newTemplate.content}
        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
        className="h-32"
      />

      <Button onClick={onSave} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Save Template
      </Button>

      <div className="space-y-2">
        <label className="text-sm font-medium">Warning Words</label>
        <div className="flex gap-2">
          <Input
            placeholder="Add warning word (press Enter)"
            value={warningWordInput}
            onChange={(e) => setWarningWordInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
          />
          <Button 
            variant="outline"
            onClick={() => handleWarningWordAdd(warningWordInput)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          Suggested warning words (click to add):
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedWarningWords
            .filter(word => !newTemplate.warningWords.includes(word))
            .map((word, index) => (
              <button
                key={index}
                onClick={() => handleWarningWordAdd(word)}
                className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                {word}
              </button>
            ))}
        </div>

        <div className="mt-2">
          <div className="text-sm font-medium mb-2">Current warning words:</div>
          <div className="flex flex-wrap gap-2">
            {newTemplate.warningWords.map((word, index) => (
              <span
                key={index}
                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {word}
                <button
                  onClick={() => removeWarningWord(word)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};