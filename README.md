# EDA MCP Server 📊🤖

A comprehensive **Model Context Protocol (MCP) server** that provides **Exploratory Data Analysis (EDA)** tools for CSV and structured TXT files, powered by Python's data science stack and an intelligent TypeScript AI agent.

## 🎯 What This Project Does

This project demonstrates a complete **AI-powered data analysis workflow** using modern web technologies:

- **🔧 MCP Server**: TypeScript/Next.js server that hosts intelligent tools
- **🐍 Python Integration**: Seamlessly execute pandas/matplotlib/seaborn from TypeScript
- **🤖 AI Agent**: OpenAI-powered agent that plans and executes complex data workflows
- **📊 Advanced EDA**: 6 different analysis types with comprehensive statistics
- **🌐 Web Interface**: Modern Next.js web app with beautiful UI

## 🏗️ Complete Tech Stack

### **Backend & MCP Server**
- **TypeScript** - Type-safe server logic
- **Next.js 15** - Modern React framework for server-side rendering
- **@vercel/mcp-adapter** - Official Vercel MCP integration
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **Zod** - Runtime type validation

### **Data Analysis Engine**  
- **Python 3** - Data processing runtime
- **pandas** - Data manipulation and analysis
- **matplotlib** - Statistical plotting and visualization
- **seaborn** - Advanced statistical visualizations
- **numpy** - Numerical computing foundation

### **AI & Agent System**
- **OpenAI API** - GPT-4o-mini for intelligent planning
- **TypeScript Agent** - Autonomous workflow execution
- **Dynamic Tool Discovery** - Runtime MCP tool detection

### **Development & Testing**
- **tsx** - Fast TypeScript execution
- **pnpm** - Efficient package management
- **dotenv** - Environment variable management
- **Node.js Streams** - Subprocess communication

