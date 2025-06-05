const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

class CodeAnalysisService {
  constructor() {
    // Common DSA patterns to look for
    this.dsaPatterns = {
      "two-pointer": {
        keywords: ["left", "right", "pointer", "start", "end"],
        description: "Two-pointer technique for array/string problems",
      },
      "sliding-window": {
        keywords: ["window", "start", "end", "sum", "max", "min"],
        description: "Sliding window technique for subarray/substring problems",
      },
      "binary-search": {
        keywords: ["mid", "left", "right", "binary", "search"],
        description: "Binary search pattern for sorted array problems",
      },
      "dynamic-programming": {
        keywords: ["dp", "memo", "cache", "recurrence", "subproblem"],
        description: "Dynamic programming approach for optimization problems",
      },
      bfs: {
        keywords: ["queue", "level", "breadth", "bfs", "neighbor"],
        description: "Breadth-first search for graph/tree traversal",
      },
      dfs: {
        keywords: ["stack", "recursive", "dfs", "depth", "backtrack"],
        description: "Depth-first search for graph/tree traversal",
      },
    };
  }

  // Analyze code complexity and structure
  async analyzeCodeComplexity(code, language) {
    try {
      const metrics = {
        timeComplexity: this.estimateTimeComplexity(code),
        spaceComplexity: this.estimateSpaceComplexity(code),
        cyclomaticComplexity: this.calculateCyclomaticComplexity(code),
        codeQuality: await this.analyzeCodeQuality(code, language),
      };

      return metrics;
    } catch (error) {
      console.error("Code complexity analysis error:", error);
      throw new Error("Failed to analyze code complexity");
    }
  }

  // Estimate time complexity based on code structure
  estimateTimeComplexity(code) {
    const complexity = {
      level: "O(1)",
      explanation: "Constant time complexity",
    };

    // Look for nested loops
    const nestedLoops = (
      code.match(/for\s*\(.*\)\s*{[\s\S]*?for\s*\(.*\)/g) || []
    ).length;
    if (nestedLoops > 0) {
      complexity.level = `O(n^${nestedLoops + 1})`;
      complexity.explanation = `${nestedLoops + 1} nested loops detected`;
    }
    // Look for single loops
    else if (code.match(/for\s*\(.*\)|while\s*\(.*\)/g)) {
      complexity.level = "O(n)";
      complexity.explanation = "Linear time complexity with single loop";
    }

    // Check for binary search
    if (
      code.includes("mid") &&
      code.includes("left") &&
      code.includes("right")
    ) {
      complexity.level = "O(log n)";
      complexity.explanation =
        "Logarithmic time complexity (likely binary search)";
    }

    return complexity;
  }

  // Estimate space complexity
  estimateSpaceComplexity(code) {
    const complexity = {
      level: "O(1)",
      explanation: "Constant space complexity",
    };

    // Look for array/list creation
    const arrayCreations = (
      code.match(/new\s+Array|\[\]|ArrayList|vector/g) || []
    ).length;
    if (arrayCreations > 0) {
      complexity.level = "O(n)";
      complexity.explanation =
        "Linear space complexity due to array/list usage";
    }

    // Check for recursive calls
    if (code.match(/function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?\1\s*\(/)) {
      complexity.level = "O(n)";
      complexity.explanation = "Linear space complexity due to recursion";
    }

    return complexity;
  }

  // Calculate cyclomatic complexity
  calculateCyclomaticComplexity(code) {
    let complexity = 1; // Base complexity

    // Count control structures
    const controlStructures = [
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "catch",
      "&&",
      "||",
      "?",
      "??",
    ];

    controlStructures.forEach((structure) => {
      const regex = new RegExp(`\\b${structure}\\b`, "g");
      const matches = (code.match(regex) || []).length;
      complexity += matches;
    });

    return {
      value: complexity,
      level: complexity <= 5 ? "low" : complexity <= 10 ? "medium" : "high",
      explanation: this.getComplexityExplanation(complexity),
    };
  }

  // Get explanation for cyclomatic complexity level
  getComplexityExplanation(complexity) {
    if (complexity <= 5) {
      return "Code is simple and easy to maintain";
    } else if (complexity <= 10) {
      return "Code has moderate complexity, consider refactoring some parts";
    } else {
      return "Code is complex, consider breaking it into smaller functions";
    }
  }

  // Analyze code quality using external tools
  async analyzeCodeQuality(code, language) {
    try {
      // This is a placeholder for actual code quality analysis
      // In a real implementation, you would:
      // 1. Use language-specific linters (eslint, pylint, etc.)
      // 2. Run static code analysis tools
      // 3. Check for code smells and best practices

      return {
        score: 0.8, // Placeholder score
        suggestions: [
          "Consider adding more comments",
          "Break down complex functions",
          "Use more descriptive variable names",
        ],
      };
    } catch (error) {
      console.error("Code quality analysis error:", error);
      throw new Error("Failed to analyze code quality");
    }
  }

  // Detect DSA patterns in the code
  detectDSAPatterns(code) {
    const detectedPatterns = [];

    for (const [pattern, info] of Object.entries(this.dsaPatterns)) {
      const patternScore = this.calculatePatternScore(code, info.keywords);
      if (patternScore > 0.5) {
        // Threshold for pattern detection
        detectedPatterns.push({
          pattern,
          score: patternScore,
          description: info.description,
        });
      }
    }

    return detectedPatterns;
  }

  // Calculate how likely a pattern is present in the code
  calculatePatternScore(code, keywords) {
    let score = 0;
    const totalKeywords = keywords.length;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = (code.match(regex) || []).length;
      score += matches > 0 ? 1 : 0;
    });

    return score / totalKeywords;
  }

