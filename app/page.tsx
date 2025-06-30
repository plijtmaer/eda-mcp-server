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
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            }
            h1 {
            color: #2c3e50;
                margin-bottom: 8px;
            font-size: 2.2em;
            font-weight: 700;
            text-align: center;
            }
            .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 25px;
            font-size: 1.1em;
            }
            .description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 5px solid #3498db;
            font-size: 0.95em;
            }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .feature {
            background: white;
            padding: 18px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
            border: 1px solid #e9ecef;
          }
          .feature h3 {
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 1.1em;
          }
          .feature p {
            font-size: 0.85em;
            line-height: 1.4;
            margin: 0;
          }
          .cta-button {
                display: inline-block;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 12px 24px;
                text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 8px;
            text-align: center;
            transition: transform 0.2s ease;
            font-size: 0.9em;
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
          .cursor-button {
            background: linear-gradient(135deg, #007acc, #005a9e);
            margin-bottom: 5px;
          }
          .cursor-button:hover {
            box-shadow: 0 8px 25px rgba(0, 122, 204, 0.3);
          }
          .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 15px 0;
            justify-content: center;
          }
          .tech-badge {
            background: #e9ecef;
            color: #495057;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 500;
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
              <h3>📊 Advanced EDA</h3>
              <p>Six analysis types: basic info, statistics, correlations, distributions, missing data, custom analysis.</p>
            </div>
            <div className="feature">
              <h3>🤖 AI Agent</h3>
              <p>OpenAI-powered agent for autonomous multi-step data analysis workflows.</p>
            </div>
            <div className="feature">
              <h3>🐍 Python Integration</h3>
              <p>Seamless TypeScript-to-Python integration with pandas, matplotlib, seaborn.</p>
            </div>
            <div className="feature">
              <h3>🚀 Production Ready</h3>
              <p>Next.js 15, TypeScript, Zod validation, Vercel deployment ready.</p>
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

          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <a
              href="https://cursor.com/install-mcp?name=eda-mcp-server&config=eyJ1cmwiOiJodHRwczovL2VkYS1tY3Atc2VydmVyLnZlcmNlbC5hcHAvIn0="
              className="cta-button cursor-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔌 Add to Cursor
            </a>
            <br />
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
