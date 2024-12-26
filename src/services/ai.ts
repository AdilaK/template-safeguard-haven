import { GoogleGenerativeAI } from '@google/generative-ai';
import { Template } from '@/types/compliance';

export const processWithAI = async (content: string, template: Template, apiKey: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Format the following content according to this template: ${template.content}. 
                   Maintain the original meaning while adapting it to the template structure.
                   Content to format: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to process content with AI');
  }
};