  // Generate comprehensive code analysis report
  async generateAnalysisReport(code, language) {
    try {
      const [complexityMetrics, dsaPatterns] = await Promise.all([
        this.analyzeCodeComplexity(code, language),
        this.detectDSAPatterns(code),
      ]);

      return {
        complexity: complexityMetrics,
        patterns: dsaPatterns,
        suggestions: this.generateSuggestions(complexityMetrics, dsaPatterns),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Analysis report generation error:", error);
      throw new Error("Failed to generate analysis report");
    }
  }

  // Generate improvement suggestions based on analysis
  generateSuggestions(complexityMetrics, dsaPatterns) {
    const suggestions = [];

    // Complexity-based suggestions
    if (complexityMetrics.cyclomaticComplexity.level === "high") {
      suggestions.push(
        "Consider breaking down complex functions into smaller, more manageable pieces"
      );
    }

    if (complexityMetrics.timeComplexity.level.startsWith("O(n^")) {
      suggestions.push(
        "Look for opportunities to optimize the algorithm to reduce time complexity"
      );
    }

    // Pattern-based suggestions
    if (dsaPatterns.length === 0) {
      suggestions.push(
        "Consider using standard DSA patterns to solve this problem more efficiently"
      );
    }

    return suggestions;
  }

  // Compare user solution with optimal solution
  async compareWithOptimal(userCode, optimalCode, language) {
    try {
      const [userAnalysis, optimalAnalysis] = await Promise.all([
        this.generateAnalysisReport(userCode, language),
        this.generateAnalysisReport(optimalCode, language),
      ]);

      return {
        comparison: {
          timeComplexity: {
            user: userAnalysis.complexity.timeComplexity,
            optimal: optimalAnalysis.complexity.timeComplexity,
            difference: this.compareComplexityLevels(
              userAnalysis.complexity.timeComplexity.level,
              optimalAnalysis.complexity.timeComplexity.level
            ),
          },
          spaceComplexity: {
            user: userAnalysis.complexity.spaceComplexity,
            optimal: optimalAnalysis.complexity.spaceComplexity,
            difference: this.compareComplexityLevels(
              userAnalysis.complexity.spaceComplexity.level,
              optimalAnalysis.complexity.spaceComplexity.level
            ),
          },
        },
        suggestions: this.generateOptimizationSuggestions(
          userAnalysis,
          optimalAnalysis
        ),
      };
    } catch (error) {
      console.error("Solution comparison error:", error);
      throw new Error("Failed to compare solutions");
    }
  }

  // Compare complexity levels and return difference
  compareComplexityLevels(userLevel, optimalLevel) {
    const complexityOrder = [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(n^2)",
      "O(2^n)",
    ];
    const userIndex = complexityOrder.indexOf(userLevel);
    const optimalIndex = complexityOrder.indexOf(optimalLevel);

    if (userIndex === -1 || optimalIndex === -1) return "unknown";

    if (userIndex === optimalIndex) return "same";
    if (userIndex > optimalIndex) return "worse";
    return "better";
  }

  // Generate optimization suggestions
  generateOptimizationSuggestions(userAnalysis, optimalAnalysis) {
    const suggestions = [];

    if (
      userAnalysis.complexity.timeComplexity.level !==
      optimalAnalysis.complexity.timeComplexity.level
    ) {
      suggestions.push(
        `Consider optimizing time complexity from ${userAnalysis.complexity.timeComplexity.level} to ${optimalAnalysis.complexity.timeComplexity.level}`
      );
    }

    if (
      userAnalysis.complexity.spaceComplexity.level !==
      optimalAnalysis.complexity.spaceComplexity.level
    ) {
      suggestions.push(
        `Consider optimizing space complexity from ${userAnalysis.complexity.spaceComplexity.level} to ${optimalAnalysis.complexity.spaceComplexity.level}`
      );
    }

    return suggestions;
  }
}

module.exports = new CodeAnalysisService();
