
import React from 'react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface APIKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ apiKey, setApiKey }) => {
  return (
    <div className="space-y-2">
      <Input
        type="password"
        placeholder="Enter your OpenAI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <Alert>
        <AlertDescription>
          Get your OpenAI API key from{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            OpenAI Platform
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
};
