import { notFound } from 'next/navigation';
import { getUseCaseById } from '@/lib/use-cases';
import Wizard from '@/components/wizard/Wizard';

export default async function UseCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const useCase = getUseCaseById(id);
  
  if (!useCase) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <Wizard useCase={useCase} />
      </div>
    </div>
  );
}
