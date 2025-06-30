#!/usr/bin/env node

const serverUrl = "https://eda-mcp-server.vercel.app";

console.log("Cursor MCP Configuration Options:\n");

console.log("Option 1: Direct SSE Connection (Cursor 0.48.0+, for LOCAL development):");
console.log(
  JSON.stringify(
    {
      mcpServers: {
        "eda-mcp-server": {
          url: "http://localhost:3000/sse",
        },
      },
    },
    null,
    2
  )
);

console.log("\n---\n");

console.log("Option 2: Using mcp-remote (Recommended for both local and deployed):");
console.log(
  JSON.stringify(
    {
      mcpServers: {
        "eda-mcp-server": {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            `${serverUrl}/mcp`,
          ],
          env: {},
        },
      },
    },
    null,
    2
  )
);

console.log("\n---\n");

console.log("Option 3: For local development with mcp-remote:");
console.log(
  JSON.stringify(
    {
      mcpServers: {
        "eda-mcp-server": {
          command: "npx",
          args: ["-y", "mcp-remote", "http://localhost:3000/mcp"],
        },
      },
    },
    null,
    2
  )
);

console.log(
  "\nNote: Try Option 1 for local development if you have Cursor 0.48.0+. Use Option 2 for deployed server."
);
