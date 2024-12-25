import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CompliancePlatform = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [complianceResults, setComplianceResults] = useState(null);
  const [convertedContent, setConvertedContent] = useState('');
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: '',
    content: '',
    prohibitedKeywords: [],
    warningWords: [],
  });

  const templateTypes = [
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

    toast({
      title: issues.length === 0 ? "Content Compliant" : "Compliance Issues Found",
      description: issues.length === 0 
        ? "Your content meets all compliance requirements."
        : `Found ${issues.length} issue(s) and ${warnings.length} warning(s).`,
      variant: issues.length === 0 ? "default" : "destructive"
    });
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.type || !newTemplate.content) {
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
      type: '',
      content: '',
      prohibitedKeywords: [],
      warningWords: [],
    });

    toast({
      title: "Template Saved",
      description: "Your new template has been saved successfully.",
    });
  };

  const deleteTemplate = (templateId) => {
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

                <div className="input-group">
                  <label className="label">AI-Generated Content</label>
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your AI-generated content here..."
                    className="h-40"
                  />
                </div>

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
                        <AlertTitle className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          {issue.type === 'prohibited' ? 'Prohibited Keyword Found' : 'Structure Issue'}
                        </AlertTitle>
                        <AlertDescription>{issue.message}</AlertDescription>
                      </Alert>
                    ))}

                    {complianceResults.warnings.map((warning, index) => (
                      <Alert key={index}>
                        <AlertTitle className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Warning
                        </AlertTitle>
                        <AlertDescription>{warning.message}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-6 fade-in">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Template Name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value }))}
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
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    className="h-32"
                  />

                  <div className="space-y-2">
                    <Input
                      placeholder="Add prohibited keyword (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          setNewTemplate(prev => ({
                            ...prev,
                            prohibitedKeywords: [...prev.prohibitedKeywords, e.target.value]
                          }));
                          e.target.value = '';
                        }
                      }}
                    />
                    <Input
                      placeholder="Add warning word (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          setNewTemplate(prev => ({
                            ...prev,
                            warningWords: [...prev.warningWords, e.target.value]
                          }));
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>

                  <Button onClick={saveTemplate} className="w-full">
                    <Save className="w-4 h-4 mr-2" /> Save Template
                  </Button>
                </div>

                <div className="space-y-4">
                  {templates.map(template => (
                    <Card key={template.id} className="template-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.type}</p>
                          <div className="mt-2">
                            {template.prohibitedKeywords.length > 0 && (
                              <p className="text-sm text-red-500">
                                Prohibited: {template.prohibitedKeywords.join(', ')}
                              </p>
                            )}
                            {template.warningWords.length > 0 && (
                              <p className="text-sm text-yellow-500">
                                Warnings: {template.warningWords.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteTemplate(template.id)}
                          className="hover:text-red-500"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePlatform;