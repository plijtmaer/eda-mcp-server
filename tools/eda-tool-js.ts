import { z } from "zod";
// @ts-ignore
import * as Papa from "papaparse";
// @ts-ignore  
import * as ss from "simple-statistics";

export const edaToolJS = {
  name: "exploratory-data-analysis-js",
  description: "Perform exploratory data analysis on CSV or TXT files using JavaScript/TypeScript",
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
    custom_code: z.string().optional().describe("Custom JavaScript code for analysis (only used with custom_analysis type)"),
    columns: z.array(z.string()).optional().describe("Specific columns to analyze (optional)")
  },
  handler: async (params: {
    file_path: string;
    analysis_type: "basic_info" | "statistical_summary" | "correlation_analysis" | "distribution_plots" | "missing_data_analysis" | "custom_analysis";
    custom_code?: string;
    columns?: string[];
  }) => {
    try {
      const { file_path, analysis_type, custom_code, columns } = params;
      
      // Load data
      const csvData = await loadCSVData(file_path);
      if (!csvData) {
        return {
          content: [{
            type: "text" as const,
            text: `❌ Error loading data from: ${file_path}`
          }]
        };
      }

      let data = csvData;
      
      // Filter columns if specified
      if (columns && columns.length > 0) {
        data = data.map(row => {
          const filteredRow: any = {};
          columns.forEach((col: string) => {
            if (col in row) filteredRow[col] = row[col];
          });
          return filteredRow;
        });
      }

      // Perform analysis
      let result: string;
      switch (analysis_type) {
        case "basic_info":
          result = performBasicInfo(data);
          break;
        case "statistical_summary":
          result = performStatisticalSummary(data);
          break;
        case "correlation_analysis":
          result = performCorrelationAnalysis(data);
          break;
        case "distribution_plots":
          result = performDistributionAnalysis(data);
          break;
        case "missing_data_analysis":
          result = performMissingDataAnalysis(data);
          break;
        case "custom_analysis":
          result = performCustomAnalysis(data, custom_code);
          break;
        default:
          result = "❌ Unknown analysis type";
      }

      return {
        content: [{
          type: "text" as const,
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }
};

async function loadCSVData(filePath: string): Promise<any[] | null> {
  try {
    let csvText: string;
    
    if (filePath.startsWith('http')) {
      // Load from URL
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      csvText = await response.text();
    } else {
      // Load from file system
      const fs = await import('fs');
      const path = await import('path');
      
      let fullPath = filePath;
      if (!path.isAbsolute(filePath)) {
        fullPath = path.resolve(process.cwd(), filePath);
      }
      
      csvText = fs.readFileSync(fullPath, 'utf-8');
    }

    // Parse CSV
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header: string) => header.trim()
    });

    if (parsed.errors.length > 0) {
      console.warn('CSV parsing warnings:', parsed.errors);
    }

    return parsed.data as any[];
  } catch (error) {
    console.error('Error loading CSV:', error);
    return null;
  }
}

function performBasicInfo(data: any[]): string {
  if (data.length === 0) return "❌ No data found";

  const columns = Object.keys(data[0]);
  const rowCount = data.length;
  const colCount = columns.length;

  // Analyze column types
  const columnTypes: Record<string, string> = {};
  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
    if (values.length === 0) {
      columnTypes[col] = 'empty';
    } else if (values.every(val => typeof val === 'number' && !isNaN(val))) {
      columnTypes[col] = 'number';
    } else if (values.every(val => typeof val === 'boolean')) {
      columnTypes[col] = 'boolean';
    } else {
      columnTypes[col] = 'string';
    }
  });

  // Calculate memory usage estimate
  const memoryKB = (JSON.stringify(data).length / 1024).toFixed(2);

  // Get first 5 rows
  const firstRows = data.slice(0, 5);
  const tableHeader = columns.join('\t');
  const tableRows = firstRows.map(row => 
    columns.map(col => row[col] ?? '').join('\t')
  ).join('\n');

  return `📊 Data loaded successfully: ${rowCount} rows × ${colCount} columns

📋 BASIC INFORMATION
==================================================
Shape: (${rowCount}, ${colCount})

Column names and types:
${columns.map(col => `  • ${col}: ${columnTypes[col]}`).join('\n')}

Memory usage: ${memoryKB} KB

First 5 rows:
${tableHeader}
${tableRows}`;
}

function performStatisticalSummary(data: any[]): string {
  if (data.length === 0) return "❌ No data found";

  const columns = Object.keys(data[0]);
  let result = "\n📈 STATISTICAL SUMMARY\n" + "=".repeat(50);

  // Numerical columns
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
    return values.length > 0;
  });

  if (numericCols.length > 0) {
    result += "\n\nNumerical columns summary:\n";
    result += "Column\t\tCount\tMean\t\tStd\t\tMin\t\tMax\t\t25%\t\t50%\t\t75%\n";
    
    numericCols.forEach(col => {
      const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
      if (values.length > 0) {
        const count = values.length;
        const mean = ss.mean(values);
        const std = ss.standardDeviation(values);
        const min = ss.min(values);
        const max = ss.max(values);
        const q25 = ss.quantile(values, 0.25);
        const median = ss.median(values);
        const q75 = ss.quantile(values, 0.75);
        
        result += `${col}\t\t${count}\t${mean.toFixed(3)}\t\t${std.toFixed(3)}\t\t${min.toFixed(3)}\t\t${max.toFixed(3)}\t\t${q25.toFixed(3)}\t\t${median.toFixed(3)}\t\t${q75.toFixed(3)}\n`;
      }
    });
  }

  // Categorical columns
  const categoricalCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'string' || (val !== null && val !== undefined));
    return values.length > 0 && !numericCols.includes(col);
  });

  if (categoricalCols.length > 0) {
    result += "\nCategorical columns summary:\n";
    
    categoricalCols.forEach(col => {
      const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueCount = new Set(values).size;
      const valueCounts = values.reduce((acc: Record<string, number>, val) => {
        const key = String(val);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      
      const topValues = Object.entries(valueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
      
      result += `\n${col}:\n`;
      result += `  Unique values: ${uniqueCount}\n`;
      result += `  Most common: ${JSON.stringify(topValues)}\n`;
    });
  }

  return result;
}

function performCorrelationAnalysis(data: any[]): string {
  if (data.length === 0) return "❌ No data found";

  const columns = Object.keys(data[0]);
  
  // Get numeric columns
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
    return values.length > 0;
  });

  if (numericCols.length < 2) {
    return "\n🔗 CORRELATION ANALYSIS\n" + "=".repeat(50) + "\n❌ Need at least 2 numerical columns for correlation analysis";
  }

  let result = "\n🔗 CORRELATION ANALYSIS\n" + "=".repeat(50);

  try {
    // Create correlation matrix using simple-statistics
    const correlationMatrix: number[][] = [];
    
    for (let i = 0; i < numericCols.length; i++) {
      correlationMatrix[i] = [];
      const col1Values = data.map(row => row[numericCols[i]]).filter(val => typeof val === 'number' && !isNaN(val));
      
      for (let j = 0; j < numericCols.length; j++) {
        if (i === j) {
          correlationMatrix[i][j] = 1.0;
        } else {
          const col2Values = data.map(row => row[numericCols[j]]).filter(val => typeof val === 'number' && !isNaN(val));
          
          // Filter to common indices
          const pairedValues: [number, number][] = [];
          data.forEach(row => {
            const val1 = row[numericCols[i]];
            const val2 = row[numericCols[j]];
            if (typeof val1 === 'number' && !isNaN(val1) && typeof val2 === 'number' && !isNaN(val2)) {
              pairedValues.push([val1, val2]);
            }
          });
          
          if (pairedValues.length > 1) {
            const x = pairedValues.map(p => p[0]);
            const y = pairedValues.map(p => p[1]);
            correlationMatrix[i][j] = ss.sampleCorrelation(x, y);
          } else {
            correlationMatrix[i][j] = 0;
          }
        }
      }
    }
    
    result += "\n\nCorrelation Matrix:\n";
    result += "Column\t\t" + numericCols.join('\t\t') + "\n";
    
    for (let i = 0; i < numericCols.length; i++) {
      let row = numericCols[i] + "\t\t";
      for (let j = 0; j < numericCols.length; j++) {
        row += correlationMatrix[i][j].toFixed(3) + "\t\t";
      }
      result += row + "\n";
    }

    // Find high correlations
    const highCorr: string[] = [];
    for (let i = 0; i < numericCols.length; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const corr = correlationMatrix[i][j];
        if (Math.abs(corr) > 0.7) {
          highCorr.push(`${numericCols[i]} ↔ ${numericCols[j]}: ${corr.toFixed(3)}`);
        }
      }
    }

    if (highCorr.length > 0) {
      result += "\n🔍 High correlations (|r| > 0.7):\n";
      highCorr.forEach(corr => result += `  • ${corr}\n`);
    } else {
      result += "\n✅ No high correlations found (|r| > 0.7)\n";
    }

  } catch (error) {
    result += "\n❌ Error calculating correlations: " + String(error);
  }

  return result;
}

