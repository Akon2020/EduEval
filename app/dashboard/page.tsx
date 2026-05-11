import type { Metadata } from 'next';
import { DashboardClient } from './dashboard-client';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: 'Visualisez les analyses et statistiques des évaluations enseignants.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
