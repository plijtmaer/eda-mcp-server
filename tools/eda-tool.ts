import { z } from "zod";
import { spawn } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export const edaTool = {
  name: "exploratory-data-analysis",
  description: "Perform exploratory data analysis on CSV or TXT files using pandas, matplotlib, and seaborn",
  schema: {
    file_path: z.string().describe("Path to the CSV or TXT file to analyze"),
    analysis_type: z.enum([
      "basic_info",
      "statistical_summary", 
      "correlation_analysis",
      "distribution_plots",
      "missing_data_analysis",
      "custom_analysis"
    ]).describe("Type of analysis to perform"),
    custom_code: z.string().optional().describe("Custom Python code for analysis (only used with custom_analysis type)"),
    columns: z.array(z.string()).optional().describe("Specific columns to analyze (optional)")
  },
  handler: async ({ file_path, analysis_type, custom_code, columns }: {
    file_path: string;
    analysis_type: "basic_info" | "statistical_summary" | "correlation_analysis" | "distribution_plots" | "missing_data_analysis" | "custom_analysis";
    custom_code?: string;
    columns?: string[];
  }) => {
    try {
      // Check if file exists (for local files) or if it's a URL
      const isUrl = file_path.startsWith('http://') || file_path.startsWith('https://');
      
      if (!isUrl && !existsSync(file_path)) {
        return {
          content: [{ 
            type: "text" as const, 
            text: `❌ Error: File '${file_path}' not found. 

📝 **Using the deployed server? Try these options:**
• Sample datasets: https://eda-mcp-server.vercel.app/data/sample_data.csv
• Your own HTTP URLs: https://your-domain.com/your-data.csv
• Upload your data to GitHub/Dropbox and use the raw URL

📁 **For local development:** Use local paths like "data/sample_data.csv" or "/full/path/to/your/file.csv"

💡 **Tip:** To analyze your own data with the deployed server, host your CSV files online and use the HTTP URL.` 
          }],
        };
      }

      // Generate Python script based on analysis type
      const pythonScript = generatePythonScript(file_path, analysis_type, custom_code, columns, isUrl);
      
      // Write Python script to temporary file
      // Use /tmp directory in serverless environments (Vercel), current directory locally
    const tempDir = process.env.VERCEL ? '/tmp' : process.cwd();
    const scriptPath = join(tempDir, 'temp_eda_script.py');
      writeFileSync(scriptPath, pythonScript);
      
      // Execute Python script
      const result = await executePythonScript(scriptPath);
      
      // Clean up temporary file
      try {
        const fs = await import('fs');
        fs.unlinkSync(scriptPath);
      } catch (e) {
        // Silent cleanup failure
      }
      
      return {
        content: [{ 
          type: "text" as const, 
          text: result 
        }],
      };
      
    } catch (error) {
      return {
        content: [{ 
          type: "text" as const, 
          text: `❌ Error performing EDA: ${error instanceof Error ? error.message : String(error)}` 
        }],
      };
    }
  },
};

