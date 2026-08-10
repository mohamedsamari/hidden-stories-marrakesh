import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';

import { registerTools } from './tools';

const PORT = process.env.PORT || 3100;

function createServer() {
  const server = new McpServer({
    name: 'hidden-stories-marrakesh',
    version: '1.0.0',
  });
  registerTools(server);
  return server;
}

// DNS-rebinding protection exists to stop a malicious webpage from tricking a
// browser into calling a server on someone's localhost. This server is only
// ever called by our own backend (never a browser), and it's reached through
// a Cloudflare Tunnel whose hostname changes on every restart — so an
// allowlist can't be kept in sync. Disabling the check is the right trade-off
// here, not a workaround.
const app = createMcpExpressApp({ host: '0.0.0.0' });

// Plain health-check endpoint — hosting platforms commonly ping "/" right
// after startup to decide whether a deploy is healthy, and MCP itself only
// exposes POST/GET on /mcp (GET there deliberately returns 405).
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/mcp', async (req, res) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Erreur MCP:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

app.get('/mcp', (req, res) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed.' },
    id: null,
  });
});

export default app;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Serveur MCP démarré sur http://localhost:${PORT}/mcp`);
  });
}