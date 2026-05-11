'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-primary/10" />
            <div className="absolute inset-4 rounded-full bg-primary/20" />
            <div className="absolute inset-8 flex items-center justify-center rounded-full bg-primary/30">
              <span className="text-4xl font-bold text-primary">404</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Page introuvable
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Vérifiez l'URL ou retournez à l'accueil.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/upload">
              <Search className="mr-2 h-4 w-4" />
              Importer des données
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
