'use client';

import Link from 'next/link';
import { GraduationCap, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Top section */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="rounded-xl bg-primary p-2 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">EduEval</span>
            </Link>
            
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link 
                href="/docs" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <Link 
                href="/upload" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Importer
              </Link>
              <Link 
                href="/dashboard" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Tableau de bord
              </Link>
              <Link 
                href="/teachers" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Enseignants
              </Link>
            </nav>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Bottom section */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} EduEval. Tous droits réservés.
            </p>
            
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Built with 
              <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
              by
              <a 
                href="https://isaacakonkwa.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                Isaac Akonkwa
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
