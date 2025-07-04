# EDA MCP Server 📊🤖

A comprehensive **Model Context Protocol (MCP) server** that provides **Exploratory Data Analysis (EDA)** tools for CSV and structured TXT files, powered by Python's data science stack and an intelligent TypeScript AI agent.

## 🎯 What This Project Does

This project demonstrates a complete **AI-powered data analysis workflow** using modern web technologies:

- **🔧 MCP Server**: TypeScript/Next.js server that hosts intelligent tools
- **🐍 Python Integration**: Seamlessly execute pandas/matplotlib/seaborn from TypeScript
- **🤖 AI Agent**: OpenAI-powered agent that plans and executes complex data workflows
- **📊 Advanced EDA**: 6 different analysis types with comprehensive statistics
- **🌐 Web Interface**: Modern Next.js web app with beautiful UI

## 🏗️ Current Tech Stack

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
- **Redis (Optional)** - SSE transport support only
- **Docker Support** - Containerizable architecture

## 📋 Table of Contents

- [🛠️ Installation & Prerequisites](#️-installation--prerequisites)  
- [🔬 EDA Tool Deep Dive](#-eda-tool-deep-dive)
- [🤖 AI Agent Features](#-ai-agent-features)
- [🧪 Testing & Development](#-testing--development)
- [📊 Sample Datasets](#-sample-datasets)
- [📁 Project Architecture](#-project-architecture)

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

# Optional: Redis for SSE transport (communication only, not data storage)
REDIS_URL=redis://localhost:6379
```

### **Setup & Start**
```bash
# 1. Clone and install dependencies
git clone https://github.com/plijtmaer/eda-mcp-server.git
cd eda-mcp-server
pnpm install

# 2. Start the MCP server (localhost:3000 for local testing)
pnpm dev

# 3. Test EDA capabilities - Available analysis types:
#    • basic_info - Dataset overview and structure
#    • statistical_summary - Descriptive statistics  
#    • correlation_analysis - Correlation matrix and relationships
#    • distribution_plots - Distribution analysis and outliers
#    • missing_data_analysis - Missing value patterns
#    • custom_analysis - Execute custom Python code

# Quick test shortcuts (use predefined file/analysis combinations):
pnpm test:eda                    # → sample_data.csv + basic_info
pnpm test:eda statistical_summary # → sample_data.csv + statistical_summary
pnpm test:eda correlation_analysis # → sample_data.csv + correlation_analysis

# Or use full command for custom file/analysis combinations (localhost for local testing):
node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "data/sample_data.csv", "analysis_type": "basic_info"}'

node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "data/sales_data.csv", "analysis_type": "statistical_summary"}'

node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "data/financial_data.csv", "analysis_type": "correlation_analysis"}'

# Or test with the deployed Vercel server:
node test-mcp.mjs https://eda-mcp-server.vercel.app exploratory-data-analysis '{"file_path": "https://eda-mcp-server.vercel.app/data/sample_data.csv", "analysis_type": "basic_info"}'

node test-mcp.mjs https://eda-mcp-server.vercel.app exploratory-data-analysis '{"file_path": "https://eda-mcp-server.vercel.app/data/sales_data.csv", "analysis_type": "statistical_summary"}'

# 4. Run the simple AI agent (basic implementation for testing and demos)
pnpm agent
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

## 📊 Current Data Support

### **✅ Currently Supported**
- **CSV files** - Comma-separated values
- **TXT files** - Tab/comma/semicolon-separated structured data
- **File-based analysis** - Local file processing
- **Python pandas integration** - Full pandas ecosystem

### **📁 Using Your Own Data**

#### **🏠 Local Development (Full Flexibility)**
```bash
# Any local file path works
node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "data/my_data.csv", "analysis_type": "basic_info"}'

node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "/Users/yourname/Documents/sales.csv", "analysis_type": "statistical_summary"}'

# HTTP URLs also work
node test-mcp.mjs http://localhost:3000 exploratory-data-analysis '{"file_path": "https://raw.githubusercontent.com/yourname/repo/main/data.csv", "analysis_type": "correlation_analysis"}'
```

#### **🌐 Deployed Server (HTTP URLs Only)**
```bash
# Use the provided sample data
node test-mcp.mjs https://eda-mcp-server.vercel.app exploratory-data-analysis '{"file_path": "https://eda-mcp-server.vercel.app/data/sample_data.csv", "analysis_type": "basic_info"}'

# Use your own data hosted online
node test-mcp.mjs https://eda-mcp-server.vercel.app exploratory-data-analysis '{"file_path": "https://raw.githubusercontent.com/yourname/yourrepo/main/yourdata.csv", "analysis_type": "statistical_summary"}'

# Upload to Dropbox/Google Drive and use direct download links
node test-mcp.mjs https://eda-mcp-server.vercel.app exploratory-data-analysis '{"file_path": "https://www.dropbox.com/s/abc123/data.csv?dl=1", "analysis_type": "correlation_analysis"}'
```

#### **💡 Ways to Host Your Data Online:**
1. **GitHub**: Upload CSV to repository, use raw.githubusercontent.com URL
2. **Dropbox**: Share file, add `?dl=1` to end of URL for direct download
3. **Google Drive**: Share as public, use direct download link
4. **Your own website**: Host CSV files in a public directory
5. **Data hosting services**: Kaggle, data.world, etc.

### **❌ Not Yet Supported (Future Development)**
- **Database connectivity** (PostgreSQL, MySQL, MongoDB)
- **Real-time streaming data**
- **Cloud storage integration** (S3, GCS, Azure)
- **API data ingestion**

## 🤖 AI Agent Features

The **TypeScript AI Agent** provides **intelligent automation** of data analysis workflows. This is a **simple implementation designed for testing and demonstration purposes**:

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

**Using your own data with the AI agent:**

🏠 **Local development:**
- *"Analyze /Users/me/Documents/sales_2024.csv with statistical summary"*
- *"Show me basic info for data/customer_data.csv"*

🌐 **With deployed server (use HTTP URLs):**
- *"Analyze https://raw.githubusercontent.com/me/myrepo/main/sales.csv with correlation analysis"*
- *"Show distribution analysis for https://www.dropbox.com/s/abc123/data.csv?dl=1"*

#### **Demo Mode**  
```bash
pnpm agent:demo
```
**Features:**
- Predefined analysis workflows
- Showcase of all capabilities
- Automated report generation
- Multiple dataset analysis

**Note**: This agent serves as a **proof-of-concept** for MCP-based data analysis automation. For production use, consider implementing more sophisticated planning, memory, and error handling.

## 🧪 Testing & Development

### **🔧 MCP Server Testing**
```bash
# List all available tools (local)
pnpm test:mcp

# Test basic connectivity (local)
pnpm test:mcp http://localhost:3000 echo "Hello World"

# Test deployed server
node test-mcp.mjs https://eda-mcp-server.vercel.app echo "Hello from deployed server"

# Verify tool discovery (local)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# Verify deployed server tools
curl -X POST https://eda-mcp-server.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
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

## 📁 Project Architecture

```
eda-mcp-server/                     # 🏠 Project root
├── agent/                          # 🤖 AI Agent system
│   └── simple-agent.ts            # TypeScript AI agent
├── app/                           # 🌐 Next.js application  
│   ├── [transport]/route.ts       # MCP protocol handler
│   ├── layout.tsx                 # App layout
│   └── page.tsx                   # Web interface
├── tools/                         # 🔧 MCP Tools
│   ├── eda-tool.ts                # Main EDA tool
│   ├── echo.ts                    # Testing tool
│   └── index.ts                   # Tool exports
├── data/                          # 📊 Sample datasets
│   ├── sample_data.csv            # Employee data
│   ├── sales_data.csv             # Sales data  
│   ├── weather_data.txt           # Weather data
│   └── financial_data.csv         # Financial data
├── lib/                           # 📚 Utility libraries
│   └── redis.ts                   # Redis configuration (SSE transport only)
├── test-mcp.mjs                   # 🧪 MCP server tester
├── test-eda.mjs                   # 🧪 EDA tool tester
├── package.json                   # 📦 Dependencies & scripts
└── README.md                      # 📖 Documentation
```

## 🔮 Future Development Roadmap

### **🎯 Planned Features (Not Yet Implemented)**

#### **📊 Data Sources**
- Database connectivity (PostgreSQL, MySQL, MongoDB)
- API data ingestion with authentication
- Real-time streaming data processing
- Cloud storage integration (S3, GCS, Azure)

#### **🧠 Agent Intelligence**
- Memory for conversation context
- Multi-step workflow planning with dependencies
- Custom analysis templates and presets
- Domain-specific expertise modules

#### **🎨 Visualization Enhancements**
- Save matplotlib plots to files and URLs
- Interactive charts with Plotly integration
- Dashboard creation with real-time updates
- Custom chart templates

#### **🔧 Advanced Analytics**
- Machine learning model training and evaluation
- Statistical hypothesis testing suite
- Time series analysis and forecasting
- Geospatial data processing capabilities

### **🚀 Contributing**

This project is open for contributions! Priority areas:
1. Database connectors for PostgreSQL/MySQL
2. Advanced visualization features
3. Machine learning integrations
4. Performance optimizations

---

## 📜 License & Contact

**Built with ❤️ using**: TypeScript, Next.js, Python, OpenAI, and the Model Context Protocol.

**Repository**: [https://github.com/plijtmaer/eda-mcp-server](https://github.com/plijtmaer/eda-mcp-server)

🚀 **Ready for production deployment and continuous enhancement!**
