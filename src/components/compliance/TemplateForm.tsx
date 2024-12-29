import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Template } from '@/types/compliance';

interface TemplateFormProps {
  newTemplate: Template;
  setNewTemplate: (template: Template) => void;
  onSave: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  newTemplate,
  setNewTemplate,
  onSave,
}) => {
  const handleWarningWordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const word = e.currentTarget.value.trim().toLowerCase();
      if (!newTemplate.warningWords.includes(word)) {
        const updatedTemplate = {
          ...newTemplate,
          warningWords: [...newTemplate.warningWords, word]
        };
        setNewTemplate(updatedTemplate);
        e.currentTarget.value = '';
      }
    }
  };

  const removeWarningWord = (word: string) => {
    const updatedTemplate = {
      ...newTemplate,
      warningWords: newTemplate.warningWords.filter(w => w !== word)
    };
    setNewTemplate(updatedTemplate);
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
        <Input
          placeholder="Add warning word (press Enter)"
          onKeyPress={handleWarningWordAdd}
        />
        <div className="mt-2 flex flex-wrap gap-2">
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
  );
};