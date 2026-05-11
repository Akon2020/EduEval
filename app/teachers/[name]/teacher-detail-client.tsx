'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Download,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { StatCard } from '@/components/ui/stat-card';
import { ScoreBadge, ScoreBar } from '@/components/ui/score-badge';
import { SectionRadarChart } from '@/components/charts/section-radar-chart';
import { SectionsBreakdownChart } from '@/components/charts/sections-breakdown-chart';
import { useEvaluationStore } from '@/lib/store';
import { SECTION_NAMES } from '@/lib/types';
import { exportTeacherToPDF } from '@/lib/pdf-export';
import { scoreToPercentage } from '@/lib/csv-utils';

interface TeacherDetailClientProps {
  name: string;
}

export function TeacherDetailClient({ name }: TeacherDetailClientProps) {
  const router = useRouter();
  const { isLoaded, getTeacherByName } = useEvaluationStore();

  useEffect(() => {
    if (!isLoaded) {
      router.push('/upload');
    }
  }, [isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const teacher = getTeacherByName(name);

  if (!teacher) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Enseignant non trouvé</p>
          <p className="text-muted-foreground">
            {"L'enseignant"} "{name}" {"n'existe pas dans les données."}
          </p>
          <Button asChild className="mt-4">
            <Link href="/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleExportPDF = () => {
    exportTeacherToPDF(teacher);
  };

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <SlideUp>
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{teacher.name}</h1>
                <ScoreBadge score={teacher.overallAverage} size="lg" showLabel />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {teacher.courses.join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {teacher.classes.join(', ')}
                </span>
              </div>
            </div>
            <Button onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exporter en PDF
            </Button>
          </div>
        </div>
      </SlideUp>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Moyenne generale"
          value={`${scoreToPercentage(teacher.overallAverage)}%`}
          icon={Star}
          delay={0.1}
        />
        <StatCard
          title="Évaluations"
          value={teacher.evaluationCount}
          icon={Users}
          delay={0.15}
        />
        <StatCard
          title="Matières"
          value={teacher.courses.length}
          icon={BookOpen}
          delay={0.2}
        />
        <StatCard
          title="Classes"
          value={teacher.classes.length}
          icon={Users}
          delay={0.25}
        />
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.3}>
          <Card className="p-6">
            <SectionRadarChart 
              data={teacher.sectionAverages}
              title="Performance par section"
            />
          </Card>
        </SlideUp>
        <SlideUp delay={0.35}>
          <Card className="p-6">
            <SectionsBreakdownChart 
              data={teacher.sectionAverages}
              title="Detail des scores"
              description="Score en pourcentage pour chaque dimension"
            />
          </Card>
        </SlideUp>
      </div>

      {/* Section Scores Detail */}
      <SlideUp delay={0.4}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détail par section</CardTitle>
            <CardDescription>Performance détaillée sur chaque dimension évaluée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(teacher.sectionAverages).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {SECTION_NAMES[key as keyof typeof SECTION_NAMES]}
                    </span>
                    <ScoreBadge score={value} size="sm" />
                  </div>
                  <ScoreBar score={value} showValue={false} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Strengths & Improvements */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.45}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-success" />
                Points forts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.strengths.map((strength) => (
                    <Badge 
                      key={strength} 
                      variant="secondary"
                      className="bg-success/10 text-success"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun point fort identifié</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Axes d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.improvements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.improvements.map((improvement) => (
                    <Badge 
                      key={improvement} 
                      variant="secondary"
                      className="bg-warning/10 text-warning-foreground"
                    >
                      {improvement}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun axe d'amélioration identifié</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Comments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.55}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-success" />
                Commentaires positifs
              </CardTitle>
              <CardDescription>
                {teacher.goodComments.length} commentaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacher.goodComments.length > 0 ? (
                <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                  {teacher.goodComments.slice(0, 10).map((comment, i) => (
                    <StaggerItem key={i}>
                      <div className="rounded-lg bg-success/5 p-3 text-sm">
                        "{comment}"
                      </div>
                    </StaggerItem>
                  ))}
                  {teacher.goodComments.length > 10 && (
                    <p className="text-sm text-muted-foreground">
                      ... et {teacher.goodComments.length - 10} autres commentaires
                    </p>
                  )}
                </StaggerContainer>
              ) : (
                <p className="text-muted-foreground">Aucun commentaire positif</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-warning" />
                Suggestions d'amélioration
              </CardTitle>
              <CardDescription>
                {teacher.improveComments.length} suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacher.improveComments.length > 0 ? (
                <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                  {teacher.improveComments.slice(0, 10).map((comment, i) => (
                    <StaggerItem key={i}>
                      <div className="rounded-lg bg-warning/5 p-3 text-sm">
                        "{comment}"
                      </div>
                    </StaggerItem>
                  ))}
                  {teacher.improveComments.length > 10 && (
                    <p className="text-sm text-muted-foreground">
                      ... et {teacher.improveComments.length - 10} autres suggestions
                    </p>
                  )}
                </StaggerContainer>
              ) : (
                <p className="text-muted-foreground">Aucune suggestion</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
}
