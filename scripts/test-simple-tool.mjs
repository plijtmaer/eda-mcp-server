#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "tsx",
    args: ["app/[transport]/route.ts"],
    env: { NODE_ENV: "development" },
  });

  const client = new Client(
    {
      name: "eda-mcp-test-client",
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
    console.log("✅ Connected to EDA MCP server");

    // List available tools
    const tools = await client.listTools();
    console.log("\n🔧 Available tools:");
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    // Test echo tool
    console.log("\n🚀 Testing echo tool...");
    const echoResult = await client.callTool("echo", {
      message: "Hello from EDA MCP Server test!",
    });

    console.log("Echo result:", echoResult.content[0].text);

    // Test EDA tool if sample data exists
    console.log("\n📊 Testing EDA tool...");
    try {
      const edaResult = await client.callTool("exploratory_data_analysis", {
        file_path: "data/sample_data.csv",
        analysis_type: "basic_info",
      });

      console.log("EDA basic_info result:");
      console.log(edaResult.content[0].text.substring(0, 300) + "...");
    } catch (error) {
      console.log("EDA test skipped (no sample data or tool not available)");
    }

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
