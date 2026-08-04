import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3100/mcp';

// A fresh client per call keeps things simple and matches the MCP server's
// own stateless design — no long-lived connection/session to manage.
async function connectClient(): Promise<Client> {
  const client = new Client({ name: 'hidden-stories-agent', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
  await client.connect(transport);
  return client;
}

export async function listMcpTools() {
  const client = await connectClient();
  try {
    const { tools } = await client.listTools();
    return tools;
  } finally {
    await client.close();
  }
}

export async function callMcpTool(name: string, args: Record<string, unknown>) {
  const client = await connectClient();
  try {
    return await client.callTool({ name, arguments: args });
  } finally {
    await client.close();
  }
}
