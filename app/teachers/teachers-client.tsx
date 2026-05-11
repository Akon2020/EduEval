'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Upload, 
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { TeacherCard } from '@/components/teachers/teacher-card';
import { AddTeacherDialog } from '@/components/teachers/add-teacher-dialog';
import { useEvaluationStore } from '@/lib/store';
import type { TeacherAnalytics } from '@/lib/types';
import { cn } from '@/lib/utils';

type SortOption = 'name' | 'score-desc' | 'score-asc' | 'evaluations';

export function TeachersClient() {
  const router = useRouter();
  const { isLoaded, getAllTeachers } = useEvaluationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!isLoaded) {
      router.push('/upload');
    }
  }, [isLoaded, router]);

  const teachers = useMemo(() => {
    if (!isLoaded) return [];
    return getAllTeachers();
  }, [isLoaded, getAllTeachers]);

  const courses = useMemo(() => {
    const allCourses = new Set<string>();
    teachers.forEach(t => t.courses.forEach(c => allCourses.add(c)));
    return Array.from(allCourses).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    let result = [...teachers];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.courses.some(c => c.toLowerCase().includes(query))
      );
    }

    // Filtre par matière
    if (courseFilter !== 'all') {
      result = result.filter(t => t.courses.includes(courseFilter));
    }

    // Tri
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'score-desc':
        result.sort((a, b) => b.overallAverage - a.overallAverage);
        break;
      case 'score-asc':
        result.sort((a, b) => a.overallAverage - b.overallAverage);
        break;
      case 'evaluations':
        result.sort((a, b) => b.evaluationCount - a.evaluationCount);
        break;
    }

    return result;
  }, [teachers, searchQuery, courseFilter, sortBy]);

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

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SlideUp>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enseignants</h1>
            <p className="mt-2 text-muted-foreground">
              {teachers.length} enseignants analysés
            </p>
          </div>
          <AddTeacherDialog />
        </div>
      </SlideUp>

      {/* Filters */}
      <SlideUp delay={0.1}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un enseignant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Score (décroissant)</SelectItem>
                <SelectItem value="score-asc">Score (croissant)</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="evaluations">Nb. évaluations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SlideUp>

      {/* Results */}
      {filteredTeachers.length === 0 ? (
        <SlideUp delay={0.2}>
          <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-lg font-medium">Aucun résultat</p>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          </div>
        </SlideUp>
      ) : (
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid' 
            ? 'sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        )}>
          {filteredTeachers.map((teacher, index) => (
            <TeacherCard key={teacher.name} teacher={teacher} index={index} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
