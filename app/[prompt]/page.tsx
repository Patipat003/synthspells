import HomePage from "@/app/HomePage";

type Props = {
  params: { prompt: string };
};

export default function PromptPage({ params }: Props) {
  const promptFromPath = decodeURIComponent(params.prompt).replace(/-/g, " ");
  return <HomePage defaultPrompt={promptFromPath} />;
}
