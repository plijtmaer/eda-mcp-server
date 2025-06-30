#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const serverUrl =
  process.argv[2] || "https://eda-mcp-server.vercel.app/mcp";

async function testToolDiscovery() {
  console.log(`🔍 Discovering tools from: ${serverUrl}`);

  const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    const client = new Client(
      {
      name: "eda-mcp-tool-discovery",
        version: "1.0.0",
      },
      {
      capabilities: {
        tools: {},
      },
      }
    );

  try {
    await client.connect(transport);
    console.log("✅ Connected successfully");

    const tools = await client.listTools();
    console.log(`\n📊 Found ${tools.tools.length} tools:`);

    tools.tools.forEach((tool, index) => {
      console.log(`\n${index + 1}. ${tool.name}`);
        console.log(`   Description: ${tool.description}`);
      if (tool.inputSchema?.properties) {
        console.log(`   Parameters:`);
        Object.entries(tool.inputSchema.properties).forEach(([param, schema]) => {
          console.log(`     - ${param}: ${schema.type || 'any'} ${schema.description ? `(${schema.description})` : ''}`);
        });
      }
    });

    console.log(`\n✅ Tool discovery completed`);
  } catch (error) {
    console.error("❌ Failed to discover tools:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

testToolDiscovery();
