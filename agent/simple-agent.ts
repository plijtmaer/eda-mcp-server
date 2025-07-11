#!/usr/bin/env ts-node

/**
 * Simple AI Agent for MCP Server (TypeScript)
 * 
 * This agent demonstrates how to:
 * 1. Connect to your MCP server
 * 2. Discover available tools
 * 3. Perform intelligent data analysis workflows
 * 
 * Usage: 
 * pnpm agent
 * pnpm agent:demo
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface MCPResponse {
  result?: {
    tools?: MCPTool[];
    content?: Array<{ type: string; text: string }>;
  };
  error?: any;
}

class SimpleAgent {
  private openai: OpenAI;
  private mcpUrl: string;
  private availableTools: MCPTool[] = [];

  constructor(mcpUrl: string = "http://localhost:3000") {
    this.mcpUrl = mcpUrl;
    console.log(`🤖 Initializing EDA Agent with MCP server: ${mcpUrl}`);
    console.log(`💡 Use 'https://eda-mcp-server.vercel.app' to test with deployed server`);
    
    // Initialize OpenAI (requires OPENAI_API_KEY in .env.local)
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  /**
   * Make a request to the MCP server
   */
  private async makeMCPRequest(method: string, params: any = {}): Promise<MCPResponse> {
    const response = await fetch(`${this.mcpUrl}/mcp`, {
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
      return { error: "Could not parse response" };
    }
  }

  /**
   * Connect to MCP server and discover tools
   */
  async initialize(): Promise<void> {
    console.log("🤖 Initializing Simple Agent...");
    console.log(`🔗 Connecting to MCP server: ${this.mcpUrl}`);
    
    try {
      const response = await this.makeMCPRequest("tools/list");
      
      if (response.error) {
        throw new Error(`MCP Error: ${JSON.stringify(response.error)}`);
      }
      
      this.availableTools = response.result?.tools || [];
      console.log(`✅ Discovered ${this.availableTools.length} tools:`);
      
      this.availableTools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name} - ${tool.description}`);
      });
      
    } catch (error) {
      console.error("❌ Failed to connect to MCP server:", error);
      throw error;
    }
  }

  /**
   * Call a tool via MCP
   */
  async callTool(toolName: string, args: any): Promise<string> {
    console.log(`🔧 Calling tool: ${toolName}`);
    console.log(`📝 Arguments:`, args);
    
    const response = await this.makeMCPRequest("tools/call", {
      name: toolName,
      arguments: args
    });
    
    if (response.error) {
      throw new Error(`Tool error: ${JSON.stringify(response.error)}`);
    }
    
    if (response.result?.content) {
      return response.result.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");
    }
    
    return "Tool executed successfully but returned no text content.";
  }

  /**
   * Use OpenAI to plan and execute data analysis workflows
   */
  async analyzeDataWithAI(userRequest: string): Promise<void> {
    console.log("\n🧠 AI Planning Phase");
    console.log("=".repeat(50));
    console.log(`User Request: ${userRequest}`);
    
    // Get available data files
    const dataFiles = fs.readdirSync('./data').filter(f => f.endsWith('.csv') || f.endsWith('.txt'));
    
    const systemPrompt = `You are a data analysis assistant. You have access to these MCP tools:

${this.availableTools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

Available data files: ${dataFiles.map(f => `./data/${f}`).join(', ')}

Based on the user's request, create a step-by-step analysis plan using the available tools.
Return ONLY a JSON array of tool calls in this format:
[
  {
    "tool": "tool-name",
    "args": { "file_path": "./data/filename.csv", "analysis_type": "basic_info" },
    "reasoning": "Why this step is needed"
  }
]`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userRequest }
        ],
        temperature: 0.1,
      });

      const plan = completion.choices[0]?.message?.content;
      if (!plan) {
        throw new Error("No plan generated by AI");
      }

      console.log("\n📋 AI Generated Plan:");
      console.log(plan);

      // Parse and execute the plan
      let toolCalls;
      try {
        toolCalls = JSON.parse(plan);
      } catch (e) {
        console.log("⚠️  AI response wasn't valid JSON, extracting JSON...");
        const jsonMatch = plan.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          toolCalls = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from AI response");
        }
      }

      console.log("\n🚀 Executing Analysis Plan");
      console.log("=".repeat(50));

      for (let i = 0; i < toolCalls.length; i++) {
        const step = toolCalls[i];
        console.log(`\nStep ${i + 1}: ${step.reasoning}`);
        
        try {
          const result = await this.callTool(step.tool, step.args);
          console.log("\n📊 Results:");
          console.log(result);
          console.log("\n" + "─".repeat(80));
        } catch (error) {
          console.error(`❌ Step ${i + 1} failed:`, error);
        }
      }

    } catch (error) {
      console.error("❌ AI analysis failed:", error);
    }
  }

  /**
   * Interactive mode - ask the AI agent to analyze data
   */
  async runInteractive(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("\n🤖 Simple Agent - Interactive Mode");
    console.log("Ask me to analyze your data! (type 'quit' to exit)");
    console.log("Examples:");
    console.log("- 'Analyze the employee data and show me correlations'");
    console.log("- 'Give me a statistical summary of sales data'");
    console.log("- 'Compare all datasets and find interesting patterns'\n");

    const askQuestion = (): Promise<string> => {
      return new Promise(resolve => {
        rl.question("📝 What would you like me to analyze? ", resolve);
      });
    };

    while (true) {
      try {
        const input = await askQuestion();
        
        if (input.toLowerCase().includes('quit') || input.toLowerCase().includes('exit')) {
          console.log("👋 Goodbye!");
          break;
        }
        
        if (input.trim()) {
          await this.analyzeDataWithAI(input);
        }
        
      } catch (error) {
        console.error("❌ Error:", error);
      }
    }

    rl.close();
  }

  /**
   * Run predefined demo workflows
   */
  async runDemo(): Promise<void> {
    console.log("\n🎬 Running Demo Workflows");
    console.log("=".repeat(50));

    const demoRequests = [
      "Give me basic information about the employee dataset",
      "Show me statistical summaries and correlations for the sales data",
      "Analyze the weather text file to understand its structure"
    ];

    for (let i = 0; i < demoRequests.length; i++) {
      console.log(`\n🎭 Demo ${i + 1}/${demoRequests.length}`);
      await this.analyzeDataWithAI(demoRequests[i]);
      
      if (i < demoRequests.length - 1) {
        console.log("\n⏳ Waiting 2 seconds before next demo...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}

// Main execution
async function main() {
  const mode = process.argv[2] || 'interactive';
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in .env.local");
      console.log("Please add your OpenAI API key to .env.local");
      process.exit(1);
    }

    const agent = new SimpleAgent();
    await agent.initialize();

    if (mode === 'demo') {
      await agent.runDemo();
    } else {
      await agent.runInteractive();
    }

  } catch (error) {
    console.error("❌ Agent failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
} 