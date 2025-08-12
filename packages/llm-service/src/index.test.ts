import { ideationPrompt, structuringPrompt, contentGenerationPrompt, refinementPrompt } from './llm';

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'response' } }],
        }),
      },
    },
  })),
}));

describe('LLM service', () => {
  it('returns a string from ideationPrompt', async () => {
    const res = await ideationPrompt('test');
    expect(res).toBe('response');
  });
  it('returns a string from structuringPrompt', async () => {
    const res = await structuringPrompt('test');
    expect(res).toBe('response');
  });
  it('returns a string from contentGenerationPrompt', async () => {
    const res = await contentGenerationPrompt('test');
    expect(res).toBe('response');
  });
  it('returns a string from refinementPrompt', async () => {
    const res = await refinementPrompt('test');
    expect(res).toBe('response');
  });
});
