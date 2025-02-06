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

    const warningWordsContext = template.warningWords.length > 0 
      ? `Additionally, the following words are flagged as warning words and should be avoided: ${template.warningWords.join(', ')}.`
      : '';

    const systemPrompt = `You are a compliance monitor for AI-generated content. Your task is to analyze the provided text against a predefined template and check for compliance with the following rules:

1. Template Structure:  
   - The text must include required sections such as greetings, body content, and closings as defined by the template.
   - Dynamic placeholders (e.g., [Recipient], [Your Name]) should be recognized and, if present, confirmed to be in the correct locations.

2. Greetings and Closings:  
   - Detect if a greeting (e.g., "Dear [Recipient],", "Hi [Recipient],", "Hello [Recipient],") is present.  
   - If the content already includes a greeting or closing, replace or modify it according to the template rather than adding duplicates.
   - Adjust the greeting and closing based on the context (formal, casual, neutral) provided in the template.

3. Content Cleanup:  
   - Remove unnecessary prefatory phrases such as "Here is a summary:", "Here's a response I've drafted:", or "Is there anything else you need help with?" while preserving the core message.
   - Ensure the tone and structure of the content naturally align with the selected template.

4. Compliance Feedback:  
   - Highlight or flag any deviations from the template.  
   - Provide suggestions for corrections where the content does not meet the template requirements.
   - Generate a compliance report that includes a summary of issues detected (if any) and recommendations to fix them.

5. Final Output:  
   - Return a refined version of the content that conforms to the template and a separate compliance report detailing any modifications made or required.

${warningWordsContext}

Please format your response as a JSON object with two fields:
1. "content": The processed and compliant content
2. "report": The compliance report with any issues or modifications made`;

    const userPrompt = `Template to follow: ${template.content}
Content to analyze: ${content}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"content": "", "report": "Processing failed"}');
    
    // Log the compliance report for debugging
    console.log('Compliance Report:', result.report);
    
    // Return only the processed content as before to maintain compatibility
    return result.content;
  } catch (error: any) {
    console.error('OpenAI Processing Error:', error);
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your OpenAI API key');
    }
    throw new Error('Failed to process content with AI');
  }
};