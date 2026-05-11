import type { Metadata } from 'next';
import { UploadClient } from './upload-client';

export const metadata: Metadata = {
  title: 'Importer des évaluations',
  description: 'Importez vos fichiers CSV d\'évaluations pour générer des analyses détaillées.',
};

export default function UploadPage() {
  return <UploadClient />;
}
