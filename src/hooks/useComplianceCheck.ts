import { useState } from 'react';
import { Template, ComplianceResult } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';

export const useComplianceCheck = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [complianceResults, setComplianceResults] = useState<ComplianceResult | null>(null);
  const [convertedContent, setConvertedContent] = useState('');

  const checkCompliance = (content: string, selectedTemplate: string, templates: Template[]) => {
    if (!content || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter content to check.",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.name === selectedTemplate);
    if (!template) return;

    const issues = [];
    const warnings = [];

    template.prohibitedKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        issues.push({
          type: 'prohibited',
          word: keyword,
          message: `Prohibited keyword "${keyword}" found`
        });
      }
    });

    template.warningWords.forEach(word => {
      if (content.toLowerCase().includes(word.toLowerCase())) {
        warnings.push({
          type: 'warning',
          word: word,
          message: `Warning word "${word}" detected`
        });
      }
    });

    setComplianceResults({
      isCompliant: issues.length === 0,
      issues,
      warnings
    });
  };

  return {
    content,
    setContent,
    selectedTemplate,
    setSelectedTemplate,
    complianceResults,
    convertedContent,
    setConvertedContent,
    checkCompliance
  };
};