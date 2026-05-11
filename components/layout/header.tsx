'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Upload, 
  LayoutDashboard, 
  Users, 
  FileText,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useEvaluationStore } from '@/lib/store';

const navigation = [
  { name: 'Accueil', href: '/', icon: GraduationCap, description: 'Page principale' },
  { name: 'Importer', href: '/upload', icon: Upload, description: 'Importer un fichier CSV' },
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, description: 'Analytics et statistiques', requiresData: true },
  { name: 'Enseignants', href: '/teachers', icon: Users, description: 'Liste des enseignants', requiresData: true },
  { name: 'Documentation', href: '/docs', icon: FileText, description: 'Guide d\'utilisation' },
];

export function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoaded } = useEvaluationStore();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="rounded-xl bg-primary p-2 shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                EduEval
              </span>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = item.requiresData && !isLoaded;

                return (
                  <Link
                    key={item.name}
                    href={isDisabled ? '#' : item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'text-primary'
                        : isDisabled
                        ? 'text-muted-foreground/40 cursor-not-allowed'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    onClick={(e) => isDisabled && e.preventDefault()}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-card border-r shadow-2xl lg:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                  <div className="rounded-xl bg-primary p-2">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-lg">EduEval</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-9 w-9"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    const isDisabled = item.requiresData && !isLoaded;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={isDisabled ? '#' : item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3 transition-all group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : isDisabled
                              ? 'text-muted-foreground/40 cursor-not-allowed'
                              : 'text-foreground hover:bg-muted'
                          )}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                            isActive 
                              ? "bg-primary-foreground/20" 
                              : isDisabled 
                              ? "bg-muted/50"
                              : "bg-muted group-hover:bg-primary/10"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              isActive ? "text-primary-foreground" : isDisabled ? "text-muted-foreground/40" : "text-primary"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium truncate",
                              isActive ? "text-primary-foreground" : ""
                            )}>
                              {item.name}
                            </p>
                            <p className={cn(
                              "text-xs truncate",
                              isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            "h-4 w-4 opacity-0 transition-opacity",
                            !isDisabled && "group-hover:opacity-100",
                            isActive && "opacity-100 text-primary-foreground/70"
                          )} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Status indicator */}
                {!isLoaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 rounded-xl border border-dashed bg-muted/30 p-4"
                  >
                    <p className="text-sm text-muted-foreground text-center">
                      Importez un fichier CSV pour débloquer toutes les fonctionnalités
                    </p>
                    <Link href="/upload" onClick={() => setSidebarOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <Upload className="h-4 w-4 mr-2" />
                        Importer maintenant
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Thème</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
