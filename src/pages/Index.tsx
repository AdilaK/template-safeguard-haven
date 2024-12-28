import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TemplateForm } from '@/components/compliance/TemplateForm';
import { TemplateList } from '@/components/compliance/TemplateList';
import { ContentProcessor } from '@/components/compliance/ContentProcessor';
import { Template, ComplianceResult } from '@/types/compliance';
import { ComplianceResults } from '@/components/compliance/ComplianceResults';

const CompliancePlatform = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [complianceResults, setComplianceResults] = useState<ComplianceResult | null>(null);
  const [convertedContent, setConvertedContent] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState<Template>({
    name: '',
    content: '',
    warningWords: [],
    synonyms: {}
  });

  const checkCompliance = () => {
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
      isCompliant: true,
      issues: [],
      warnings
    });
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required template fields.",
        variant: "destructive"
      });
      return;
    }
    
    setTemplates(prev => [...prev, { ...newTemplate, id: Date.now() }]);
    setNewTemplate({
      name: '',
      content: '',
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Output Compliance Platform</h1>
          <p className="text-gray-500">Ensure your AI-generated content meets compliance standards</p>
        </div>

        <Card className="content-area">
          <CardContent className="p-6">
            <Tabs defaultValue="check" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="check">Check Compliance</TabsTrigger>
                <TabsTrigger value="templates">Manage Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="check" className="space-y-6 fade-in">
                <ContentProcessor
                  content={content}
                  setContent={setContent}
                  setConvertedContent={setConvertedContent}
                  selectedTemplate={selectedTemplate}
                  templates={templates}
                  onContentProcessed={checkCompliance}
                />

                {complianceResults && (
                  <ComplianceResults results={complianceResults} convertedContent={convertedContent} />
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <TemplateForm
                  newTemplate={newTemplate}
                  setNewTemplate={setNewTemplate}
                  onSave={saveTemplate}
                />
                <TemplateList
                  templates={templates}
                  onDelete={deleteTemplate}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePlatform;