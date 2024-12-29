import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TemplateForm } from '@/components/compliance/TemplateForm';
import { TemplateList } from '@/components/compliance/TemplateList';
import { ContentProcessor } from '@/components/compliance/ContentProcessor';
import { Template, ComplianceResult, TemplateType } from '@/types/compliance';

const CompliancePlatform = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [complianceResults, setComplianceResults] = useState<ComplianceResult | null>(null);
  const [convertedContent, setConvertedContent] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState<Template>({
    name: '',
    type: '',
    content: '',
    prohibitedKeywords: [],
    warningWords: [],
    synonyms: {}
  });

  const templateTypes: TemplateType[] = [
    'Customer Service Email',
    'Marketing Copy',
    'Internal Communication',
    'Sales Pitch',
    'Product Description'
  ];

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
      type: '',
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
                <div className="input-group">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.name}>
                          {template.name} ({template.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ContentProcessor
                  content={content}
                  setContent={setContent}
                  setConvertedContent={setConvertedContent}
                  selectedTemplate={selectedTemplate}
                  templates={templates}
                  onContentProcessed={checkCompliance}
                />

                {convertedContent && (
                  <div className="input-group">
                    <label className="label">Converted Content</label>
                    <Textarea 
                      value={convertedContent}
                      readOnly
                      className="h-40 bg-gray-50"
                    />
                  </div>
                )}

                <Button onClick={checkCompliance} className="w-full">
                  Check Compliance
                </Button>

                {complianceResults && (
                  <div className="results-area">
                    <Alert variant={complianceResults.isCompliant ? "default" : "destructive"}>
                      <AlertTitle className="flex items-center gap-2">
                        {complianceResults.isCompliant ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <XCircle className="text-red-500" />
                        )}
                        Compliance Check Results
                      </AlertTitle>
                    </Alert>

                    {complianceResults.issues.map((issue, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTitle>{issue.type === 'prohibited' ? 'Prohibited Keyword Found' : 'Structure Issue'}</AlertTitle>
                        <AlertDescription>{issue.message}</AlertDescription>
                      </Alert>
                    ))}

                    {complianceResults.warnings.map((warning, index) => (
                      <Alert key={index}>
                        <AlertTitle className="flex items-center gap-2">Warning</AlertTitle>
                        <AlertDescription>{warning.message}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <TemplateForm
                  newTemplate={newTemplate}
                  setNewTemplate={setNewTemplate}
                  templateTypes={templateTypes}
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