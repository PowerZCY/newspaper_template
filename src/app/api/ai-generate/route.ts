import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { error } from 'console';
import { appConfig } from '@/lib/appConfig';

export async function POST(req: Request) {
  const { prompt, maxChars } = await req.json();
  // TODO: DPA
  console.warn('[NewsUI]', { prompt, maxChars });
  const limitMaxChars = Math.min(appConfig.newsAI.limitMaxChars, maxChars);
  const fullPrompt = `${prompt}\nResult no more than ${limitMaxChars} characters`;
  
  const modelName = appConfig.newsAI.modelName;
  const enableMock = appConfig.newsAI.enableMock;

  if (enableMock !== 'false') {
    console.warn('[AI-Mock-Switch]', enableMock);
    // mock mode, return mock data
    if (process.env.NODE_ENV !== 'production' && appConfig.newsAI.mockTimeout) {
      // mock timeout 3s
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    if (process.env.NODE_ENV !== 'production' && appConfig.newsAI.mockAds) {
        // mock ads dialog
        throw  error('MOCK TEST!')
    }
    const mockText = `[MockData] ${fullPrompt}`;
    return Response.json({ text: mockText });
  }

  // print request log, TODO: DPA
  console.warn('[AI-Request]', { modelName, prompt, maxChars, fullPrompt });
  
  const openrouter = createOpenRouter({ apiKey:  appConfig.newsAI.apiKey});
  const response = streamText({
    model: openrouter(modelName),
    prompt: fullPrompt,
  });

  await response.consumeStream();
  // console.log('[AI-Response]', { response });
  const text = await response.text;
  // print AI response log, TODO: DPA
  console.warn('[AI-Response]', { text });
  return Response.json({ text });
}
