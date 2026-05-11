// Types pour l'application d'évaluation des enseignants

export interface EvaluationRow {
  teacher: string;
  course: string;
  class: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q14: string;
  q15: string;
  good: string;
  improve: string;
}

export interface ParsedEvaluation {
  teacher: string;
  course: string;
  class: string;
  scores: number[];
  good: string;
  improve: string;
  average: number;
  sectionScores: SectionScores;
}

export interface SectionScores {
  teachingEffectiveness: number;
  classroomManagement: number;
  studentEngagement: number;
  relationshipWithStudents: number;
  evaluationFeedback: number;
}

export interface TeacherAnalytics {
  name: string;
  courses: string[];
  classes: string[];
  evaluationCount: number;
  overallAverage: number;
  sectionAverages: SectionScores;
  strengths: string[];
  improvements: string[];
  goodComments: string[];
  improveComments: string[];
  trend: 'up' | 'down' | 'stable';
  evaluations: ParsedEvaluation[];
}

export interface GlobalAnalytics {
  totalEvaluations: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  overallAverage: number;
  sectionAverages: SectionScores;
  topPerformers: TeacherAnalytics[];
  needsAttention: TeacherAnalytics[];
  courseAverages: { course: string; average: number }[];
  classAverages: { class: string; average: number }[];
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
}

export type GradeType = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C';

export const GRADE_MAP: Record<GradeType, number> = {
  'A+': 8,
  'A': 7,
  'A-': 6,
  'B+': 5,
  'B': 4,
  'B-': 3,
  'C+': 2,
  'C': 1,
};

export const SECTION_NAMES = {
  teachingEffectiveness: 'Efficacité pédagogique',
  classroomManagement: 'Gestion de classe',
  studentEngagement: 'Engagement des élèves',
  relationshipWithStudents: 'Relation avec les élèves',
  evaluationFeedback: 'Évaluation et feedback',
} as const;

export const SECTION_QUESTIONS: Record<keyof SectionScores, number[]> = {
  teachingEffectiveness: [1, 2, 3],
  classroomManagement: [4, 5, 6],
  studentEngagement: [7, 8, 9],
  relationshipWithStudents: [10, 11, 12],
  evaluationFeedback: [13, 14, 15],
};

export const CSV_HEADERS = [
  'teacher',
  'course',
  'class',
  'q1', 'q2', 'q3', 'q4', 'q5',
  'q6', 'q7', 'q8', 'q9', 'q10',
  'q11', 'q12', 'q13', 'q14', 'q15',
  'good',
  'improve',
] as const;
