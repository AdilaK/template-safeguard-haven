import { useState } from 'react';
import { Template } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';

export const useTemplateManager = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState<Template>({
    name: '',
    content: '',
    prohibitedKeywords: [],
    warningWords: [],
    synonyms: {}
  });

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in template name and content.",
        variant: "destructive"
      });
      return;
    }
    
    setTemplates(prev => [...prev, { ...newTemplate, id: Date.now() }]);
    setNewTemplate({
      name: '',
      content: '',
      prohibitedKeywords: [],
      warningWords: [],
      synonyms: {}
    });

    toast({
      title: "Template Saved",
      description: "Your new template has been saved successfully.",
    });
  };

  const deleteTemplate = (templateId: number) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "The template has been removed.",
    });
  };

  return {
    templates,
    newTemplate,
    setNewTemplate,
    saveTemplate,
    deleteTemplate
  };
};