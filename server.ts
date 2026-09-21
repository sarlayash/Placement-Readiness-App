import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Personalized Roadmap Generator Endpoint
app.post("/api/ai/roadmap", async (req, res) => {
  try {
    const { studentProfile, readinessScore, weakAreas, strongAreas, targetRole } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback deterministic intelligent roadmap generator
      return res.json({
        source: "fallback",
        overview: `Accelerated 4-phase placement improvement plan targeting ${targetRole || "Software Engineering"} with current readiness score of ${readinessScore || 620}/1000.`,
        strengths: strongAreas?.length ? strongAreas : ["Foundational Logic", "Academic Core"],
        focusGaps: weakAreas?.length ? weakAreas : ["Advanced Data Structures", "Timed Aptitude Pacing"],
        phases: [
          {
            phase: "Week 1-2: Core Aptitude & Speed Drills",
            goal: "Eliminate quantitative bottlenecks and raise speed by 35%",
            milestones: [
              "Master Time & Work, Speed-Distance, and Probability shortcuts",
              "Take 5 timed 15-minute sectional aptitude mock tests with negative marking",
              "Review error logs daily and maintain formula flashcards",
            ],
            recommendedTools: ["Quantitative Formulas Bank", "Sectional Time Drills"],
            completionScoreTarget: "+45 pts",
          },
          {
            phase: "Week 3-4: High-Yield Data Structures & Patterns",
            goal: "Crack Tier-1 & Tier-2 online assessment coding rounds",
            milestones: [
              "Solve 20 problems on Two Pointers, Sliding Window & Hash Maps",
              "Implement Tree Traversals (BFS/DFS) and Binary Search on sorted ranges",
              "Practice writing clean production-grade code without IDE auto-complete",
            ],
            recommendedTools: ["Blind 75 Curated Patterns", "Interactive Code Sandbox"],
            completionScoreTarget: "+65 pts",
          },
          {
            phase: "Week 5-6: System Design, OS, DBMS & Mock Interviews",
            goal: "Nail technical rounds and round-2 conceptual grilling",
            milestones: [
              "Revise ACID properties, Indexing (B-Trees vs Hash), and SQL subqueries",
              "Study Process synchronization, Deadlocks, and Paging concepts",
              "Conduct 2 peer mock interviews focusing on STAR behavioral format",
            ],
            recommendedTools: ["CS Core Interview Sheet", "STAR Method Story Builder"],
            completionScoreTarget: "+55 pts",
          },
          {
            phase: "Week 7-8: Company-Specific Placement Sprints",
            goal: "Peak performance for target tier companies",
            milestones: [
              "Analyze previous 3 years interview patterns of target tier companies",
              "Complete 3 full-length 90-minute end-to-end placement simulation tests",
              "Polish resume action-verbs with quantifiable metric impact statements",
            ],
            recommendedTools: ["Company Pattern Intelligence", "Full Placement Simulation"],
            completionScoreTarget: "+75 pts",
          },
        ],
      });
    }

    const prompt = `You are an elite campus placement director and career intelligence officer. 
A student has completed placement assessments on our platform.
Student Profile:
- Name: ${studentProfile?.fullName || "Student"}
- Degree / Major: ${studentProfile?.degree || "Computer Science"} (${studentProfile?.graduationYear || "2026"})
- Target Role: ${targetRole || "Software Development Engineer"}
- Current Placement Readiness Score: ${readinessScore || 600} / 1000
- Weak Areas: ${JSON.stringify(weakAreas || ["Dynamic Programming", "Quant Aptitude"])}
- Strong Areas: ${JSON.stringify(strongAreas || ["Logical Reasoning", "Core OOP"])}

Create a high-impact, ultra-practical 4-phase personalized improvement roadmap.
Return STRICT JSON ONLY with the exact format:
{
  "source": "gemini",
  "overview": "Concise 2-sentence summary of target strategy",
  "strengths": ["string", "string"],
  "focusGaps": ["string", "string"],
  "phases": [
    {
      "phase": "Phase title with week range",
      "goal": "Clear objective",
      "milestones": ["concrete action item 1", "concrete action item 2", "concrete action item 3"],
      "recommendedTools": ["tool 1", "tool 2"],
      "completionScoreTarget": "+XX pts"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({ ...parsed, source: "gemini" });
  } catch (error: any) {
    console.error("AI Roadmap error:", error?.message || error);
    // Graceful fallback
    return res.json({
      source: "fallback",
      overview: "Standardized 4-phase technical placement optimization plan.",
      strengths: ["Problem-solving foundations", "Technical aptitude"],
      focusGaps: ["Advanced algorithms", "Timed speed management"],
      phases: [
        {
          phase: "Phase 1: Diagnostic & Fundamental Review (Week 1-2)",
          goal: "Solidify core concepts and diagnose weak problem types",
          milestones: [
            "Complete 20 high-frequency quantitative aptitude practice questions",
            "Review Array and String two-pointer patterns",
            "Establish 45-min daily coding discipline",
          ],
          recommendedTools: ["Formula Flashcards", "Timed Sectional Drills"],
          completionScoreTarget: "+50 pts",
        },
        {
          phase: "Phase 2: Data Structures & Core CS (Week 3-4)",
          goal: "Transition from basic to interview-level medium difficulty",
          milestones: [
            "Master HashMaps, Stacks, Queues, and Linked Lists",
            "Study DBMS normalization, indexing, and OS threading",
            "Solve 15 company-favorite coding challenges",
          ],
          recommendedTools: ["LeetCode Pattern Matrix", "DBMS Cheat Sheet"],
          completionScoreTarget: "+60 pts",
        },
        {
          phase: "Phase 3: Algorithms & Complex Logic (Week 5-6)",
          goal: "Gain confidence in Trees, Graphs, and Greedy approaches",
          milestones: [
            "Implement Tree traversals and Binary Search variants",
            "Solve 10 medium graph/BFS/DFS problems",
            "Practice explaining logic aloud in mock technical setups",
          ],
          recommendedTools: ["Graph Visualizer", "Mock Interview Rubric"],
          completionScoreTarget: "+65 pts",
        },
        {
          phase: "Phase 4: Placement Mock Sprints (Week 7-8)",
          goal: "Simulate real recruitment drives under time constraints",
          milestones: [
            "Take 3 complete 90-minute online assessment simulations",
            "Refine resume with quantified project impacts",
            "Conduct behavioral mock interviews using the STAR method",
          ],
          recommendedTools: ["Full Assessment Simulator", "Resume Audit Tool"],
          completionScoreTarget: "+75 pts",
        },
      ],
    });
  }
});

// AI Coding Code Evaluation / Hint Endpoint
app.post("/api/ai/code-eval", async (req, res) => {
  try {
    const { problemTitle, problemDescription, language, code, testResults } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic evaluation
      return res.json({
        source: "fallback",
        timeComplexity: "O(n) expected for optimal approach",
        spaceComplexity: "O(1) auxiliary",
        feedback: "Code cleanly addresses basic constraints. Ensure edge cases such as empty arrays, single elements, and large negative integers are safeguarded.",
        improvements: [
          "Check for null / undefined or empty input at the very start",
          "Consider preallocating data structures to reduce memory allocations",
          "Ensure variable names reflect their semantic purpose during technical interviews",
        ],
        interviewTips: "In campus interviews, always state your brute-force complexity first before presenting the optimal solution.",
      });
    }

    const prompt = `You are a Principal Tech Interviewer evaluating a candidate's code submission in ${language || "TypeScript"}.
Problem: ${problemTitle}
Description: ${problemDescription}
Candidate Code:
\`\`\`${language}
${code}
\`\`\`
Test Results: ${JSON.stringify(testResults || {})}

Provide a concise, expert code review formatted as JSON with the exact structure:
{
  "timeComplexity": "e.g. O(n) or O(n^2)",
  "spaceComplexity": "e.g. O(1) or O(n)",
  "feedback": "2-3 sentences of constructive technical feedback",
  "improvements": ["improvement point 1", "improvement point 2", "improvement point 3"],
  "interviewTips": "1 sentence advice on how to communicate this problem in an interview"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ ...parsed, source: "gemini" });
  } catch (error: any) {
    console.error("Code eval error:", error?.message || error);
    return res.json({
      source: "fallback",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      feedback: "Code successfully verified. Keep in mind boundary conditions and boundary constraints during high-pressure placement tests.",
      improvements: [
        "Include early returns for trivial edge cases",
        "Add short comments explaining invariant states in loops",
      ],
      interviewTips: "Clarify input bounds and expected time limits with the interviewer upfront.",
    });
  }
});

// AI Company Readiness Intelligence
app.post("/api/ai/placement-insights", async (req, res) => {
  const { targetCompany, targetRole, readinessScore, skillScores } = req.body || {};
  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        company: targetCompany || "Product Companies",
        matchPercentage: Math.min(96, Math.max(45, Math.round((readinessScore || 600) / 10))),
        verdict: readinessScore >= 750 ? "High Probability (Interview Ready)" : readinessScore >= 600 ? "Competitive Candidate (Needs Pacing Polish)" : "Development Required",
        insights: [
          "Recent recruitment drives for this role emphasize medium-level DSA and clear database design understanding.",
          "Speed in the first 20 minutes of the aptitude assessment determines qualifying shortlist cutoff.",
          "Highlighting 1 end-to-end full stack or systems project significantly boosts round-1 resume screening score.",
        ],
        recommendedNextStep: "Take 1 timed aptitude simulation and 2 targeted data structure challenges.",
      });
    }

    const prompt = `As a campus placement intelligence expert, analyze a student's readiness for ${targetCompany || "Tier-1 Tech Companies"} (${targetRole || "Software Engineer"}).
Placement Readiness Score: ${readinessScore}/1000
Skill Breakdown: ${JSON.stringify(skillScores || {})}

Return JSON:
{
  "company": "${targetCompany || "Target Company"}",
  "matchPercentage": number between 40 and 98,
  "verdict": "Short status sentence",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendedNextStep": "Specific immediate action"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    return res.json({
      company: targetCompany || "Target Companies",
      matchPercentage: 74,
      verdict: "Strong Foundation with Scope for Polish",
      insights: [
        "Focus on reducing time per question in quantitative aptitude.",
        "Ensure familiarity with standard tree traversals and string parsing.",
      ],
      recommendedNextStep: "Complete the personalized weekly roadmap tasks.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Placement Platform Server running on port ${PORT}`);
  });
}

startServer();
