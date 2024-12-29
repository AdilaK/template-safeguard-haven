import React from 'react';
import { Template } from '@/types/compliance';
import { TemplateForm } from './TemplateForm';
import { TemplateList } from './TemplateList';

interface TemplateManagerProps {
  newTemplate: Template;
  setNewTemplate: (template: Template) => void;
  templates: Template[];
  onSave: () => void;
  onDelete: (id: number) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  newTemplate,
  setNewTemplate,
  templates,
  onSave,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      <TemplateForm
        newTemplate={newTemplate}
        setNewTemplate={setNewTemplate}
        onSave={onSave}
      />
      <TemplateList
        templates={templates}
        onDelete={onDelete}
      />
    </div>
  );
};