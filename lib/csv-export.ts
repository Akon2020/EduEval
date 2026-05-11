import Papa from 'papaparse';
import type { ParsedEvaluation } from './types';
import { GRADE_MAP } from './types';

// Reverse map to convert scores back to grades
const SCORE_TO_GRADE: Record<number, string> = Object.fromEntries(
  Object.entries(GRADE_MAP).map(([grade, score]) => [score, grade])
);

function scoreToGrade(score: number): string {
  // Find the closest grade
  const grades = Object.keys(GRADE_MAP);
  let closestGrade = 'B';
  let minDiff = Infinity;
  
  for (const grade of grades) {
    const gradeScore = GRADE_MAP[grade as keyof typeof GRADE_MAP];
    const diff = Math.abs(gradeScore - score);
    if (diff < minDiff) {
      minDiff = diff;
      closestGrade = grade;
    }
  }
  
  return closestGrade;
}

export function evaluationsToCSV(evaluations: ParsedEvaluation[]): string {
  const data = evaluations.map((evaluation) => {
    const row: Record<string, string> = {
      teacher: evaluation.teacher,
      course: evaluation.course,
      class: evaluation.class,
    };
    
    // Convert scores back to grades
    evaluation.scores.forEach((score, index) => {
      row[`q${index + 1}`] = scoreToGrade(score);
    });
    
    row.good = evaluation.good;
    row.improve = evaluation.improve;
    
    return row;
  });
  
  return Papa.unparse(data, {
    header: true,
    columns: [
      'teacher',
      'course',
      'class',
      'q1', 'q2', 'q3', 'q4', 'q5',
      'q6', 'q7', 'q8', 'q9', 'q10',
      'q11', 'q12', 'q13', 'q14', 'q15',
      'good',
      'improve',
    ],
  });
}

export function downloadCSV(evaluations: ParsedEvaluation[], filename: string = 'evaluations.csv'): void {
  const csv = evaluationsToCSV(evaluations);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
