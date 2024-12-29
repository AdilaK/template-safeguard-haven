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

    const warnings = [];
    const contentToCheck = convertedContent || content;

    // Check for warning words in the converted content
    template.warningWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(contentToCheck)) {
        warnings.push({
          type: 'warning',
          word: word,
          message: `Warning word "${word}" detected`
        });
      }
    });

    setComplianceResults({
      isCompliant: warnings.length === 0,
      issues: [],
      warnings
    });

    if (warnings.length > 0) {
      toast({
        title: "Warning Words Detected",
        description: `Found ${warnings.length} warning word(s) in the content.`,
        variant: "destructive"
      });
    }
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