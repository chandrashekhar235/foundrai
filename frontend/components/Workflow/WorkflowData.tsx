export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  duration: string;
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Startup Idea",
    description:
      "Describe your startup idea in plain English. FoundrAI understands your business before beginning the analysis.",
    duration: "15 sec",
  },
  {
    id: 2,
    title: "Market Research",
    description:
      "Analyze industry trends, market size, growth opportunities and demand using AI-powered research.",
    duration: "30 sec",
  },
  {
    id: 3,
    title: "Competitor Analysis",
    description:
      "Identify direct and indirect competitors, compare products, pricing and discover market gaps.",
    duration: "25 sec",
  },
  {
    id: 4,
    title: "Customer Pain Points",
    description:
      "Discover the real problems customers face and validate whether your solution solves them.",
    duration: "20 sec",
  },
  {
    id: 5,
    title: "Customer Persona",
    description:
      "Generate detailed customer personas including demographics, behaviour and buying intent.",
    duration: "20 sec",
  },
  {
    id: 6,
    title: "Business Model",
    description:
      "Create revenue streams, pricing strategy and monetization opportunities tailored to your startup.",
    duration: "20 sec",
  },
  {
    id: 7,
    title: "MVP Roadmap",
    description:
      "Generate a step-by-step roadmap to build your MVP with prioritized milestones.",
    duration: "25 sec",
  },
  {
    id: 8,
    title: "Go-To-Market Strategy",
    description:
      "Plan marketing channels, positioning and customer acquisition strategy.",
    duration: "30 sec",
  },
  {
    id: 9,
    title: "Investor Readiness",
    description:
      "Prepare validation, business insights and investor-ready documentation.",
    duration: "20 sec",
  },
  {
    id: 10,
    title: "Launch",
    description:
      "Everything is combined into one actionable startup blueprint ready for execution.",
    duration: "Ready",
  },
];