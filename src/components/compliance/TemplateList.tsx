import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Template } from '@/types/compliance';

interface TemplateListProps {
  templates: Template[];
  onDelete: (id: number) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({ templates, onDelete }) => {
  return (
    <div className="space-y-2">
      {templates.map(template => (
        <Card key={template.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.type}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onDelete(template.id)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};