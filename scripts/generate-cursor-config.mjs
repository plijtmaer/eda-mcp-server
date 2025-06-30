#!/usr/bin/env node

const serverUrl = "https://eda-mcp-server.vercel.app";

// Local development config
const localConfig = {
  command: "tsx",
  args: ["app/[transport]/route.ts"],
  env: {
    NODE_ENV: "development",
  },
};

// Hosted config using the EDA MCP Server
const hostedConfig = {
  command: "npx",
  args: [
    "-y",
    "@modelcontextprotocol/server-everything",
    `${serverUrl}/mcp`,
  ],
};

// Generate MCP config for Cursor
const edaMcpConfig = {
  mcpServers: {
    "eda-mcp-server": hostedConfig,
  },
};

// Also generate local development config
const localMcpConfig = {
  mcpServers: {
    "eda-mcp-server": localConfig,
  },
};

// Alternative HTTP/SSE configs
const httpConfig = {
  mcpServers: {
    "eda-mcp-server": {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-everything",
        `${serverUrl}/mcp`,
      ],
    },
  },
};

const sseConfig = {
  mcpServers: {
    "eda-mcp-server": {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-everything",
        `${serverUrl}/sse`,
      ],
    },
  },
};

console.log("🔧 EDA MCP Server - Cursor Configurations");
console.log("=====================================");
console.log();
console.log("📡 Hosted (Default):");
console.log(JSON.stringify(edaMcpConfig, null, 2));
console.log();
console.log("🏠 Local Development:");
console.log(JSON.stringify(localMcpConfig, null, 2));
console.log();
console.log("🌐 HTTP Transport:");
console.log(JSON.stringify(httpConfig, null, 2));
console.log();
console.log("📊 SSE Transport:");
console.log(JSON.stringify(sseConfig, null, 2));
