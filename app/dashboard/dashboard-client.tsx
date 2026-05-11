'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  ChevronRight,
  Upload,
  Trophy,
  AlertTriangle,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { StatCard } from '@/components/ui/stat-card';
import { ScoreBadge, ScoreBar } from '@/components/ui/score-badge';
import { SectionRadarChart } from '@/components/charts/section-radar-chart';
import { ScoresBarChart } from '@/components/charts/scores-bar-chart';
import { SectionsBreakdownChart } from '@/components/charts/sections-breakdown-chart';
import { useEvaluationStore } from '@/lib/store';
import { exportGlobalReportToPDF } from '@/lib/pdf-export';
import { downloadCSV } from '@/lib/csv-export';
import { scoreToPercentage } from '@/lib/csv-utils';

export function DashboardClient() {
  const router = useRouter();
  const { isLoaded, getGlobalAnalytics, getAllTeachers } = useEvaluationStore();

  useEffect(() => {
    if (!isLoaded) {
      router.push('/upload');
    }
  }, [isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune donnée chargée</p>
          <Button asChild className="mt-4">
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Importer des données
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const analytics = getGlobalAnalytics();
  const teachers = getAllTeachers();

  if (!analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const courseData = analytics.courseAverages.map(c => ({
    name: c.course,
    average: c.average,
  }));

  const classData = analytics.classAverages.map(c => ({
    name: c.class,
    average: c.average,
  }));

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SlideUp>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="mt-2 text-muted-foreground">
              Vue d'ensemble des évaluations et performances
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => downloadCSV(useEvaluationStore.getState().evaluations)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
            <Button onClick={() => exportGlobalReportToPDF(analytics, teachers)}>
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </div>
      </SlideUp>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total évaluations"
          value={analytics.totalEvaluations}
          icon={GraduationCap}
          delay={0.1}
        />
        <StatCard
          title="Enseignants"
          value={analytics.totalTeachers}
          icon={Users}
          delay={0.15}
        />
        <StatCard
          title="Matières"
          value={analytics.totalCourses}
          icon={BookOpen}
          delay={0.2}
        />
        <StatCard
          title="Moyenne generale"
          value={`${scoreToPercentage(analytics.overallAverage)}%`}
          subtitle={scoreToPercentage(analytics.overallAverage) >= 75 ? 'Tres bien' : scoreToPercentage(analytics.overallAverage) >= 62.5 ? 'Bien' : 'A ameliorer'}
          icon={TrendingUp}
          delay={0.25}
        />
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.3}>
          <Card className="p-6">
            <SectionRadarChart 
              data={analytics.sectionAverages} 
              title="Performance globale par section"
            />
          </Card>
        </SlideUp>
        <SlideUp delay={0.35}>
          <Card className="p-6">
            <SectionsBreakdownChart 
              data={analytics.sectionAverages}
              title="Detail des sections"
              description="Score en pourcentage pour chaque dimension"
            />
          </Card>
        </SlideUp>
      </div>

      {/* Course and Class Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.4}>
          <Card className="p-6">
            <ScoresBarChart 
              data={courseData}
              title="Moyennes par matiere"
              description="Performance en pourcentage pour chaque cours"
              maxItems={8}
            />
          </Card>
        </SlideUp>
        <SlideUp delay={0.45}>
          <Card className="p-6">
            <ScoresBarChart 
              data={classData}
              title="Moyennes par classe"
              description="Performance en pourcentage pour chaque classe"
              maxItems={8}
            />
          </Card>
        </SlideUp>
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.5}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-success" />
                Meilleures performances
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/teachers">
                  Voir tous
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                {analytics.topPerformers.slice(0, 5).map((teacher) => (
                  <StaggerItem key={teacher.name}>
                    <Link 
                      href={`/teachers/${encodeURIComponent(teacher.name)}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.courses.join(', ')} - {teacher.evaluationCount} éval.
                        </p>
                      </div>
                      <ScoreBadge score={teacher.overallAverage} />
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.55}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Axes d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.needsAttention.length > 0 ? (
                <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                  {analytics.needsAttention.slice(0, 5).map((teacher) => (
                    <StaggerItem key={teacher.name}>
                      <Link 
                        href={`/teachers/${encodeURIComponent(teacher.name)}`}
                        className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-medium">{teacher.name}</p>
                          <ScoreBadge score={teacher.overallAverage} />
                        </div>
                        <ScoreBar score={teacher.overallAverage} showValue={false} />
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <div className="flex h-32 items-center justify-center text-center">
                  <p className="text-muted-foreground">
                    Aucun enseignant en dessous de la moyenne
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  );
}
