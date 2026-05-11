'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge, ScoreBar } from '@/components/ui/score-badge';
import type { TeacherAnalytics } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TeacherCardProps {
  teacher: TeacherAnalytics;
  index?: number;
}

export function TeacherCard({ teacher, index = 0 }: TeacherCardProps) {
  const TrendIcon = teacher.trend === 'up' ? TrendingUp : teacher.trend === 'down' ? TrendingDown : Minus;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/teachers/${encodeURIComponent(teacher.name)}`}>
        <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {teacher.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {teacher.courses.join(', ')}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {teacher.evaluationCount} éval.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={teacher.overallAverage} size="lg" />
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>

                <ScoreBar score={teacher.overallAverage} showValue={false} />

                {teacher.strengths.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.strengths.slice(0, 2).map((strength) => (
                      <Badge 
                        key={strength} 
                        variant="secondary" 
                        className="bg-success/10 text-success hover:bg-success/20"
                      >
                        {strength}
                      </Badge>
                    ))}
                    {teacher.improvements.slice(0, 1).map((improvement) => (
                      <Badge 
                        key={improvement} 
                        variant="secondary"
                        className="bg-warning/10 text-warning-foreground hover:bg-warning/20"
                      >
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
