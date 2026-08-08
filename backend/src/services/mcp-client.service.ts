import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3100/mcp';

// SnapDeploy's free tier puts idle containers to sleep after 15 minutes. A
// sleeping container answers any request with an HTML "waking up" page
// instead of the real service — a browser's own JS notices that and wakes it,
// but a server-to-server call (like this one) never runs that script, so it
// has to detect and trigger the wake-up itself.
function isSleepingContainerError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('<!DOCTYPE html>');
}

async function wakeSleepingContainer(): Promise<void> {
  const subdomain = new URL(MCP_SERVER_URL).hostname.split('.')[0];
  const wakeUrl = `https://snapdeploy.dev/api/public/wake/${subdomain}`;

  console.log(`mcp-server semble endormi, réveil via ${wakeUrl}...`);
  await fetch(wakeUrl, { method: 'POST' }).catch(() => {
    // The wake call itself failing isn't fatal — we still retry the real
    // connection below in case the container was already on its way up.
  });
}

async function connectFreshClient(): Promise<Client> {
  const client = new Client({ name: 'hidden-stories-agent', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
  await client.connect(transport);
  return client;
}

// A fresh client per call keeps things simple and matches the MCP server's
// own stateless design — no long-lived connection/session to manage.
async function connectClient(): Promise<Client> {
  try {
    return await connectFreshClient();
  } catch (error) {
    if (!isSleepingContainerError(error)) {
      throw error;
    }

    await wakeSleepingContainer();

    // The wake-up page itself estimates 60-90s — retry a couple of times
    // with a wait in between rather than giving up after the first miss.
    const RETRY_DELAYS_MS = [20000, 25000];
    let lastError = error;
    for (const delay of RETRY_DELAYS_MS) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      try {
        return await connectFreshClient();
      } catch (retryError) {
        lastError = retryError;
        if (!isSleepingContainerError(retryError)) {
          throw retryError;
        }
      }
    }
    throw lastError;
  }
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
