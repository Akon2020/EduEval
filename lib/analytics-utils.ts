import {
  type ParsedEvaluation,
  type TeacherAnalytics,
  type GlobalAnalytics,
  type SectionScores,
  SECTION_NAMES,
} from './types';
import { parseEvaluationRow, type EvaluationRow } from './csv-utils';

export function processEvaluations(rows: EvaluationRow[]): ParsedEvaluation[] {
  return rows.map(parseEvaluationRow);
}

export function groupByTeacher(evaluations: ParsedEvaluation[]): Map<string, ParsedEvaluation[]> {
  const grouped = new Map<string, ParsedEvaluation[]>();
  
  for (const evaluation of evaluations) {
    const existing = grouped.get(evaluation.teacher) || [];
    existing.push(evaluation);
    grouped.set(evaluation.teacher, existing);
  }
  
  return grouped;
}

export function calculateTeacherAnalytics(
  name: string,
  evaluations: ParsedEvaluation[]
): TeacherAnalytics {
  const courses = [...new Set(evaluations.map(e => e.course))];
  const classes = [...new Set(evaluations.map(e => e.class))];
  
  const overallAverage = evaluations.reduce((sum, e) => sum + e.average, 0) / evaluations.length;
  
  const sectionAverages: SectionScores = {
    teachingEffectiveness: 0,
    classroomManagement: 0,
    studentEngagement: 0,
    relationshipWithStudents: 0,
    evaluationFeedback: 0,
  };
  
  for (const key of Object.keys(sectionAverages) as (keyof SectionScores)[]) {
    sectionAverages[key] = evaluations.reduce((sum, e) => sum + e.sectionScores[key], 0) / evaluations.length;
  }
  
  const sortedSections = Object.entries(sectionAverages)
    .sort(([, a], [, b]) => b - a);
  
  const strengths = sortedSections
    .slice(0, 2)
    .filter(([, score]) => score >= 5)
    .map(([key]) => SECTION_NAMES[key as keyof typeof SECTION_NAMES]);
  
  const improvements = sortedSections
    .slice(-2)
    .filter(([, score]) => score < 6)
    .map(([key]) => SECTION_NAMES[key as keyof typeof SECTION_NAMES]);
  
  const goodComments = evaluations
    .map(e => e.good)
    .filter(c => c && c.length > 0);
  
  const improveComments = evaluations
    .map(e => e.improve)
    .filter(c => c && c.length > 0);
  
  return {
    name,
    courses,
    classes,
    evaluationCount: evaluations.length,
    overallAverage,
    sectionAverages,
    strengths,
    improvements,
    goodComments,
    improveComments,
    trend: 'stable',
    evaluations,
  };
}

export function calculateGlobalAnalytics(evaluations: ParsedEvaluation[]): GlobalAnalytics {
  const teacherGroups = groupByTeacher(evaluations);
  const teacherAnalytics: TeacherAnalytics[] = [];
  
  for (const [name, evals] of teacherGroups) {
    teacherAnalytics.push(calculateTeacherAnalytics(name, evals));
  }
  
  const allCourses = [...new Set(evaluations.map(e => e.course))];
  const allClasses = [...new Set(evaluations.map(e => e.class))];
  
  const overallAverage = evaluations.reduce((sum, e) => sum + e.average, 0) / evaluations.length;
  
  const sectionAverages: SectionScores = {
    teachingEffectiveness: 0,
    classroomManagement: 0,
    studentEngagement: 0,
    relationshipWithStudents: 0,
    evaluationFeedback: 0,
  };
  
  for (const key of Object.keys(sectionAverages) as (keyof SectionScores)[]) {
    sectionAverages[key] = evaluations.reduce((sum, e) => sum + e.sectionScores[key], 0) / evaluations.length;
  }
  
  const sortedTeachers = [...teacherAnalytics].sort((a, b) => b.overallAverage - a.overallAverage);
  const topPerformers = sortedTeachers.slice(0, 5);
  const needsAttention = sortedTeachers.filter(t => t.overallAverage < 5).slice(0, 5);
  
  const courseAverages = allCourses.map(course => {
    const courseEvals = evaluations.filter(e => e.course === course);
    const avg = courseEvals.reduce((sum, e) => sum + e.average, 0) / courseEvals.length;
    return { course, average: avg };
  }).sort((a, b) => b.average - a.average);
  
  const classAverages = allClasses.map(cls => {
    const classEvals = evaluations.filter(e => e.class === cls);
    const avg = classEvals.reduce((sum, e) => sum + e.average, 0) / classEvals.length;
    return { class: cls, average: avg };
  }).sort((a, b) => b.average - a.average);
  
  return {
    totalEvaluations: evaluations.length,
    totalTeachers: teacherGroups.size,
    totalCourses: allCourses.length,
    totalClasses: allClasses.length,
    overallAverage,
    sectionAverages,
    topPerformers,
    needsAttention,
    courseAverages,
    classAverages,
  };
}

export function getTeacherByName(
  evaluations: ParsedEvaluation[],
  name: string
): TeacherAnalytics | null {
  const teacherEvals = evaluations.filter(e => e.teacher === name);
  if (teacherEvals.length === 0) return null;
  return calculateTeacherAnalytics(name, teacherEvals);
}

export function getAllTeachers(evaluations: ParsedEvaluation[]): TeacherAnalytics[] {
  const teacherGroups = groupByTeacher(evaluations);
  const teachers: TeacherAnalytics[] = [];
  
  for (const [name, evals] of teacherGroups) {
    teachers.push(calculateTeacherAnalytics(name, evals));
  }
  
  return teachers.sort((a, b) => b.overallAverage - a.overallAverage);
}
