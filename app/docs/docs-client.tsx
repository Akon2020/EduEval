"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Table,
  BarChart3,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PageTransition,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/page-transition";

const gradeMapping = [
  { grade: "A+", value: 8, description: "Exceptionnel" },
  { grade: "A", value: 7, description: "Excellent" },
  { grade: "A-", value: 6, description: "Très bien" },
  { grade: "B+", value: 5, description: "Bien" },
  { grade: "B", value: 4, description: "Satisfaisant" },
  { grade: "B-", value: 3, description: "Passable" },
  { grade: "C+", value: 2, description: "Insuffisant" },
  { grade: "C", value: 1, description: "Très insuffisant" },
];

const sections = [
  {
    name: "Efficacité pédagogique",
    questions: ["Q1", "Q2", "Q3"],
    description:
      "Capacité à transmettre les connaissances de manière claire et structurée.",
  },
  {
    name: "Gestion de classe",
    questions: ["Q4", "Q5", "Q6"],
    description:
      "Maintien de l'ordre et création d'un environnement propice à l'apprentissage.",
  },
  {
    name: "Engagement des élèves",
    questions: ["Q7", "Q8", "Q9"],
    description:
      "Capacité à motiver et impliquer les élèves dans le processus d'apprentissage.",
  },
  {
    name: "Relation avec les élèves",
    questions: ["Q10", "Q11", "Q12"],
    description:
      "Qualité des interactions et de la communication avec les élèves.",
  },
  {
    name: "Évaluation et feedback",
    questions: ["Q13", "Q14", "Q15"],
    description: "Qualité des évaluations et des retours fournis aux élèves.",
  },
];

const csvExample = `teacher,course,class,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,good,improve
Mr Bahati,Mathématiques,4A,A+,A,A-,B+,A,A,B+,A,A-,A,B+,A,A-,A,A,Excellent professeur très pédagogue,Plus d'exercices pratiques
Mme Kalisa,Français,4A,A,A,A,A,A-,A,A,A,A,A+,A,A+,A,A,A,Très bonne méthodologie,RAS
Mr Mugabo,Physique,4B,B+,B,B+,A-,B+,B,B+,B+,B,B+,B,B+,B,B+,B,Cours intéressants,Expliquer plus lentement
Mme Uwimana,Histoire,4A,A,A-,A,A,A,A-,A,A,A,A,A,A,A-,A,A,Passionnée par sa matière,Plus de documents visuels`;

export function DocsClient() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(csvExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SlideUp>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Documentation
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Guide complet pour utiliser EduEval
          </p>
        </div>
      </SlideUp>

      <Tabs defaultValue="structure" className="space-y-8">
        <SlideUp delay={0.1}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structure" className="gap-2">
              <Table className="h-4 w-4 hidden sm:block" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-2">
              <BarChart3 className="h-4 w-4 hidden sm:block" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="grades" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:block" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4 hidden sm:block" />
              Export
            </TabsTrigger>
          </TabsList>
        </SlideUp>

        {/* Structure CSV */}
        <TabsContent value="structure">
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle>Structure du fichier CSV</CardTitle>
                  <CardDescription>
                    Votre fichier doit contenir les colonnes suivantes dans cet
                    ordre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 pr-4 text-left font-medium">
                            Colonne
                          </th>
                          <th className="py-3 pr-4 text-left font-medium">
                            Type
                          </th>
                          <th className="py-3 text-left font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              teacher
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Texte</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Nom de l'enseignant
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              course
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Texte</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Matière enseignée
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              class
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Texte</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Identifiant de la classe (ex: 4A, 5B)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              q1 - q15
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Note</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Notes de A+ à C (15 questions)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              good
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Texte</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Commentaire positif (optionnel)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                              improve
                            </code>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">Texte</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            Suggestion d'amélioration (optionnel)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Exemple de fichier CSV</span>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copier
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg bg-muted p-4">
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap break-all">
                      {csvExample}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-primary/20">
                <CardContent className="flex items-start gap-3 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      Conseils pour préparer votre fichier
                    </p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Utilisez des virgules comme séparateurs</li>
                      <li>La première ligne doit contenir les en-têtes</li>
                      <li>Évitez les caractères spéciaux dans les noms</li>
                      <li>
                        Les notes doivent être en majuscules (A+, B-, etc.)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>

        {/* Sections d'évaluation */}
        <TabsContent value="sections">
          <StaggerContainer className="space-y-4" staggerDelay={0.1}>
            {sections.map((section, index) => (
              <StaggerItem key={section.name}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            {section.questions.join(", ")}
                          </Badge>
                          <h3 className="font-semibold">{section.name}</h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </TabsContent>

        {/* Système de notation */}
        <TabsContent value="grades">
          <SlideUp>
            <Card>
              <CardHeader>
                <CardTitle>Correspondance des notes</CardTitle>
                <CardDescription>
                  Chaque note est convertie en valeur numérique pour le calcul
                  des moyennes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {gradeMapping.map((item) => (
                    <motion.div
                      key={item.grade}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gradeMapping.indexOf(item) * 0.05 }}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                          {item.grade}
                        </span>
                        <span className="text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                      <Badge variant="outline">{item.value} pts</Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Calcul de la moyenne :</strong> La moyenne est
                    calculée sur 8 points en additionnant les scores de toutes
                    les questions puis en divisant par le nombre de questions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export">
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle>Export PDF</CardTitle>
                  <CardDescription>
                    Générez des rapports professionnels pour chaque enseignant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Les rapports PDF incluent :
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Informations générales de l'enseignant",
                      "Score moyen et appréciation",
                      "Détail des scores par section",
                      "Points forts identifiés",
                      "Axes d'amélioration",
                      "Commentaires des élèves",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-warning/30">
                <CardContent className="flex items-start gap-3 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
                  <div>
                    <p className="font-medium">Confidentialité</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Toutes les données restent sur votre appareil. Aucune
                      information n'est transmise à des serveurs externes. Les
                      rapports PDF sont générés localement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
