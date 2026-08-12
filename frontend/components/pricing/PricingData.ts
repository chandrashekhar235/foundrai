export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular: boolean;
  buttonText: string;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Free",
    description: "Perfect for students and aspiring founders.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    buttonText: "Start Free",
    features: [
      "5 AI Startup Analyses",
      "Basic Market Research",
      "Competitor Overview",
      "Community Support",
      "1 Project",
    ],
  },

  {
    id: 2,
    name: "Pro",
    description: "Everything you need to build and launch.",
    monthlyPrice: 999,
    yearlyPrice: 799,
    popular: true,
    buttonText: "Get Pro",
    features: [
      "Unlimited Projects",
      "Unlimited AI Analysis",
      "Market Research",
      "Competitor Analysis",
      "Customer Personas",
      "Business Model",
      "Financial Forecast",
      "Pitch Deck Generator",
      "Go-To-Market Strategy",
      "Priority Support",
    ],
  },

  {
    id: 3,
    name: "Enterprise",
    description: "For incubators, startups and teams.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    buttonText: "Contact Sales",
    features: [
      "Everything in Pro",
      "Unlimited Team Members",
      "Workspace Collaboration",
      "Dedicated AI Models",
      "API Access",
      "White Label",
      "Dedicated Support",
    ],
  },
];