import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Template, TemplateType } from '@/types/compliance';

interface TemplateFormProps {
  newTemplate: Template;
  setNewTemplate: (template: Template) => void;
  templateTypes: TemplateType[];
  onSave: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  newTemplate,
  setNewTemplate,
  templateTypes,
  onSave,
}) => {
  const handleProhibitedKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const updatedTemplate = {
        ...newTemplate,
        prohibitedKeywords: [...newTemplate.prohibitedKeywords, input.value]
      };
      setNewTemplate(updatedTemplate);
      input.value = '';
    }
  };

  const handleWarningWordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const updatedTemplate = {
        ...newTemplate,
        warningWords: [...newTemplate.warningWords, input.value]
      };
      setNewTemplate(updatedTemplate);
      input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Template Name"
          value={newTemplate.name}
          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
        />
        <Select
          value={newTemplate.type}
          onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Template Type" />
          </SelectTrigger>
          <SelectContent>
            {templateTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Template Content"
        value={newTemplate.content}
        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
        className="h-32"
      />

      <div className="space-y-2">
        <Input
          placeholder="Add prohibited keyword"
          onKeyPress={handleProhibitedKeywordAdd}
        />
        <Input
          placeholder="Add warning word"
          onKeyPress={handleWarningWordAdd}
        />
      </div>

      <Button onClick={onSave} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Save Template
      </Button>
    </div>
  );
};