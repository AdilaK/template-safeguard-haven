import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceChecker } from '@/components/compliance/ComplianceChecker';
import { TemplateManager } from '@/components/compliance/TemplateManager';
import { useComplianceCheck } from '@/hooks/useComplianceCheck';
import { useTemplateManager } from '@/hooks/useTemplateManager';

const CompliancePlatform = () => {
  const {
    content,
    setContent,
    selectedTemplate,
    setSelectedTemplate,
    complianceResults,
    convertedContent,
    setConvertedContent,
    checkCompliance
  } = useComplianceCheck();

  const {
    templates,
    newTemplate,
    setNewTemplate,
    saveTemplate,
    deleteTemplate
  } = useTemplateManager();

  const handleCheckCompliance = () => {
    checkCompliance(content, selectedTemplate, templates);
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
                <ComplianceChecker
                  content={content}
                  setContent={setContent}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  templates={templates}
                  complianceResults={complianceResults}
                  convertedContent={convertedContent}
                  setConvertedContent={setConvertedContent}
                  onCheckCompliance={handleCheckCompliance}
                />
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <TemplateManager
                  newTemplate={newTemplate}
                  setNewTemplate={setNewTemplate}
                  templates={templates}
                  onSave={saveTemplate}
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