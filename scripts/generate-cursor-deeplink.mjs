#!/usr/bin/env node

// Configuration for hosted server - just the transport config
const hostedConfig = {
  command: "npx",
  args: [
    "-y",
    "mcp-remote",
    "https://eda-mcp-server.vercel.app/mcp",
  ],
  env: {},
};

// Configuration for local development
const localConfig = {
  command: "npx",
  args: [
    "-y",
    "mcp-remote",
    "http://localhost:3000/mcp",
  ],
  env: {},
};

// Direct SSE config for local development (Cursor 0.48.0+)
const localSSEConfig = {
  url: "http://localhost:3000/sse",
};

// Generate URLs for both configurations
function generateDeepLink(config, serverName = "eda-mcp-server") {
  // Base64 encode the config (not the whole server object)
  const configStr = JSON.stringify(config);
  const base64Config = Buffer.from(configStr).toString("base64");

  // URL encode the base64 string
  const encodedConfig = encodeURIComponent(base64Config);

  return `https://cursor.com/install-mcp?name=${serverName}&config=${encodedConfig}`;
}

// Generate HTML button
function generateButton(config, serverName = "eda-mcp-server") {
  const url = generateDeepLink(config, serverName);
  return `<a href="${url}"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add ${serverName} MCP server to Cursor" height="32" /></a>`;
}

console.log("=== Cursor MCP Installation Links ===\n");

console.log("For HOSTED server (recommended):");
console.log(generateDeepLink(hostedConfig));
console.log("\nHTML Button:");
console.log(generateButton(hostedConfig));
console.log("\n");

console.log("For LOCAL development (mcp-remote):");
console.log(generateDeepLink(localConfig));
console.log("\n");

console.log("For LOCAL development (direct SSE, Cursor 0.48.0+):");
console.log(generateDeepLink(localSSEConfig));
console.log("\n");

console.log("=== Manual Configuration ===");
console.log("If the deeplink doesn't work, add this to ~/.cursor/mcp.json:");
console.log("\nFor hosted server:");
console.log(
  JSON.stringify({ mcpServers: { "eda-mcp-server": hostedConfig } }, null, 2)
);
console.log("\nFor local development (mcp-remote):");
console.log(
  JSON.stringify({ mcpServers: { "eda-mcp-server": localConfig } }, null, 2)
);
console.log("\nFor local development (direct SSE):");
console.log(
  JSON.stringify({ mcpServers: { "eda-mcp-server": localSSEConfig } }, null, 2)
);
