// src/services/agentService.js
const dotenv = require("dotenv");

dotenv.config();
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AgentService {
  constructor() {
    this.mentorContext = {
      skillLevel: "beginner",
      currentProblem: null,
      conversationHistory: [],
    };
  }

  // Mentor Agent Methods
  async generateMentorResponse(userInput, context) {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an expert DSA mentor with the following characteristics:
            - Skill Level: ${context.skillLevel}
            - Teaching Style: Adaptive to user's level
            - Focus: Problem-solving, algorithm design, code optimization
            - Communication: Clear, encouraging, and helpful`,
        },
        ...context.conversationHistory,
        { role: "user", content: userInput },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in mentor response:", error);
      throw new Error("Failed to generate mentor response");
    }
  }

  // Code Analysis Methods
  async analyzeCode(code, language) {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an expert code reviewer. Analyze the following ${language} code for:
            - Correctness
            - Time complexity
            - Space complexity
            - Potential improvements
            - Edge cases`,
        },
        { role: "user", content: code },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.3,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in code analysis:", error);
      throw new Error("Failed to analyze code");
    }
  }
}

module.exports = new AgentService();
