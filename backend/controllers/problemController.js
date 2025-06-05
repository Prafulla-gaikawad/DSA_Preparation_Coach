// src/controllers/problemController.js
const codeAnalysisService = require("../services/codeAnalysisService");
const Problem = require("../models/Problem");

class ProblemController {
  // Create a new problem
  async createProblem(req, res) {
    try {
      const problem = new Problem(req.body);
      await problem.save();
      res.status(201).json(problem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all problems
  async getProblems(req, res) {
    try {
      const problems = await Problem.find();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get a single problem
  async getProblem(req, res) {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProblem(req, res) {
    try {
      const problem = await Problem.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      res.json({
        message: "Problem updated successfully",
        problem,
      });
    } catch (error) {
      console.error("Update problem error:", error);
      res.status(500).json({
        message: "Error updating problem",
        error: error.message,
      });
    }
  }

  // Delete a problem (admin only)
  async deleteProblem(req, res) {
    try {
      const problem = await Problem.findByIdAndDelete(req.params.id);

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      res.json({ message: "Problem deleted successfully" });
    } catch (error) {
      console.error("Delete problem error:", error);
      res.status(500).json({
        message: "Error deleting problem",
        error: error.message,
      });
    }
  }
  // Helper method to run test cases
  async runTestCases(code, testCases, language) {
    // TODO: Implement actual test case execution
    // This would involve:
    // 1. Creating a secure environment
    // 2. Compiling/running the code
    // 3. Executing test cases
    // 4. Comparing outputs

    // Placeholder implementation
    return {
      allPassed: true,
      results: testCases.map((testCase) => ({
        input: testCase.input,
        expected: testCase.output,
        actual: "Test execution not implemented",
        passed: true,
      })),
    };
  }
  // Submit solution for a problem
  async submitSolution(req, res) {
    try {
      const { code, language } = req.body;
      const problem = await Problem.findById(req.params.id);

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      // Run test cases
      const testResults = await this.runTestCases(
        code,
        problem.testCases,
        language
      );

      // Get code analysis
      const analysis = await codeAnalysisService.generateAnalysisReport(
        code,
        language
      );

      // Compare with optimal solution if available
      let comparison = null;
      if (problem.solution) {
        comparison = await codeAnalysisService.compareWithOptimal(
          code,
          problem.solution,
          language
        );
      }

      // Update problem statistics
      problem.metadata.submissions += 1;
      if (testResults.allPassed) {
        problem.metadata.successfulSubmissions += 1;
      }
      await problem.updateAcceptanceRate();

      // Prepare response
      const response = {
        testResults,
        analysis: {
          complexity: analysis.complexity,
          patterns: analysis.patterns,
          suggestions: analysis.suggestions,
        },
        comparison,
        statistics: {
          submissions: problem.metadata.submissions,
          successfulSubmissions: problem.metadata.successfulSubmissions,
          acceptanceRate: problem.metadata.acceptanceRate,
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Submit solution error:", error);
      res.status(500).json({
        message: "Error submitting solution",
        error: error.message,
      });
    }
  }

  // Get problem analysis (for learning purposes)
  async getProblemAnalysis(req, res) {
    try {
      const problem = await Problem.findById(req.params.id);

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      // Get analysis of the optimal solution
      const analysis = await codeAnalysisService.generateAnalysisReport(
        problem.solution,
        "javascript" // or whatever language the solution is in
      );

      res.json({
        problem: {
          title: problem.title,
          difficulty: problem.difficulty,
          topics: problem.topics,
        },
        analysis: {
          complexity: analysis.complexity,
          patterns: analysis.patterns,
          explanation: this.generateProblemExplanation(analysis),
        },
      });
    } catch (error) {
      console.error("Get problem analysis error:", error);
      res.status(500).json({
        message: "Error analyzing problem",
        error: error.message,
      });
    }
  }

  // Helper method to generate problem explanation
  generateProblemExplanation(analysis) {
    const explanation = {
      approach: "",
      keyConcepts: [],
      optimizationTips: [],
    };

    // Add pattern-based explanation
    if (analysis.patterns.length > 0) {
      explanation.approach = `This problem can be solved using the ${analysis.patterns[0].pattern} pattern. `;
      explanation.keyConcepts.push(
        ...analysis.patterns.map((p) => p.description)
      );
    }

    // Add complexity-based explanation
    explanation.approach += `The optimal solution has a time complexity of ${analysis.complexity.timeComplexity.level} `;
    explanation.approach += `and space complexity of ${analysis.complexity.spaceComplexity.level}.`;

    // Add optimization tips
    if (analysis.suggestions.length > 0) {
      explanation.optimizationTips = analysis.suggestions;
    }

    return explanation;
  }

  // Add a discussion comment
  async addDiscussion(req, res) {
    try {
      const { content } = req.body;
      const problem = await Problem.findById(req.params.id);

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      problem.discussion.push({
        user: req.user.userId,
        content,
      });

      await problem.save();

      res.status(201).json({
        message: "Comment added successfully",
        comment: problem.discussion[problem.discussion.length - 1],
      });
    } catch (error) {
      console.error("Add discussion error:", error);
      res.status(500).json({
        message: "Error adding comment",
        error: error.message,
      });
    }
  }
}

// Export a singleton instance
module.exports = new ProblemController();