### **Deployment Ready**
- **Vercel** - Serverless deployment platform
- **Redis (Optional)** - SSE transport support
- **Docker Support** - Containerizable architecture

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🛠️ Installation & Prerequisites](#️-installation--prerequisites)  
- [🔬 EDA Tool Deep Dive](#-eda-tool-deep-dive)
- [🤖 AI Agent Features](#-ai-agent-features)
- [📊 Sample Datasets](#-sample-datasets)
- [🧪 Testing & Development](#-testing--development)
- [🚀 Deployment Guide](#-deployment-guide)
- [📁 Project Architecture](#-project-architecture)

## 🚀 Quick Start

```bash
# 1. Clone and install dependencies
git clone <your-repo>
cd hw3
pnpm install

# 2. Install Python dependencies
pip3 install pandas matplotlib seaborn numpy

# 3. Set up environment variables
echo "OPENAI_API_KEY=your_key_here" > .env.local

# 4. Start the MCP server
pnpm dev

# 5. Test EDA capabilities
pnpm test:eda correlation_analysis

# 6. Run the AI agent
pnpm agent
```

## 🛠️ Installation & Prerequisites

### **Required Software**
- **Node.js 18+** - JavaScript runtime
- **Python 3.8+** - Data analysis engine  
- **pnpm** - Package manager (`npm install -g pnpm`)

### **Python Data Science Stack**
```bash
# Install required Python packages
pip3 install pandas matplotlib seaborn numpy

# Verify installation
python3 -c "import pandas, matplotlib, seaborn, numpy; print('✅ All packages installed')"
```

### **Environment Setup**
Create `.env.local` file:
```bash
# Required for AI agent
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Redis for SSE transport
REDIS_URL=redis://localhost:6379
```

## 🔬 EDA Tool Deep Dive

The **Exploratory Data Analysis** tool is the heart of this system, offering **6 comprehensive analysis types**:

### **📋 1. Basic Information (`basic_info`)**
**What it analyzes:**
- Dataset shape (rows × columns)
- Column names and data types
- Memory usage optimization
- First 5 rows preview
- Data loading diagnostics

**Perfect for:** Initial data exploration and quality assessment

### **📈 2. Statistical Summary (`statistical_summary`)**  
**Numerical columns:**
- Descriptive statistics (mean, median, std, min, max, quartiles)
- Count of non-null values
- Distribution insights

**Categorical columns:**
- Unique value counts
- Most frequent values (top 3)
- Category distribution analysis

**Perfect for:** Understanding data distributions and central tendencies

### **🔗 3. Correlation Analysis (`correlation_analysis`)**
**Advanced correlation detection:**
- Complete correlation matrix for numerical variables
- Automatic high correlation identification (|r| > 0.7)
- Relationship strength interpretation
- Multicollinearity detection

**Perfect for:** Feature selection and relationship discovery

### **📊 4. Distribution Analysis (`distribution_plots`)**
**Per-column statistical analysis:**
- Central tendency (mean, median)
- Variability (standard deviation, range)
- Shape analysis (skewness)
- Outlier detection using IQR method
- Distribution normality assessment

**Perfect for:** Data quality assessment and anomaly detection

### **❓ 5. Missing Data Analysis (`missing_data_analysis`)**
**Comprehensive missing data audit:**
- Missing values per column (count & percentage)
- Total dataset completeness
- Missing data patterns
- Data quality scoring

**Perfect for:** Data cleaning strategy development

### **🔧 6. Custom Analysis (`custom_analysis`)**
**Flexible Python execution:**
- Custom pandas operations
- Advanced statistical tests
- Specialized data transformations
- Domain-specific calculations

**Available variables:**
- `df` - Your loaded DataFrame
- `pd` - pandas library
- `np` - numpy library  
- `plt` - matplotlib.pyplot
- `sns` - seaborn library

**Perfect for:** Specialized analysis requirements

### **🎯 Tool Parameters**

```typescript
interface EDAParams {
  file_path: string;        // "./data/your_file.csv"
  analysis_type: string;    // One of the 6 analysis types
  custom_code?: string;     // Python code (custom_analysis only)
  columns?: string[];       // Specific columns to analyze
}
```

### **💡 Usage Examples**

```bash
# Quick dataset overview
pnpm test:eda basic_info

# Comprehensive statistics
pnpm test:eda statistical_summary

# Find data relationships  
pnpm test:eda correlation_analysis

# Detect outliers and data quality issues
pnpm test:eda distribution_plots

# Check data completeness
pnpm test:eda missing_data_analysis
```

## 🤖 AI Agent Features

The **TypeScript AI Agent** provides **intelligent automation** of data analysis workflows:

### **🧠 Core Capabilities**
- **Autonomous Planning** - Uses OpenAI to create analysis strategies
- **Tool Discovery** - Automatically detects available MCP tools
- **Smart Execution** - Executes multi-step analysis workflows
- **Error Recovery** - Handles tool failures gracefully
- **Natural Language Interface** - Plain English analysis requests

### **🎮 Agent Modes**

#### **Interactive Mode**
```bash
pnpm agent
```
**Features:**
- Natural language queries
- Real-time analysis execution  
- Iterative exploration
- Context-aware suggestions

**Example queries:**
- *"Analyze the financial data and show me correlations between revenue and profit"*
- *"Find outliers in the employee salary data"*
- *"Compare weather patterns across all days"*

#### **Demo Mode**  
```bash
pnpm agent:demo
```
**Features:**
- Predefined analysis workflows
- Showcase of all capabilities
- Automated report generation
- Multiple dataset analysis

### **🎯 How the Agent Works**

1. **🔍 Discovery Phase**
   - Connects to MCP server
   - Enumerates available tools
   - Scans data directory for files

2. **🧠 Planning Phase**
   - Sends user request to OpenAI
   - Generates step-by-step analysis plan
   - Selects appropriate tools and parameters

3. **⚡ Execution Phase**
   - Executes analysis steps sequentially
   - Collects and formats results
   - Provides comprehensive reporting

4. **📊 Reporting Phase**
   - Presents findings in readable format
   - Highlights key insights
   - Suggests follow-up analyses

## 📊 Sample Datasets

The `/data` folder contains **4 diverse datasets** for comprehensive testing:

### **👥 Employee Data (`sample_data.csv`)**
**15 rows × 7 columns**
```
Columns: name, age, salary, department, years_experience, satisfaction_score, city
Data Types: Mixed (string, int, float)
Use Cases: HR analytics, correlation analysis, salary distribution
```

### **💰 Sales Data (`sales_data.csv`)**  
**10 rows × 6 columns**
```
Columns: product, region, sales_amount, quantity, date, sales_rep
Data Types: Mixed (string, int, date)
Use Cases: Revenue analysis, regional performance, sales trends
```

### **🌤️ Weather Data (`weather_data.txt`)**
**7 rows × 6 columns**
```
Columns: day, condition, temperature_f, humidity, wind_speed, precipitation  
Data Types: Mixed (string, int, float)
Use Cases: Environmental analysis, pattern detection, forecasting
```

### **🏢 Financial Data (`financial_data.csv`)**
**8 rows × 7 columns**
```
Columns: company, sector, revenue_million, profit_margin, employees, market_cap_billion, debt_ratio
Data Types: Mixed (string, float, int)
Use Cases: Corporate analysis, sector comparison, financial ratios
```

### **📁 Adding Your Own Data**
1. Place CSV/TXT files in `/data` folder
2. Ensure structured format (comma/semicolon/tab separated)
3. Use file path: `"./data/your_file.csv"`

**Supported formats:**
- **CSV** - Comma-separated values
- **TXT** - Tab or comma-separated structured data
- **Custom separators** - Automatically detected

## 🧪 Testing & Development

### **🔧 MCP Server Testing**
```bash
# List all available tools
pnpm test:mcp

# Test basic connectivity  
pnpm test:mcp http://localhost:3000 echo "Hello World"

# Verify tool discovery
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### **📊 EDA Tool Testing**
```bash
# Test each analysis type
pnpm test:eda basic_info
pnpm test:eda statistical_summary  
pnpm test:eda correlation_analysis
pnpm test:eda distribution_plots
pnpm test:eda missing_data_analysis

# Test different datasets
# Edit test-eda.mjs to customize file/analysis combinations
```

### **🤖 Agent Testing**
```bash
# Interactive mode
pnpm agent

# Demo mode (automated workflows)
pnpm agent:demo

# Debug mode (with verbose logging)
DEBUG=* pnpm agent
```

### **⚙️ Development Scripts**
```json
{
  "dev": "next dev",              // Start Next.js server
  "build": "next build",          // Build for production  
  "start": "next start",          // Start production server
  "test:mcp": "node test-mcp.mjs", // Test MCP tools
  "test:eda": "node test-eda.mjs", // Test EDA functionality
  "agent": "tsx agent/simple-agent.ts", // Run AI agent
  "agent:demo": "tsx agent/simple-agent.ts demo" // Agent demo mode
}
```

## 🚀 Deployment Guide

### **🔥 Vercel Deployment (Recommended)**

1. **Prepare for deployment:**
```bash
# Clean git history (remove original commits)
rm -rf .git
git init
git add .
git commit -m "Initial commit: EDA MCP Server"

# Push to your GitHub
git remote add origin https://github.com/yourusername/eda-mcp-server.git
git branch -M main
git push -u origin main
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use GitHub integration at vercel.com
```

3. **Environment variables in Vercel:**
```bash
# Set in Vercel dashboard
OPENAI_API_KEY=your_openai_api_key
```

### **🐳 Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t eda-mcp-server .
docker run -p 3000:3000 eda-mcp-server
```

### **☁️ Cloud Deployment Options**
- **Vercel** - Serverless, auto-scaling (Recommended)
- **Netlify** - Static + serverless functions
- **Railway** - Full-stack deployment
- **AWS/GCP/Azure** - Enterprise-grade hosting

## 📁 Project Architecture

```
hw3/                                 # 🏠 Project root
├── agent/                           # 🤖 AI Agent system
│   └── simple-agent.ts             # TypeScript AI agent
├── app/                            # 🌐 Next.js application  
│   ├── [transport]/route.ts        # MCP protocol handler
│   ├── layout.tsx                  # App layout
│   └── page.tsx                    # Web interface
├── tools/                          # 🔧 MCP Tools
│   ├── eda-tool.ts                 # Main EDA tool
│   ├── echo.ts                     # Testing tool
│   └── index.ts                    # Tool exports
├── data/                           # 📊 Sample datasets
│   ├── sample_data.csv             # Employee data
│   ├── sales_data.csv              # Sales data  
│   ├── weather_data.txt            # Weather data
│   └── financial_data.csv          # Financial data
├── lib/                            # 📚 Utility libraries
│   └── redis.ts                    # Redis configuration
├── test-mcp.mjs                    # 🧪 MCP server tester
├── test-eda.mjs                    # 🧪 EDA tool tester
├── package.json                    # 📦 Dependencies & scripts
├── tsconfig.json                   # ⚙️ TypeScript config
├── next.config.ts                  # ⚙️ Next.js config
└── README.md                       # 📖 Documentation
```

### **🎯 Key Design Patterns**

**MCP Architecture:**
- **Server**: Next.js handles HTTP/SSE transport
- **Tools**: Modular TypeScript functions with Zod validation
- **Agent**: Autonomous TypeScript client with OpenAI integration

**Data Flow:**
```
User Request → AI Agent → MCP Server → EDA Tool → Python → Results → User
```

**Error Handling:**
- Graceful Python subprocess failures
- Tool validation with detailed error messages
- Agent retry logic with fallback strategies

## 🛡️ Production Considerations

### **🔒 Security**
- API key encryption in environment variables
- Input validation with Zod schemas
- Subprocess sandboxing for Python execution
- CORS configuration for web security

### **⚡ Performance**
- Lazy loading of Python processes
- Result caching for repeated analyses
- Streaming responses for large datasets
- Connection pooling for concurrent requests

### **📈 Scalability**
- Serverless architecture ready
- Horizontal scaling support
- Database integration capability
- Multi-tenant data isolation

## 🔮 Advanced Features & Extensions

### **🎨 Visualization Enhancements**
- Save matplotlib plots to files
- Interactive charts with Plotly
- Dashboard creation with real-time updates

### **🧠 Agent Intelligence**
- Memory for conversation context
- Multi-step workflow planning
- Custom analysis templates
- Domain-specific expertise modules

### **📊 Data Sources**
- Database connectivity (PostgreSQL, MySQL)
- API data ingestion
- Real-time streaming data
- Cloud storage integration (S3, GCS)

### **🔧 Tool Ecosystem**
- Machine learning model training
- Statistical hypothesis testing
- Time series analysis
- Geospatial data processing

---

## 📜 License & Contributing

**Perfect for**: Learning MCP development, building data analysis workflows, creating AI agents, and understanding modern TypeScript/Python integration patterns.

**Built with ❤️ using**: TypeScript, Next.js, Python, OpenAI, and the Model Context Protocol.

🚀 **Ready for production deployment and continuous enhancement!**
