import OpenAI from 'openai';
import { Template } from '@/types/compliance';

const DEFAULT_API_KEY = '';

export const getStoredApiKey = () => {
  return localStorage.getItem('openai_api_key') || DEFAULT_API_KEY;
};

export const setStoredApiKey = (apiKey: string) => {
  localStorage.setItem('openai_api_key', apiKey);
};

export const processWithAI = async (content: string, template: Template, apiKey: string) => {
  if (!apiKey) {
    throw new Error('Please provide an OpenAI API key');
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const prompt = `Format the following content according to this template: ${template.content}. 
                   Maintain the original meaning while adapting it to the template structure.
                   Content to format: ${content}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that formats content according to templates while maintaining the original meaning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content || '';
  } catch (error: any) {
    console.error('OpenAI Processing Error:', error);
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your OpenAI API key');
    }
    throw new Error('Failed to process content with AI');
  }
};