'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { parseCSV, type CSVValidationResult } from '@/lib/csv-utils';
import type { EvaluationRow } from '@/lib/types';

interface CSVDropzoneProps {
  onUpload: (data: EvaluationRow[], validation: CSVValidationResult) => void;
  isLoading?: boolean;
}

export function CSVDropzone({ onUpload, isLoading = false }: CSVDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<CSVValidationResult | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setValidation(null);

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    try {
      const { data, validation: result } = await parseCSV(selectedFile);
      setFile(selectedFile);
      setValidation(result);

      if (result.isValid) {
        onUpload(data, result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du parsing');
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, [processFile]);

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
    setValidation(null);
  }, []);

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          isDragging && 'border-primary ring-2 ring-primary/20',
          error && 'border-destructive',
          validation?.isValid && 'border-success'
        )}
      >
        <CardContent className="p-0">
          <label
            htmlFor="csv-upload"
            className="block cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-8">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Traitement en cours...</p>
                  </motion.div>
                ) : validation?.isValid ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="rounded-full bg-success/10 p-3">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{file?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {validation.rowCount} évaluations importées
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        reset();
                      }}
                    >
                      Importer un autre fichier
                    </Button>
                  </motion.div>
                ) : error || (validation && !validation.isValid) ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="rounded-full bg-destructive/10 p-3">
                      <XCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-destructive">
                        {error || 'Le fichier contient des erreurs'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        reset();
                      }}
                    >
                      Réessayer
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className={cn(
                      'rounded-full p-4 transition-colors',
                      isDragging ? 'bg-primary/20' : 'bg-muted'
                    )}>
                      <Upload className={cn(
                        'h-8 w-8 transition-colors',
                        isDragging ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        Glissez-déposez votre fichier CSV ici
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ou cliquez pour sélectionner un fichier
                      </p>
                    </div>
                    <Button type="button" variant="secondary" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Parcourir
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="sr-only"
          />
        </CardContent>
      </Card>

      {/* Validation Errors */}
      <AnimatePresence>
        {validation && !validation.isValid && validation.errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                  <div className="space-y-1">
                    <p className="font-medium text-destructive">
                      Erreurs de validation ({validation.errors.length})
                    </p>
                    <ul className="list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                      {validation.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {validation.errors.length > 5 && (
                        <li>... et {validation.errors.length - 5} autres erreurs</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Warnings */}
      <AnimatePresence>
        {validation?.warnings && validation.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-warning">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
                  <div className="space-y-1">
                    <p className="font-medium text-warning-foreground">
                      Avertissements ({validation.warnings.length})
                    </p>
                    <ul className="list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                      {validation.warnings.slice(0, 3).map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                      {validation.warnings.length > 3 && (
                        <li>... et {validation.warnings.length - 3} autres avertissements</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
