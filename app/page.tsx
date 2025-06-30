import { NextRequest, NextResponse } from "next/server";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>EDA MCP Server - Exploratory Data Analysis Platform</title>
        <meta
          name="description"
          content="AI-powered Exploratory Data Analysis MCP server with TypeScript/Python integration for comprehensive data analysis workflows."
        />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
            font-weight: 700;
            text-align: center;
          }
          .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 40px;
            font-size: 1.2em;
          }
          .description {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            border-left: 5px solid #3498db;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .feature {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            border: 1px solid #e9ecef;
          }
          .feature h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3em;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 10px;
            text-align: center;
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
          }
          .github-button {
            background: linear-gradient(135deg, #2c3e50, #34495e);
          }
          .github-button:hover {
            box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
          }
          .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0;
          }
          .tech-badge {
            background: #e9ecef;
            color: #495057;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
          }
          .quick-start {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            border-left: 5px solid #28a745;
          }
          .quick-start code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>🔬 EDA MCP Server</h1>
          <p className="subtitle">AI-Powered Exploratory Data Analysis Platform</p>
          
          <div className="description">
            <p>
              <strong>EDA MCP Server</strong> is a comprehensive Model Context Protocol server that provides 
              intelligent data analysis tools powered by Python&apos;s data science ecosystem. Built with TypeScript, 
              Next.js, and OpenAI integration for autonomous data exploration workflows.
            </p>
          </div>

          <div className="features">
            <div className="feature">
              <h3>📊 Advanced EDA Tools</h3>
              <p>Six comprehensive analysis types: basic info, statistical summaries, correlation analysis, distribution plots, missing data analysis, and custom Python execution.</p>
            </div>
            <div className="feature">
              <h3>🤖 AI Agent Integration</h3>
              <p>OpenAI-powered agent that plans and executes complex multi-step data analysis workflows using natural language queries.</p>
            </div>
            <div className="feature">
              <h3>🐍 Python Integration</h3>
              <p>Seamless TypeScript-to-Python integration with pandas, matplotlib, seaborn, and numpy for professional data analysis.</p>
            </div>
            <div className="feature">
              <h3>🚀 Production Ready</h3>
              <p>Built with Next.js 15, TypeScript, Zod validation, and ready for Vercel deployment with comprehensive documentation.</p>
            </div>
          </div>

          <div className="tech-stack">
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">Next.js 15</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">pandas</span>
            <span className="tech-badge">OpenAI</span>
            <span className="tech-badge">MCP Protocol</span>
            <span className="tech-badge">Vercel</span>
          </div>

          <div className="quick-start">
            <h3>🚀 Quick Start</h3>
            <p>1. Clone: <code>git clone https://github.com/plijtmaer/eda-mcp-server.git</code></p>
            <p>2. Install: <code>pnpm install && pip3 install pandas matplotlib seaborn numpy</code></p>
            <p>3. Setup: <code>echo &quot;OPENAI_API_KEY=your_key&quot; &gt; .env.local</code></p>
            <p>4. Run: <code>pnpm dev</code></p>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a
              href="https://github.com/plijtmaer/eda-mcp-server"
              className="cta-button github-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 View on GitHub
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
