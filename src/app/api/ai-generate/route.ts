import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { error } from 'console';

export async function POST(req: Request) {
  const { prompt, maxChars } = await req.json();
  console.log('[NewsUI]', { prompt, maxChars });
  const fullPrompt = `${prompt}\nAttention: Generate a content with no more than ${maxChars} characters`;
  
  const modelName = process.env.OPENROUTER_MODEL_NAME || '';
  const mockSwitch = process.env.OPENROUTER_MOCK || true;
  console.log('[AI-Mock-Switch]', mockSwitch);

  if (mockSwitch !== 'false') {
    // mock mode, return mock data
    if (process.env.NODE_ENV !== 'production' && process.env.OPENROUTER_MOCK_ADS === 'true') {
        // mock ads dialog
        throw  error('MOCK TEST!')
    }
    if (process.env.NODE_ENV !== 'production' && process.env.OPENROUTER_MOCK_TIMEOUT === 'true') {
      // mock timeout 3s
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    const mockText = `【MockData】${fullPrompt}`;
    return Response.json({ text: mockText });
  }

  // print request log
  console.log('[AI-Request]', { modelName, prompt, maxChars, fullPrompt });
  
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const response = streamText({
    model: openrouter(modelName),
    prompt: fullPrompt,
  });

  await response.consumeStream();

  // print AI response log
  console.log('[AI-Response]', { text: response.text });

  return Response.json({ text: response.text });
}
