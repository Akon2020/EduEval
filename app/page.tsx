'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Upload, 
  BarChart3, 
  Users, 
  FileDown, 
  Shield, 
  Zap,
  ArrowRight,
  Play,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  Star,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Animated counter component
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useState(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  });

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? displayValue : 0}{suffix}
    </span>
  );
}

// Floating element component
function FloatingElement({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Interactive feature card
function FeatureItem({ icon: Icon, title, description, index }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-muted/50">
        <motion.div 
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <Icon className="h-6 w-6" />
        </motion.div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <ArrowRight className="h-5 w-5 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Step timeline component
function StepTimeline() {
  const steps = [
    { icon: Upload, title: 'Importez', description: 'Glissez votre fichier CSV' },
    { icon: Zap, title: 'Analysez', description: 'Traitement instantané' },
    { icon: BarChart3, title: 'Visualisez', description: 'Graphiques interactifs' },
    { icon: FileDown, title: 'Exportez', description: 'Rapports PDF pro' },
  ];

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block" />
      
      <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex items-center gap-4 sm:flex-col sm:text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background transition-colors",
                "border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <step.icon className="h-5 w-5" />
            </motion.div>
            <div className="sm:mt-3">
              <p className="font-semibold">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Section badge component
function SectionBadge({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
          : "bg-muted hover:bg-muted/80"
      )}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
    layoutEffect: false
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const features = [
    { icon: Upload, title: 'Import CSV intelligent', description: 'Validation automatique et détection des erreurs en temps réel.' },
    { icon: BarChart3, title: 'Analytics avancées', description: 'Graphiques radar, barres et tendances pour chaque métrique.' },
    { icon: Users, title: 'Profils détaillés', description: 'Vue complète par enseignant avec historique et commentaires.' },
    { icon: FileDown, title: 'Export PDF stylisé', description: 'Rapports professionnels prêts à imprimer ou partager.' },
    { icon: Shield, title: 'Confidentialité totale', description: 'Aucune donnée envoyée. Tout reste sur votre appareil.' },
    { icon: Zap, title: 'Performance optimale', description: 'Interface fluide et réactive, même avec des milliers de lignes.' },
  ];

  const sections = [
    { name: 'Efficacité pédagogique', questions: '1-3' },
    { name: 'Gestion de classe', questions: '4-6' },
    { name: 'Engagement des élèves', questions: '7-9' },
    { name: 'Relation élèves', questions: '10-12' },
    { name: 'Évaluation & feedback', questions: '13-15' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center px-4 py-20 sm:px-6 lg:px-8">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="mx-auto w-full max-w-7xl"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left column - Text content */}
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-2 text-sm mb-8 mx-auto lg:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  {/* <span className="text-muted-foreground">100% local et sécurisé</span> */}
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="text-balance">
                  Transformez vos évaluations en{' '}
                  <span className="relative">
                    <span className="relative z-10 text-primary">insights</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="absolute bottom-2 left-0 h-3 w-full bg-primary/20 origin-left -z-0"
                    />
                  </span>
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground leading-relaxed"
              >
                La plateforme d&apos;analyse des évaluations enseignants qui vous donne 
                une vision claire des performances pédagogiques. Simple, rapide et confidentiel.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Button asChild size="lg" className="group h-12 px-6">
                  <Link href="/upload">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Commencer maintenant
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-6">
                  <Link href="/docs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation
                  </Link>
                </Button>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start"
              >
                {[
                  { value: 5, suffix: '', label: 'dimensions evaluees' },
                  { value: 15, suffix: '', label: 'questions analysees' },
                  { value: 100, suffix: '%', label: 'confidentialite' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex flex-col items-center lg:items-start">
                    <span className="text-3xl font-bold text-primary">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column - Interactive visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Central element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute h-[80%] w-[80%] rounded-full border border-dashed border-primary/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="absolute h-[60%] w-[60%] rounded-full border border-primary/10"
                  />
                  <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30">
                    <BarChart3 className="h-16 w-16 text-primary-foreground" />
                  </div>
                </div>

                {/* Floating elements */}
                <FloatingElement delay={0} className="absolute top-8 left-12">
                  <div className="flex items-center gap-2 rounded-xl bg-card border px-3 py-2 shadow-lg">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                </FloatingElement>

                <FloatingElement delay={1} className="absolute top-1/4 right-0">
                  <div className="flex items-center gap-2 rounded-xl bg-card border px-3 py-2 shadow-lg">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="text-sm font-medium">7.2/8</span>
                  </div>
                </FloatingElement>

                <FloatingElement delay={2} className="absolute bottom-1/4 left-0">
                  <div className="flex items-center gap-2 rounded-xl bg-card border px-3 py-2 shadow-lg">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">24 enseignants</span>
                  </div>
                </FloatingElement>

                <FloatingElement delay={1.5} className="absolute bottom-12 right-8">
                  <div className="flex items-center gap-2 rounded-xl bg-card border px-3 py-2 shadow-lg">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Analysé</span>
                  </div>
                </FloatingElement>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Défiler pour explorer</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MousePointer2 className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* How it works Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Simple et efficace
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comment ça fonctionne
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              En 4 étapes simples, passez de données brutes à des insights actionnables
            </p>
          </motion.div>

          <StepTimeline />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Des fonctionnalités pensées pour simplifier votre analyse pédagogique
            </p>
          </motion.div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureItem key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Sections */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              5 dimensions évaluées
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              15 questions réparties en 5 sections pour une évaluation complète
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SectionBadge active={index === 0}>
                  <span className="text-xs opacity-60">Q{section.questions}</span>
                  {section.name}
                </SectionBadge>
              </motion.div>
            ))}
          </motion.div>

          {/* Visual representation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 relative"
          >
            <div className="aspect-[2/1] rounded-2xl bg-gradient-to-br from-muted/50 to-muted border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-4 sm:p-8 w-full max-w-3xl">
                  {[7.2, 6.8, 7.5, 6.5, 7.0].map((score, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                      style={{ originY: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div 
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60"
                        style={{ height: `${(score / 8) * 120}px` }}
                      />
                      <span className="text-xs sm:text-sm font-medium">{score}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 sm:p-12 lg:p-16 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Prêt à analyser vos évaluations ?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Importez votre premier fichier CSV et découvrez des insights en quelques secondes. 
                C&apos;est gratuit et vos données restent privées.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                  <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer un fichier CSV
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 text-white border-white/20 hover:bg-white/10 hover:text-white">
                  <Link href="/docs">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
