
import { notFound } from 'next/navigation';
import { llmModels } from '../data/llm-data';
import type { LLMModel } from '../data/llm-data';
import { ModelDetailsCard } from '../components/ModelDetailsCard';

export default async function ModelPage(props: { params: Promise<{ modelId: string }> }) {
  const params = await props.params;

  // Find the model by id from our local data store
  const model = llmModels.find((m) => m.id === params.modelId);

  // If not found, show Next.js 404
  if (!model) {
    notFound();
  }

  // ModelDetailsCard is a client component; pass the model object
  return (
    <div className="container mx-auto px-4 py-8">
      <ModelDetailsCard model={model as LLMModel} />
    </div>
  );
}
