#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "https://eda-mcp-server.vercel.app";

async function testHttpTools() {
  console.log(`🌐 Testing EDA MCP Server via HTTP: ${origin}`);
  
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "eda-mcp-http-test",
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

    // List tools
    const tools = await client.listTools();
    console.log("\n🔧 Available tools:", tools.tools.map(t => t.name));

    // Test echo tool
    if (tools.tools.some(t => t.name === "echo")) {
      console.log("\n🚀 Testing echo tool...");
      const echoResult = await client.callTool("echo", {
        message: "Hello from EDA MCP HTTP test!",
      });
      console.log("Echo result:", echoResult.content[0]?.text);
    }

    // Test EDA tool if available
    if (tools.tools.some(t => t.name === "exploratory_data_analysis")) {
      console.log("\n📊 Testing EDA tool (basic info)...");
      try {
        const edaResult = await client.callTool("exploratory_data_analysis", {
          file_path: "data/sample_data.csv",
          analysis_type: "basic_info",
        });
        console.log("EDA result preview:", edaResult.content[0]?.text?.substring(0, 200) + "...");
      } catch (error) {
        console.log("EDA test failed (expected if sample data doesn't exist):", error.message);
      }
    }

    console.log("\n✅ HTTP tool testing completed");
  } catch (error) {
    console.error("❌ HTTP test failed:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

testHttpTools();
