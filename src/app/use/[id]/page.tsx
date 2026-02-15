import Link from 'next/link';
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
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-base text-primary hover:text-primary-focus transition-colors"
          >
            ← Back to Explore
          </Link>
        </nav>
        <Wizard useCase={useCase} />
      </div>
    </div>
  );
}
