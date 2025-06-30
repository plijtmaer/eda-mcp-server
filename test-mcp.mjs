#!/usr/bin/env node

/**
 * Simple MCP Server Tester
 * Usage: node test-mcp.mjs [server-url] [tool-name] [tool-args]
 * 
 * Examples:
 * node test-mcp.mjs                                    # List all tools
 * node test-mcp.mjs http://localhost:3000             # List tools on specific server
 * node test-mcp.mjs http://localhost:3000 echo        # Test echo tool
 * node test-mcp.mjs http://localhost:3000 echo "Hello World"  # Test echo with message
 */

const baseUrl = process.argv[2] || "http://localhost:3000";
const toolName = process.argv[3];
const toolArgs = process.argv[4];

async function makeRequest(method, params = {}) {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });

  const text = await response.text();
  
  // Handle SSE format
  if (text.startsWith("event: message")) {
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        return JSON.parse(line.slice(6));
      }
    }
  }
  
  // Handle JSON format
  try {
    return JSON.parse(text);
  } catch (e) {
    return { error: "Could not parse response", raw: text };
  }
}

async function listTools() {
  console.log(`🔍 Listing tools from: ${baseUrl}\n`);
  
  try {
    const response = await makeRequest("tools/list");
    
    if (response.error) {
      console.error("❌ Error:", response.error);
      return null;
    }
    
    const tools = response.result?.tools || [];
    console.log(`📋 Found ${tools.length} tools:\n`);
    
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
      
      const props = tool.inputSchema?.properties || {};
      const required = tool.inputSchema?.required || [];
      
      if (Object.keys(props).length > 0) {
        console.log(`   Parameters:`);
        Object.entries(props).forEach(([key, value]) => {
          const req = required.includes(key) ? " (required)" : " (optional)";
          console.log(`     - ${key}: ${value.type}${req} - ${value.description || 'No description'}`);
        });
      } else {
        console.log(`   Parameters: none`);
      }
      console.log();
    });
    
    return tools;
  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
    return null;
  }
}

async function callTool(name, args) {
  console.log(`🔧 Calling tool: ${name}`);
  if (args) console.log(`📝 Arguments: ${JSON.stringify(args)}\n`);
  
  try {
    const response = await makeRequest("tools/call", {
      name,
      arguments: args || {}
    });
    
    if (response.error) {
      console.error("❌ Tool error:", response.error);
      return;
    }
    
    if (response.result?.content) {
      console.log("✅ Tool response:");
      response.result.content.forEach(item => {
        if (item.type === "text") {
          console.log(item.text);
        } else {
          console.log(JSON.stringify(item, null, 2));
        }
      });
    } else {
      console.log("📄 Raw response:", JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("❌ Failed to call tool:", error.message);
  }
}

async function main() {
  console.log("🚀 MCP Server Tester\n");
  
  if (!toolName) {
    // Just list tools
    await listTools();
    console.log("💡 To test a tool, run: node test-mcp.mjs [server-url] [tool-name] [args]");
    return;
  }
  
  // Test specific tool
  let args = {};
  
  // Handle common tool arguments
  if (toolName === "echo" && toolArgs) {
    args = { message: toolArgs };
  } else if (toolName === "get-agent-bootcamp-setup-guide" && toolArgs) {
    args = { language: toolArgs };
  }
  
  await callTool(toolName, args);
}

main().catch(console.error); 