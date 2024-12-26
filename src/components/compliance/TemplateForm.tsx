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
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const keyword = e.currentTarget.value.trim().toLowerCase();
      if (!newTemplate.prohibitedKeywords.includes(keyword)) {
        const updatedTemplate = {
          ...newTemplate,
          prohibitedKeywords: [...newTemplate.prohibitedKeywords, keyword]
        };
        setNewTemplate(updatedTemplate);
        e.currentTarget.value = '';
      }
    }
  };

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

  const removeProhibitedKeyword = (keyword: string) => {
    const updatedTemplate = {
      ...newTemplate,
      prohibitedKeywords: newTemplate.prohibitedKeywords.filter(k => k !== keyword)
    };
    setNewTemplate(updatedTemplate);
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

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Add prohibited keyword (press Enter)"
            onKeyPress={handleProhibitedKeywordAdd}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {newTemplate.prohibitedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {keyword}
                <button
                  onClick={() => removeProhibitedKeyword(keyword)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
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

      <Button onClick={onSave} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Save Template
      </Button>
    </div>
  );
};