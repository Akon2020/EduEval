'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ArrowRight, 
  Info,
  Download,
  Table,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition, SlideUp } from '@/components/ui/page-transition';
import { CSVDropzone } from '@/components/upload/csv-dropzone';
import { AddTeacherDialog } from '@/components/teachers/add-teacher-dialog';
import { useEvaluationStore } from '@/lib/store';
import type { EvaluationRow, CSVValidationResult } from '@/lib/types';
import { toast } from 'sonner';

const csvStructure = [
  { column: 'teacher', description: 'Nom de l\'enseignant' },
  { column: 'course', description: 'Matière enseignée' },
  { column: 'class', description: 'Classe (ex: 4A)' },
  { column: 'q1 - q15', description: 'Notes (A+, A, A-, B+, B, B-, C+, C)' },
  { column: 'good', description: 'Points positifs (commentaire)' },
  { column: 'improve', description: 'Points à améliorer (commentaire)' },
];

export function UploadClient() {
  const router = useRouter();
  const { setEvaluations, isLoaded, evaluations } = useEvaluationStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = useCallback(async (data: EvaluationRow[], validation: CSVValidationResult) => {
    if (!validation.isValid) return;

    setIsProcessing(true);
    
    // Simule un court délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEvaluations(data);
    
    toast.success('Import réussi', {
      description: `${validation.rowCount} évaluations ont été importées.`,
    });

    setIsProcessing(false);
    router.push('/dashboard');
  }, [setEvaluations, router]);

  return (
    <PageTransition className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SlideUp>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Importer des évaluations
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Téléversez votre fichier CSV pour commencer l'analyse
          </p>
        </div>
      </SlideUp>

      <div className="space-y-8">
        {/* Dropzone */}
        <SlideUp delay={0.1}>
          <CSVDropzone onUpload={handleUpload} isLoading={isProcessing} />
        </SlideUp>

        {/* Alternative: Manual entry */}
        <SlideUp delay={0.12}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Ou</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-muted-foreground">
              Vous préférez ajouter les évaluations manuellement ?
            </p>
            <AddTeacherDialog />
          </div>
        </SlideUp>

        {/* Actions si données déjà chargées */}
        {isLoaded && evaluations.length > 0 && (
          <SlideUp delay={0.15}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Table className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Données déjà importées</p>
                    <p className="text-sm text-muted-foreground">
                      {evaluations.length} évaluations en mémoire
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/dashboard">
                    Voir le tableau de bord
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </SlideUp>
        )}

        {/* CSV Structure Info */}
        <SlideUp delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-primary" />
                Structure du fichier CSV
              </CardTitle>
              <CardDescription>
                Votre fichier doit respecter cette structure pour être correctement analysé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4 text-left font-medium">Colonne</th>
                      <th className="py-2 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {csvStructure.map((item) => (
                      <tr key={item.column}>
                        <td className="py-2 pr-4">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                            {item.column}
                          </code>
                        </td>
                        <td className="py-2 text-muted-foreground">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href="/docs">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation complète
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Exemple de données */}
        <SlideUp delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exemple de données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg bg-muted p-4">
                <pre className="text-xs sm:text-sm">
{`teacher,course,class,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,good,improve
Mr Bahati,Math,4A,A+,A,A-,B+,A,A,B+,A,A-,A,B+,A,A-,A,A,Excellent professeur,Plus d'exercices
Mme Kalisa,Français,4A,A,A,A,A,A-,A,A,A,A,A+,A,A+,A,A,A,Très pédagogue,RAS`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
}
