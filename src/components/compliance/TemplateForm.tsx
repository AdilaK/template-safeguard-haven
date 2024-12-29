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
    </div>
  );
};