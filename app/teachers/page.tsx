import type { Metadata } from 'next';
import { TeachersClient } from './teachers-client';

export const metadata: Metadata = {
  title: 'Liste des enseignants',
  description: 'Consultez la liste complète des enseignants et leurs performances.',
};

export default function TeachersPage() {
  return <TeachersClient />;
}
