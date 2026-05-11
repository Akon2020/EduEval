import type { Metadata } from 'next';
import { TeacherDetailClient } from './teacher-detail-client';

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  return {
    title: `${decodedName} - Profil enseignant`,
    description: `Consultez le profil détaillé et les performances de ${decodedName}.`,
  };
}

export default async function TeacherDetailPage({ params }: PageProps) {
  const { name } = await params;
  return <TeacherDetailClient name={decodeURIComponent(name)} />;
}
