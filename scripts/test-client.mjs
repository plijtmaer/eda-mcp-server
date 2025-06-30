#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testClient() {
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

    // List available tools
    const tools = await client.listTools();
    console.log("Available tools:", tools.tools.map((t) => t.name));

    // Test each tool
    for (const tool of tools.tools) {
      console.log(`\nTesting tool: ${tool.name}`);
      try {
        let result;
        if (tool.name === "echo") {
          result = await client.callTool(tool.name, {
            message: "Test message",
          });
        } else if (tool.name === "exploratory_data_analysis") {
          result = await client.callTool(tool.name, {
            file_path: "data/sample_data.csv",
            analysis_type: "basic_info",
          });
        }

        if (result) {
          console.log("Result:", result.content[0].text.substring(0, 200));
        }
      } catch (error) {
        console.log(`Error testing ${tool.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Failed to connect:", error);
  } finally {
    await client.close();
  }
}

testClient();
