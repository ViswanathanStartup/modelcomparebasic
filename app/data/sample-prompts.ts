export interface SamplePrompt {
  title: string;
  description: string;
  prompt: string;
  sampleOutput?: string;
  tags: string[];
}

export const getSamplePrompts = (modelTags: string[]): SamplePrompt[] => {
  const allPrompts: SamplePrompt[] = [
    {
      title: "Creative Writing",
      description: "Generate a short story opening",
      prompt: "Write an engaging opening paragraph for a science fiction story about a time traveler who discovers an unexpected consequence of changing the past.",
      sampleOutput: "The moment Sarah stepped back into 2024, she knew something was terribly wrong. The air felt thicker, almost syrupy, and the familiar hum of the city had been replaced by an otherworldly silence. What had seemed like a minor change—preventing a coffee spill that ruined her grandmother's wedding dress in 1985—had somehow altered the fundamental fabric of reality.",
      tags: ["Creative", "General Purpose"]
    },
    {
      title: "Code Generation",
      description: "Create a React component",
      prompt: "Create a React component for a customizable button that supports different sizes, variants (primary, secondary, outline), and includes proper TypeScript types.",
      sampleOutput: "interface ButtonProps {\n  size?: 'sm' | 'md' | 'lg';\n  variant?: 'primary' | 'secondary' | 'outline';\n  children: React.ReactNode;\n  onClick?: () => void;\n}\n\nexport const Button = ({...}) => {...}",
      tags: ["Code", "Technical"]
    },
    {
      title: "Data Analysis",
      description: "Analyze a dataset",
      prompt: "Given a CSV with customer purchase data, write Python code to identify the top 5 products by revenue and create a visualization using seaborn.",
      tags: ["Analysis", "Technical", "Data Science"]
    },
    {
      title: "Research Summary",
      description: "Summarize academic content",
      prompt: "Summarize the key findings and methodology of this research paper on climate change impacts, highlighting the most significant conclusions and any limitations.",
      tags: ["Research", "Analysis", "Long Context"]
    },
    {
      title: "Multilingual Translation",
      description: "Complex translation task",
      prompt: "Translate this technical documentation about cloud computing from English to Mandarin, maintaining accurate technical terminology and natural language flow.",
      tags: ["Multilingual", "Technical"]
    },
    {
      title: "Visual Analysis",
      description: "Image understanding",
      prompt: "Analyze this satellite image of an urban area and identify key infrastructure elements, development patterns, and potential areas of environmental concern.",
      tags: ["Vision", "Analysis", "Multimodal"]
    },
    {
      title: "Mathematical Problem",
      description: "Complex problem solving",
      prompt: "Solve this differential equation step by step, explaining each step and providing the reasoning: dy/dx = x^2 * y + sin(x), y(0) = 1",
      tags: ["Technical", "Mathematics", "Step-by-Step"]
    },
    {
      title: "RAG Application",
      description: "Knowledge base query",
      prompt: "Based on the provided technical documentation about our product's API, explain how to implement user authentication using OAuth 2.0 with specific code examples.",
      tags: ["RAG", "Technical", "Code"]
    }
  ];

  // Filter prompts based on model tags
  return allPrompts.filter(prompt => 
    prompt.tags.some(tag => modelTags.includes(tag))
  );
};