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

// Allow both local dev hosts and the deployed public domain — createMcpExpressApp's
// default DNS-rebinding protection only trusts 127.0.0.1, which rejects every
// request once the server is reachable under a real public hostname.
const app = createMcpExpressApp({
  host: '0.0.0.0',
  allowedHosts: [
    'localhost',
    '127.0.0.1',
    'hidden-stories-mcp-server-c8a96.containers.snapdeploy.app',
  ],
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

app.listen(PORT, () => {
  console.log(`Serveur MCP démarré sur http://localhost:${PORT}/mcp`);
});