function performDistributionAnalysis(data: any[]): string {
  if (data.length === 0) return "❌ No data found";

  const columns = Object.keys(data[0]);
  
  // Get numeric columns
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
    return values.length > 0;
  });

  let result = "\n📊 DISTRIBUTION ANALYSIS\n" + "=".repeat(50);

  numericCols.forEach(col => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
    
    if (values.length > 0) {
      const mean = ss.mean(values);
      const median = ss.median(values);
      const std = ss.standardDeviation(values);
      const skewness = ss.sampleSkewness(values);
      const min = ss.min(values);
      const max = ss.max(values);
      
      // Calculate outliers using IQR method
      const q1 = ss.quantile(values, 0.25);
      const q3 = ss.quantile(values, 0.75);
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      const outliers = values.filter(val => val < lowerBound || val > upperBound);
      
      result += `\n\n${col}:\n`;
      result += `  Mean: ${mean.toFixed(3)}\n`;
      result += `  Median: ${median.toFixed(3)}\n`;
      result += `  Std: ${std.toFixed(3)}\n`;
      result += `  Skewness: ${skewness.toFixed(3)}\n`;
      result += `  Range: ${min.toFixed(3)} to ${max.toFixed(3)}\n`;
      result += `  Outliers (IQR method): ${outliers.length} (${(outliers.length/values.length*100).toFixed(1)}%)\n`;
    }
  });

  return result;
}

function performMissingDataAnalysis(data: any[]): string {
  if (data.length === 0) return "❌ No data found";

  const columns = Object.keys(data[0]);
  const totalRows = data.length;

  let result = "\n❓ MISSING DATA ANALYSIS\n" + "=".repeat(50);
  result += "\n\nMissing values by column:\n";

  let hasMissing = false;
  columns.forEach(col => {
    const missingCount = data.filter(row => 
      row[col] === null || row[col] === undefined || row[col] === '' || 
      (typeof row[col] === 'number' && isNaN(row[col]))
    ).length;
    
    const missingPercent = (missingCount / totalRows * 100).toFixed(1);
    
    if (missingCount > 0) {
      hasMissing = true;
      result += `  • ${col}: ${missingCount} (${missingPercent}%)\n`;
    }
  });

  if (!hasMissing) {
    result += "  ✅ No missing values found in any column\n";
  }

  return result;
}

function performCustomAnalysis(data: any[], customCode?: string): string {
  if (!customCode) {
    return "❌ No custom code provided for analysis";
  }

  try {
    // Basic security: only allow certain safe operations
    if (customCode.includes('eval') || customCode.includes('Function') || customCode.includes('require') || customCode.includes('import')) {
      return "❌ Custom code contains restricted operations";
    }

    let result = "\n🔧 CUSTOM ANALYSIS\n" + "=".repeat(50) + "\n";
    
    // Create a safe execution context
    const context = {
      data,
      columns: Object.keys(data[0] || {}),
      rowCount: data.length,
      console: { log: (msg: any) => result += `${msg}\n` },
      Math,
      ss, // simple-statistics functions
      JSON
    };

    // Execute the custom code
    const func = new Function(...Object.keys(context), customCode);
    func(...Object.values(context));

    return result;
  } catch (error) {
    return `❌ Error in custom analysis: ${error instanceof Error ? error.message : String(error)}`;
  }
} 