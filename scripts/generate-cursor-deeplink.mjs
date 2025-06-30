#!/usr/bin/env node

// Configuration for hosted server - just the transport config
const hostedConfig = {
  url: "https://eda-mcp-server.vercel.app/sse",
};

// Configuration for local development
const localConfig = {
  command: "tsx",
  args: ["app/[transport]/route.ts"],
  env: {
    NODE_ENV: "development",
  },
};

// Generate URLs for both configurations
function generateDeepLink(config, serverName = "eda-mcp-server") {
  const mcpConfig = { [serverName]: config };
  const encoded = btoa(JSON.stringify(mcpConfig));
  return `https://cursor.com/install-mcp?name=${serverName}&config=${encoded}`;
}

// Generate HTML button
function generateButton(config, serverName = "eda-mcp-server") {
  const deepLink = generateDeepLink(config, serverName);
  return `<a href="${deepLink}">
  <img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add ${serverName} MCP server to Cursor" height="32" />
</a>`;
}

console.log("🔗 EDA MCP Server - Cursor Deep Links");
console.log("====================================");
console.log();
console.log("📡 Hosted Server:");
console.log(generateButton(hostedConfig));
console.log();
console.log("🏠 Local Development:");
console.log(generateButton(localConfig));
console.log();
console.log("📋 Manual Configs:");
console.log();
console.log("Hosted config JSON:");
console.log(
  JSON.stringify({ mcpServers: { "eda-mcp-server": hostedConfig } }, null, 2)
);
console.log();
console.log("Local config JSON:");
console.log(
  JSON.stringify({ mcpServers: { "eda-mcp-server": localConfig } }, null, 2)
);
