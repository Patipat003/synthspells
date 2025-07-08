import HomePage from "@/app/page";

type Props = {
  params: Promise<{ prompt: string }>;
};

export default async function PromptPage({ params }: Props) {
  const unwrappedParams = await params;

  const promptFromPath = decodeURIComponent(unwrappedParams.prompt).replace(
    /-/g,
    " "
  );

  return <HomePage defaultPrompt={promptFromPath} />;
}