function generatePythonScript(
  filePath: string, 
  analysisType: string, 
  customCode?: string, 
  columns?: string[],
  isUrl?: boolean
): string {
  const columnsFilter = columns && columns.length > 0 
    ? `df = df[${JSON.stringify(columns)}]` 
    : '';
    
  const dataLoadingScript = isUrl ? `
    # Load data from URL
    import requests
    file_path = "${filePath}"
    
    try:
        response = requests.get(file_path)
        response.raise_for_status()
        from io import StringIO
        
        if file_path.lower().endswith('.csv'):
            df = pd.read_csv(StringIO(response.text))
        else:
            # Try reading as CSV anyway
            df = pd.read_csv(StringIO(response.text))
    except Exception as e:
        print(f"❌ Error loading data from URL: {e}")
        print(f"📡 Attempted URL: {file_path}")
        sys.exit(1)
  ` : `
    # Load data from local file
    file_path = r"${filePath}"
    
    try:
        if file_path.lower().endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            # Try reading as CSV anyway (might be comma-separated)
            df = pd.read_csv(file_path)
    except:
        try:
            # Try with different separator
            df = pd.read_csv(file_path, sep='\\t')
        except:
            # Try reading as plain text
            with open(file_path, 'r') as f:
                lines = f.readlines()
            print(f"📄 File contains {len(lines)} lines of text")
            print("First few lines:")
            for i, line in enumerate(lines[:5]):
                print(f"  {i+1}: {line.strip()}")
            sys.exit(0)
  `;
    
  const baseScript = `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sys
from io import StringIO
import warnings
warnings.filterwarnings('ignore')

# Configure matplotlib for non-interactive use
plt.switch_backend('Agg')

try:
    ${dataLoadingScript}
    
    print(f"📊 Data loaded successfully: {df.shape[0]} rows × {df.shape[1]} columns")
    ${columnsFilter}
    
`;

  const analysisScripts = {
    basic_info: `
    print("\\n📋 BASIC INFORMATION")
    print("=" * 50)
    print(f"Shape: {df.shape}")
    print(f"\\nColumn names and types:")
    for col in df.columns:
        print(f"  • {col}: {df[col].dtype}")
    
    print(f"\\nMemory usage: {df.memory_usage(deep=True).sum() / 1024:.2f} KB")
    print(f"\\nFirst 5 rows:")
    print(df.head().to_string())
    `,
    
    statistical_summary: `
    print("\\n📈 STATISTICAL SUMMARY")
    print("=" * 50)
    
    # Numerical columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        print("\\nNumerical columns summary:")
        print(df[numeric_cols].describe().to_string())
    
    # Categorical columns
    cat_cols = df.select_dtypes(include=['object']).columns
    if len(cat_cols) > 0:
        print("\\nCategorical columns summary:")
        for col in cat_cols:
            print(f"\\n{col}:")
            print(f"  Unique values: {df[col].nunique()}")
            print(f"  Most common: {df[col].value_counts().head(3).to_dict()}")
    `,
    
    correlation_analysis: `
    print("\\n🔗 CORRELATION ANALYSIS")
    print("=" * 50)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 1:
        corr_matrix = df[numeric_cols].corr()
        print("\\nCorrelation Matrix:")
        print(corr_matrix.to_string())
        
        # Find high correlations
        high_corr = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                corr_val = corr_matrix.iloc[i, j]
                if abs(corr_val) > 0.7:
                    high_corr.append(f"{corr_matrix.columns[i]} ↔ {corr_matrix.columns[j]}: {corr_val:.3f}")
        
        if high_corr:
            print("\\n🔍 High correlations (|r| > 0.7):")
            for corr in high_corr:
                print(f"  • {corr}")
        else:
            print("\\n✅ No high correlations found (|r| > 0.7)")
    else:
        print("❌ Need at least 2 numerical columns for correlation analysis")
    `,
    
    distribution_plots: `
    print("\\n📊 DISTRIBUTION ANALYSIS")
    print("=" * 50)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    for col in numeric_cols:
        print(f"\\n{col}:")
        print(f"  Mean: {df[col].mean():.3f}")
        print(f"  Median: {df[col].median():.3f}")  
        print(f"  Std: {df[col].std():.3f}")
        print(f"  Skewness: {df[col].skew():.3f}")
        print(f"  Range: {df[col].min():.3f} to {df[col].max():.3f}")
        
        # Check for outliers using IQR method
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers = df[(df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)]
        print(f"  Outliers (IQR method): {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")
    `,
    
    missing_data_analysis: `
    print("\\n❓ MISSING DATA ANALYSIS")
    print("=" * 50)
    
    missing_data = df.isnull().sum()
    missing_percent = (missing_data / len(df)) * 100
    
    print("Missing values by column:")
    for col in df.columns:
        missing_count = missing_data[col]
        missing_pct = missing_percent[col]
        if missing_count > 0:
            print(f"  • {col}: {missing_count} ({missing_pct:.1f}%)")
        else:
            print(f"  ✅ {col}: No missing values")
    
    total_missing = missing_data.sum()
    print(f"\\nTotal missing values: {total_missing} ({total_missing/(len(df)*len(df.columns))*100:.1f}% of all values)")
    `,
    
    custom_analysis: customCode || `
    print("\\n🔧 CUSTOM ANALYSIS")
    print("=" * 50)
    
    # Add your custom analysis code here
    print("No custom code provided. Available variables:")
    print("  • df: Your dataframe")
    print("  • pd: pandas")
    print("  • np: numpy") 
    print("  • plt: matplotlib.pyplot")
    print("  • sns: seaborn")
    
    print(f"\\nDataframe info:")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    `
  };

  return baseScript + (analysisScripts[analysisType as keyof typeof analysisScripts] || analysisScripts.basic_info) + `
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
`;
}

function executePythonScript(scriptPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output || '✅ Analysis completed successfully');
      } else {
        // Try with 'python' if 'python3' fails
        const fallbackProcess = spawn('python', [scriptPath], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let fallbackOutput = '';
        let fallbackError = '';

        fallbackProcess.stdout.on('data', (data) => {
          fallbackOutput += data.toString();
        });

        fallbackProcess.stderr.on('data', (data) => {
          fallbackError += data.toString();
        });

        fallbackProcess.on('close', (fallbackCode) => {
          if (fallbackCode === 0) {
            resolve(fallbackOutput || '✅ Analysis completed successfully');
          } else {
            reject(new Error(`Python execution failed:\n${errorOutput}\n${fallbackError}\n\nMake sure Python with pandas, matplotlib, and seaborn is installed.`));
          }
        });
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python: ${error.message}\n\nMake sure Python is installed and in your PATH.`));
    });
  });
} 