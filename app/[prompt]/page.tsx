import { use } from "react";
import HomePage from "@/app/HomePage";

interface Props {
  params: Promise<{ prompt: string }>;
}

export default function PromptPage({ params }: Props) {
  const resolvedParams = use(params);
  const promptFromPath = decodeURIComponent(resolvedParams.prompt).replace(
    /-/g,
    " "
  );

  return <HomePage defaultPrompt={promptFromPath} />;
}
