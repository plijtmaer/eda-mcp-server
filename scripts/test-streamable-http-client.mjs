#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  console.log(`🌐 Testing HTTP client with EDA MCP Server: ${origin}`);
  
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "eda-mcp-http-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  try {
    await client.connect(transport);

    console.log("✅ Connected to HTTP endpoint", client.getServerCapabilities());

    const result = await client.listTools();
    console.log("📋 Available tools:", result.tools.map(t => t.name));
    
    // Test echo tool
    if (result.tools.some(t => t.name === "echo")) {
      console.log("\n🚀 Testing echo tool...");
      const echoResult = await client.callTool("echo", {
        message: "Hello from HTTP client!",
      });
      console.log("Echo result:", echoResult.content[0]?.text);
    }

    // Test EDA tool if available
    if (result.tools.some(t => t.name === "exploratory-data-analysis")) {
      console.log("\n📊 Testing EDA tool (basic info)...");
      try {
        const edaResult = await client.callTool("exploratory-data-analysis", {
          file_path: "data/sample_data.csv",
          analysis_type: "basic_info",
        });
        console.log("EDA result preview:", edaResult.content[0]?.text?.substring(0, 200) + "...");
      } catch (error) {
        console.log("EDA test failed (expected if sample data doesn't exist):", error.message);
      }
    }

    console.log("\n✅ HTTP client testing completed");
    client.close();
  } catch (error) {
    console.error("❌ HTTP test failed:", error.message);
    process.exit(1);
  }
}

main();
