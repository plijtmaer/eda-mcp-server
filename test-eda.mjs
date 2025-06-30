#!/usr/bin/env node

/**
 * EDA Tool Tester
 * Usage: node test-eda.mjs [analysis_type]
 */

const baseUrl = "http://localhost:3000";
const analysisType = process.argv[2] || "basic_info";

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

async function testEDA() {
  console.log("🔬 Testing EDA Tool\n");
  
  const testCases = [
    {
      name: "Basic Info - Employee Data",
      params: {
        file_path: "./data/sample_data.csv",
        analysis_type: "basic_info"
      }
    },
    {
      name: "Statistical Summary - Employee Data", 
      params: {
        file_path: "./data/sample_data.csv",
        analysis_type: "statistical_summary"
      }
    },
    {
      name: "Correlation Analysis - Employee Data",
      params: {
        file_path: "./data/sample_data.csv", 
        analysis_type: "correlation_analysis"
      }
    },
    {
      name: "Basic Info - Sales Data",
      params: {
        file_path: "./data/sales_data.csv",
        analysis_type: "basic_info"
      }
    },
    {
      name: "Text File Analysis - Weather Data",
      params: {
        file_path: "./data/weather_data.txt",
        analysis_type: "basic_info"
      }
    }
  ];

  const testToRun = testCases.find(t => t.params.analysis_type === analysisType) || testCases[0];
  
  console.log(`🧪 Running: ${testToRun.name}`);
  console.log(`📁 File: ${testToRun.params.file_path}`);
  console.log(`📊 Analysis: ${testToRun.params.analysis_type}\n`);

  try {
    const response = await makeRequest("tools/call", {
      name: "exploratory-data-analysis",
      arguments: testToRun.params
    });
    
    if (response.error) {
      console.error("❌ Tool error:", response.error);
      return;
    }
    
    if (response.result?.content) {
      console.log("✅ EDA Results:");
      console.log("=" * 80);
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
    console.error("❌ Failed to test EDA:", error.message);
  }
}

console.log("Available analysis types:");
console.log("- basic_info");
console.log("- statistical_summary");  
console.log("- correlation_analysis");
console.log("- missing_data_analysis");
console.log("- distribution_plots");
console.log("- custom_analysis\n");

testEDA().catch(console.error); 