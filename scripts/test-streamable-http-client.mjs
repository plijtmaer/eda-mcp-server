#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "eda-mcp-streamable-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  console.log(`🌊 Testing streamable HTTP client with EDA MCP Server: ${origin}`);
  await client.connect(transport);

  console.log("✅ Connected", client.getServerCapabilities());

  const result = await client.listTools();
  console.log("📋 Available tools:", result.tools.map(t => t.name));

  // Test tools if available
  for (const tool of result.tools) {
    console.log(`\n🔧 Testing tool: ${tool.name}`);
    try {
      let testResult;
      if (tool.name === "echo") {
        testResult = await client.callTool(tool.name, {
          message: "Test from streamable client",
        });
      } else if (tool.name === "exploratory_data_analysis") {
        testResult = await client.callTool(tool.name, {
          file_path: "data/sample_data.csv",
          analysis_type: "basic_info",
        });
      }
      
      if (testResult) {
        console.log("✅ Tool response received:", testResult.content[0]?.text?.substring(0, 100) + "...");
      }
    } catch (error) {
      console.log(`❌ Tool test failed: ${error.message}`);
    }
  }

  client.close();
}

main();
