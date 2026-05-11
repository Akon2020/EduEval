import Papa from 'papaparse';
import {
  type EvaluationRow,
  type ParsedEvaluation,
  type CSVValidationResult,
  type SectionScores,
  type GradeType,
  GRADE_MAP,
  SECTION_QUESTIONS,
  CSV_HEADERS,
} from './types';

export function parseGrade(grade: string): number {
  const normalized = grade.trim().toUpperCase() as GradeType;
  return GRADE_MAP[normalized] ?? 0;
}

export function validateCSV(data: unknown[]): CSVValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      errors: ['Le fichier CSV est vide ou invalide'],
      warnings: [],
      rowCount: 0,
    };
  }

  const firstRow = data[0] as Record<string, unknown>;
  const headers = Object.keys(firstRow);
  
  const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    errors.push(`Colonnes manquantes: ${missingHeaders.join(', ')}`);
  }

  let validRows = 0;
  data.forEach((row, index) => {
    const r = row as EvaluationRow;
    
    if (!r.teacher || r.teacher.trim() === '') {
      errors.push(`Ligne ${index + 2}: Le nom de l'enseignant est requis`);
      return;
    }
    
    if (!r.course || r.course.trim() === '') {
      errors.push(`Ligne ${index + 2}: Le cours est requis`);
      return;
    }

    for (let i = 1; i <= 15; i++) {
      const key = `q${i}` as keyof EvaluationRow;
      const value = r[key];
      if (!value || parseGrade(value as string) === 0) {
        warnings.push(`Ligne ${index + 2}: Note invalide pour q${i}`);
      }
    }

    validRows++;
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    rowCount: validRows,
  };
}

export function parseCSV(file: File): Promise<{ data: EvaluationRow[]; validation: CSVValidationResult }> {
  return new Promise((resolve, reject) => {
    Papa.parse<EvaluationRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const validation = validateCSV(results.data);
        resolve({
          data: results.data,
          validation,
        });
      },
      error: (error) => {
        reject(new Error(`Erreur de parsing: ${error.message}`));
      },
    });
  });
}

export function calculateSectionScores(scores: number[]): SectionScores {
  const getAverage = (indices: number[]): number => {
    const sectionScores = indices.map(i => scores[i - 1] || 0);
    return sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
  };

  return {
    teachingEffectiveness: getAverage(SECTION_QUESTIONS.teachingEffectiveness),
    classroomManagement: getAverage(SECTION_QUESTIONS.classroomManagement),
    studentEngagement: getAverage(SECTION_QUESTIONS.studentEngagement),
    relationshipWithStudents: getAverage(SECTION_QUESTIONS.relationshipWithStudents),
    evaluationFeedback: getAverage(SECTION_QUESTIONS.evaluationFeedback),
  };
}

export function parseEvaluationRow(row: EvaluationRow): ParsedEvaluation {
  const scores: number[] = [];
  for (let i = 1; i <= 15; i++) {
    const key = `q${i}` as keyof EvaluationRow;
    scores.push(parseGrade(row[key] as string));
  }

  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const sectionScores = calculateSectionScores(scores);

  return {
    teacher: row.teacher.trim(),
    course: row.course.trim(),
    class: row.class.trim(),
    scores,
    good: row.good?.trim() || '',
    improve: row.improve?.trim() || '',
    average,
    sectionScores,
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 7) return 'Excellent';
  if (score >= 6) return 'Très bien';
  if (score >= 5) return 'Bien';
  if (score >= 4) return 'Satisfaisant';
  if (score >= 3) return 'Passable';
  return 'À améliorer';
}

export function getScoreColor(score: number): string {
  if (score >= 7) return 'text-success';
  if (score >= 5) return 'text-primary';
  if (score >= 3) return 'text-warning';
  return 'text-destructive';
}

export function getScoreBgColor(score: number): string {
  if (score >= 7) return 'bg-success/10';
  if (score >= 5) return 'bg-primary/10';
  if (score >= 3) return 'bg-warning/10';
  return 'bg-destructive/10';
}

// Convert score (0-8) to percentage (0-100)
export function scoreToPercentage(score: number, maxScore: number = 8): number {
  return Math.round((score / maxScore) * 100);
}

// Get color based on percentage
export function getPercentageColor(percentage: number): string {
  if (percentage >= 87.5) return 'text-success';
  if (percentage >= 62.5) return 'text-primary';
  if (percentage >= 37.5) return 'text-warning';
  return 'text-destructive';
}

export function getPercentageBgColor(percentage: number): string {
  if (percentage >= 87.5) return 'bg-success/10';
  if (percentage >= 62.5) return 'bg-primary/10';
  if (percentage >= 37.5) return 'bg-warning/10';
  return 'bg-destructive/10';
}

export function getPercentageLabel(percentage: number): string {
  if (percentage >= 87.5) return 'Excellent';
  if (percentage >= 75) return 'Tres bien';
  if (percentage >= 62.5) return 'Bien';
  if (percentage >= 50) return 'Satisfaisant';
  if (percentage >= 37.5) return 'Passable';
  return 'A ameliorer';
}
