import Groq from 'groq-sdk';

import { callMcpTool, listMcpTools } from './mcp-client.service';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOOL_ROUNDS = 5;

const SYSTEM_PROMPT =
  'Tu es un guide touristique passionné qui aide les visiteurs à découvrir les monuments ' +
  'historiques de Marrakech. Réponds de façon chaleureuse et informative, en français, en ' +
  "t'appuyant uniquement sur les informations obtenues via les outils à ta disposition. " +
  "Si tu ne trouves pas l'information demandée, dis-le honnêtement plutôt que d'inventer.";

export async function askAssistant(userMessage: string): Promise<string> {
  const mcpTools = await listMcpTools();
  const tools: Groq.Chat.Completions.ChatCompletionTool[] = mcpTools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema as Record<string, unknown>,
    },
  }));

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      tools,
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content ?? "Désolé, je n'ai pas pu formuler de réponse.";
    }

    for (const toolCall of message.tool_calls) {
      // Some models emit "null" (rather than "{}") for tools that take no
      // arguments, which the MCP server rejects — normalize it here.
      const args = JSON.parse(toolCall.function.arguments || '{}') ?? {};
      const result = (await callMcpTool(toolCall.function.name, args)) as {
        content?: Array<{ type: string; text?: string }>;
      };
      const firstBlock = result.content?.[0];
      const text =
        (firstBlock && firstBlock.type === 'text' ? firstBlock.text : undefined) ??
        JSON.stringify(result);

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: text,
      });
    }
  }

  return "Désolé, je n'ai pas réussi à formuler une réponse après plusieurs tentatives.";
}
