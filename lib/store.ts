'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ParsedEvaluation, GlobalAnalytics, TeacherAnalytics, SectionScores } from './types';
import { 
  processEvaluations, 
  calculateGlobalAnalytics, 
  getAllTeachers,
  getTeacherByName 
} from './analytics-utils';
import { calculateSectionScores } from './csv-utils';
import type { EvaluationRow } from './csv-utils';

export interface ManualEvaluationInput {
  teacher: string;
  course: string;
  class: string;
  scores: number[];
  good: string;
  improve: string;
}

interface EvaluationStore {
  evaluations: ParsedEvaluation[];
  isLoaded: boolean;
  lastUploadDate: string | null;
  fileName: string | null;
  
  // Actions
  setEvaluations: (rows: EvaluationRow[]) => void;
  addEvaluation: (input: ManualEvaluationInput) => void;
  removeEvaluation: (index: number) => void;
  clearEvaluations: () => void;
  
  // Computed getters
  getGlobalAnalytics: () => GlobalAnalytics | null;
  getAllTeachers: () => TeacherAnalytics[];
  getTeacherByName: (name: string) => TeacherAnalytics | null;
}

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set, get) => ({
      evaluations: [],
      isLoaded: false,
      lastUploadDate: null,
      fileName: null,
      
      setEvaluations: (rows: EvaluationRow[]) => {
        const parsed = processEvaluations(rows);
        set({
          evaluations: parsed,
          isLoaded: true,
          lastUploadDate: new Date().toISOString(),
        });
      },

      addEvaluation: (input: ManualEvaluationInput) => {
        const { evaluations } = get();
        const average = input.scores.reduce((a, b) => a + b, 0) / input.scores.length;
        const sectionScores = calculateSectionScores(input.scores);
        
        const newEvaluation: ParsedEvaluation = {
          teacher: input.teacher.trim(),
          course: input.course.trim(),
          class: input.class.trim(),
          scores: input.scores,
          good: input.good.trim(),
          improve: input.improve.trim(),
          average,
          sectionScores,
        };
        
        set({
          evaluations: [...evaluations, newEvaluation],
          isLoaded: true,
          lastUploadDate: new Date().toISOString(),
        });
      },

      removeEvaluation: (index: number) => {
        const { evaluations } = get();
        const newEvaluations = evaluations.filter((_, i) => i !== index);
        set({
          evaluations: newEvaluations,
          isLoaded: newEvaluations.length > 0,
        });
      },
      
      clearEvaluations: () => {
        set({
          evaluations: [],
          isLoaded: false,
          lastUploadDate: null,
          fileName: null,
        });
      },
      
      getGlobalAnalytics: () => {
        const { evaluations } = get();
        if (evaluations.length === 0) return null;
        return calculateGlobalAnalytics(evaluations);
      },
      
      getAllTeachers: () => {
        const { evaluations } = get();
        if (evaluations.length === 0) return [];
        return getAllTeachers(evaluations);
      },
      
      getTeacherByName: (name: string) => {
        const { evaluations } = get();
        if (evaluations.length === 0) return null;
        return getTeacherByName(evaluations, name);
      },
    }),
    {
      name: 'evaluation-storage',
      partialize: (state) => ({
        evaluations: state.evaluations,
        isLoaded: state.isLoaded,
        lastUploadDate: state.lastUploadDate,
        fileName: state.fileName,
      }),
    }
  )
);
