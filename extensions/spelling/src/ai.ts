import OpenAI from "openai";
import { getPreference } from "./preference";

function getClient() {
  const { url, apiKey } = getPreference();
  const client = new OpenAI({
    baseURL: url,
    apiKey: apiKey,
  });
  return client;
}

const prompt = `
I need you to proofread and correct the following text. Your only task is to identify and fix any spelling errors, punctuation mistakes, and grammatical inaccuracies. **Crucially, you must preserve the original meaning and intent of the text. Do not alter any wording or add any new information.** Simply output the corrected version
`;
export async function fixSpelling(text: string): Promise<string> {
  const { model } = getPreference();
  const client = getClient();
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: text },
    ],
    max_tokens: 512,
    temperature: 0.6,
    top_p: 0.95,
    presence_penalty: 0,
    stream: false,
  });
  return response.choices[0].message.content ?? "";
}
