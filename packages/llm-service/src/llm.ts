import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chatWithSystem(systemPrompt: string, userPrompt: string): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    messages: messages as any,
  });
  return response.choices[0].message?.content ?? '';
}

export async function ideationPrompt(idea: string): Promise<string> {
  const system =
    'You are an AI Co-Pilot assisting with ideation for a creator pack. Ask Socratic questions to refine the core idea.';
  return chatWithSystem(system, idea);
}

export async function structuringPrompt(context: string): Promise<string> {
  const system =
    'You are an AI Co-Pilot helping structure a creator pack using a three-level framework. Suggest a structure.';
  return chatWithSystem(system, context);
}

export async function contentGenerationPrompt(topic: string): Promise<string> {
  const system =
    'You are an AI Co-Pilot brainstorming content for a creator pack. Provide questions or activities.';
  return chatWithSystem(system, topic);
}

export async function refinementPrompt(feedback: string): Promise<string> {
  const system =
    'You are an AI Co-Pilot refining pacing and emotional balance in a creator pack. Provide feedback.';
  return chatWithSystem(system, feedback);
}
