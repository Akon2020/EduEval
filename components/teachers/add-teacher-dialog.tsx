'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, BookOpen, School, MessageSquare, Star, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEvaluationStore } from '@/lib/store';
import { SECTION_NAMES, type GradeType, GRADE_MAP } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const QUESTIONS = [
  // Section 1: Efficacité pédagogique (Q1-Q3)
  { id: 1, section: 'teachingEffectiveness', text: "L'enseignant explique clairement les concepts" },
  { id: 2, section: 'teachingEffectiveness', text: "L'enseignant utilise des exemples pertinents" },
  { id: 3, section: 'teachingEffectiveness', text: "L'enseignant maîtrise sa matière" },
  // Section 2: Gestion de classe (Q4-Q6)
  { id: 4, section: 'classroomManagement', text: "L'enseignant maintient un environnement propice à l'apprentissage" },
  { id: 5, section: 'classroomManagement', text: "L'enseignant gère efficacement le temps de cours" },
  { id: 6, section: 'classroomManagement', text: "L'enseignant établit des règles claires" },
  // Section 3: Engagement des élèves (Q7-Q9)
  { id: 7, section: 'studentEngagement', text: "L'enseignant encourage la participation active" },
  { id: 8, section: 'studentEngagement', text: "L'enseignant rend le cours intéressant" },
  { id: 9, section: 'studentEngagement', text: "L'enseignant utilise des méthodes variées" },
  // Section 4: Relation avec les élèves (Q10-Q12)
  { id: 10, section: 'relationshipWithStudents', text: "L'enseignant est respectueux envers les élèves" },
  { id: 11, section: 'relationshipWithStudents', text: "L'enseignant est disponible pour aider" },
  { id: 12, section: 'relationshipWithStudents', text: "L'enseignant est à l'écoute des préoccupations" },
  // Section 5: Évaluation et feedback (Q13-Q15)
  { id: 13, section: 'evaluationFeedback', text: "L'enseignant donne des retours constructifs" },
  { id: 14, section: 'evaluationFeedback', text: "L'enseignant évalue de manière équitable" },
  { id: 15, section: 'evaluationFeedback', text: "L'enseignant prépare bien aux examens" },
];

const GRADES: GradeType[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

const STEPS = [
  { id: 'info', title: 'Informations', icon: User },
  { id: 'scores', title: 'Évaluation', icon: Star },
  { id: 'comments', title: 'Commentaires', icon: MessageSquare },
];

interface FormData {
  teacher: string;
  course: string;
  class: string;
  scores: (GradeType | null)[];
  good: string;
  improve: string;
}

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { addEvaluation } = useEvaluationStore();
  
  const [formData, setFormData] = useState<FormData>({
    teacher: '',
    course: '',
    class: '',
    scores: Array(15).fill(null),
    good: '',
    improve: '',
  });

  const resetForm = () => {
    setFormData({
      teacher: '',
      course: '',
      class: '',
      scores: Array(15).fill(null),
      good: '',
      improve: '',
    });
    setCurrentStep(0);
    setCurrentQuestion(0);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleScoreSelect = (questionIndex: number, grade: GradeType) => {
    const newScores = [...formData.scores];
    newScores[questionIndex] = grade;
    setFormData({ ...formData, scores: newScores });
    
    // Auto-advance to next question
    if (questionIndex < 14) {
      setTimeout(() => setCurrentQuestion(questionIndex + 1), 200);
    }
  };

  const canProceedFromInfo = formData.teacher && formData.course && formData.class;
  const canProceedFromScores = formData.scores.every(s => s !== null);
  
  const handleSubmit = () => {
    if (!canProceedFromInfo || !canProceedFromScores) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const numericScores = formData.scores.map(grade => GRADE_MAP[grade as GradeType]);
    
    addEvaluation({
      teacher: formData.teacher,
      course: formData.course,
      class: formData.class,
      scores: numericScores,
      good: formData.good,
      improve: formData.improve,
    });

    toast.success(`Évaluation ajoutée pour ${formData.teacher}`);
    handleClose();
  };

  const currentQuestionData = QUESTIONS[currentQuestion];
  const currentSection = currentQuestionData?.section as keyof typeof SECTION_NAMES;
  const answeredCount = formData.scores.filter(s => s !== null).length;
  const progress = (answeredCount / 15) * 100;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un enseignant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">Nouvelle évaluation</DialogTitle>
          <DialogDescription>
            Ajoutez manuellement une évaluation pour un enseignant
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (index === 0 || (index === 1 && canProceedFromInfo) || (index === 2 && canProceedFromScores)) {
                        setCurrentStep(index);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "text-primary",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                      isActive && "border-primary-foreground bg-primary-foreground/20",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-muted-foreground/30"
                    )}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      "hidden sm:block w-12 h-0.5 mx-2 transition-colors",
                      index < currentStep ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="teacher" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Nom de l&apos;enseignant
                    </Label>
                    <Input
                      id="teacher"
                      placeholder="Ex: Jean Dupont"
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      Cours
                    </Label>
                    <Input
                      id="course"
                      placeholder="Ex: Mathématiques"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class" className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      Classe
                    </Label>
                    <Input
                      id="class"
                      placeholder="Ex: 3ème A"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Scores */}
            {currentStep === 1 && (
              <motion.div
                key="scores"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{answeredCount}/15 questions</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question navigator */}
                <div className="flex flex-wrap gap-2">
                  {QUESTIONS.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(i)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-sm font-medium transition-all",
                        currentQuestion === i && "ring-2 ring-primary ring-offset-2",
                        formData.scores[i] !== null 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {q.id}
                    </button>
                  ))}
                </div>

                {/* Current question */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-3">
                      <span className="font-medium">Question {currentQuestionData.id}</span>
                      <span className="text-primary/60">|</span>
                      <span>{SECTION_NAMES[currentSection]}</span>
                    </div>
                    <p className="text-lg font-medium">{currentQuestionData.text}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {GRADES.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => handleScoreSelect(currentQuestion, grade)}
                        className={cn(
                          "h-12 rounded-lg border-2 text-sm font-semibold transition-all hover:scale-105",
                          formData.scores[currentQuestion] === grade
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentQuestion(Math.min(14, currentQuestion + 1))}
                      disabled={currentQuestion === 14}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Comments */}
            {currentStep === 2 && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="good" className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      Ce que l&apos;enseignant fait bien
                    </Label>
                    <Textarea
                      id="good"
                      placeholder="Points positifs, forces observées..."
                      value={formData.good}
                      onChange={(e) => setFormData({ ...formData, good: e.target.value })}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="improve" className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-warning" />
                      Points à améliorer
                    </Label>
                    <Textarea
                      id="improve"
                      placeholder="Suggestions d'amélioration..."
                      value={formData.improve}
                      onChange={(e) => setFormData({ ...formData, improve: e.target.value })}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                  <h4 className="font-medium">Récapitulatif</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enseignant</span>
                      <span className="font-medium">{formData.teacher || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cours</span>
                      <span className="font-medium">{formData.course || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Classe</span>
                      <span className="font-medium">{formData.class || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Moyenne estimée</span>
                      <span className="font-medium text-primary">
                        {formData.scores.every(s => s !== null)
                          ? (formData.scores.reduce((acc, g) => acc + GRADE_MAP[g as GradeType], 0) / 15).toFixed(1)
                          : '—'}/8
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
          <Button variant="ghost" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 0 ? !canProceedFromInfo : !canProceedFromScores}
              >
                Continuer
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
