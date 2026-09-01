export interface PresetScenario {
  id: string;
  name: string;
  projectType: string;
  project: string;
  context: string;
  tasks: string[];
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "web-app-mvp",
    name: "SaaS Product Launch",
    projectType: "Startup",
    project: "Anti-ToDo Launch",
    context: "Building an MVP SaaS app for product launch next week. Authentication and API integration are currently unfinished.",
    tasks: [
      "Fix authentication flow",
      "Finish API integration",
      "Deploy production database",
      "Change primary button bounce animation",
      "Rewrite full documentation README",
      "Rename internal database variable conventions",
      "Update landing page header copy",
      "Add custom loading skeleton spinners",
      "Refactor CSS theme color variables",
      "Set up error monitoring alert webhooks"
    ]
  },
  {
    id: "college-capstone",
    name: "College Capstone Project",
    projectType: "College project",
    project: "AI Study Companion",
    context: "Senior year Computer Science thesis project due in 10 days. Core machine learning inference loop needs to run.",
    tasks: [
      "Implement model evaluation pipeline",
      "Fix dataset data loader memory leak",
      "Write 30-page background research section",
      "Design logo and color palette for presentation deck",
      "Set up docker container for cloud deployment",
      "Create interactive UI micro-animations",
      "Clean up Git commit history log",
      "Benchmark model accuracy against baseline"
    ]
  },
  {
    id: "freelance-client",
    name: "Client Website Redesign",
    projectType: "Freelance",
    project: "E-Commerce Storefront",
    context: "Freelance client wants to accept payments before Black Friday sale. Checkout funnel is currently breaking.",
    tasks: [
      "Fix payment gateway webhook integration",
      "Test mobile checkout flow",
      "Add 3D product view model interactions",
      "Write custom blog post CMS engine from scratch",
      "Set up SSL certificate and custom domain DNS",
      "Animate navigation menu toggle drawer",
      "Add customer testimonial slider carousel",
      "Fix broken cart state total calculation"
    ]
  }
];
