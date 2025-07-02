import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt, maxChars } = await req.json();
  console.log('[NewsUI]', { prompt, maxChars });
  const fullPrompt = `${prompt}\nAttention: Generate a content with no more than ${maxChars} characters`;
  
  const modelName = process.env.OPENROUTER_MODEL_NAME || '';
  const mockSwitch = process.env.OPENROUTER_MOCK || true;
  console.log('[AI-Mock-Switch]', mockSwitch);

  if (mockSwitch !== 'false') {
    // mock模式，直接返回模拟数据
    const mockText = `【MockData】${fullPrompt}`;
    return Response.json({ text: mockText });
  }

  // 打印请求日志
  console.log('[AI-Request]', { modelName, prompt, maxChars, fullPrompt });
  
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const response = streamText({
    model: openrouter(modelName),
    prompt: fullPrompt,
  });

  await response.consumeStream();

  // 打印AI返回内容日志
  console.log('[AI-Response]', { text: response.text });

  return Response.json({ text: response.text });
}
