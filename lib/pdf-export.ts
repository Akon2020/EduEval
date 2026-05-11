import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TeacherAnalytics, GlobalAnalytics } from "./types";
import { SECTION_NAMES } from "./types";
import { getScoreLabel } from "./csv-utils";

export function exportTeacherToPDF(teacher: TeacherAnalytics) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Couleurs
  const primaryColor: [number, number, number] = [79, 70, 229];
  const successColor: [number, number, number] = [34, 197, 94];
  const warningColor: [number, number, number] = [234, 179, 8];
  const grayColor: [number, number, number] = [107, 114, 128];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EduEval", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Rapport d'évaluation enseignant", 20, 30);

  // Date du rapport
  doc.setFontSize(10);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
    pageWidth - 20,
    30,
    { align: "right" },
  );

  // Informations enseignant
  let yPos = 55;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(teacher.name, 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(`Matières: ${teacher.courses.join(", ")}`, 20, yPos);

  yPos += 6;
  doc.text(`Classes: ${teacher.classes.join(", ")}`, 20, yPos);

  yPos += 6;
  doc.text(`Nombre d'évaluations: ${teacher.evaluationCount}`, 20, yPos);

  // Score général
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, yPos - 5, pageWidth - 40, 25, 3, 3, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Score moyen général:", 30, yPos + 8);

  const scoreColor =
    teacher.overallAverage >= 7
      ? successColor
      : teacher.overallAverage >= 5
        ? primaryColor
        : warningColor;
  doc.setTextColor(...scoreColor);
  doc.setFontSize(18);
  doc.text(
    `${teacher.overallAverage.toFixed(2)} / 8`,
    pageWidth - 30,
    yPos + 8,
    { align: "right" },
  );

  doc.setFontSize(10);
  doc.text(
    `(${getScoreLabel(teacher.overallAverage)})`,
    pageWidth - 30,
    yPos + 15,
    { align: "right" },
  );

  // Scores par section
  yPos += 35;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scores par section", 20, yPos);

  yPos += 5;

  const sectionData = Object.entries(teacher.sectionAverages).map(
    ([key, value]) => [
      SECTION_NAMES[key as keyof typeof SECTION_NAMES],
      value.toFixed(2) + " / 8",
      getScoreLabel(value),
    ],
  );

  autoTable(doc, {
    startY: yPos,
    head: [["Section", "Score", "Appréciation"]],
    body: sectionData,
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });

  // Points forts et améliorations
  yPos =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 15;

  // Points forts
  if (teacher.strengths.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...successColor);
    doc.text("Points forts", 20, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    teacher.strengths.forEach((strength) => {
      doc.text(`• ${strength}`, 25, yPos);
      yPos += 6;
    });
  }

  // Améliorations
  if (teacher.improvements.length > 0) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...warningColor);
    doc.text("Axes d'amélioration", 20, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    teacher.improvements.forEach((improvement) => {
      doc.text(`• ${improvement}`, 25, yPos);
      yPos += 6;
    });
  }

  // Commentaires positifs (nouvelle page si nécessaire)
  if (teacher.goodComments.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...successColor);
    doc.text(
      `Commentaires positifs (${teacher.goodComments.length})`,
      20,
      yPos,
    );

    yPos += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...grayColor);

    const commentsToShow = teacher.goodComments.slice(0, 5);
    commentsToShow.forEach((comment) => {
      const lines = doc.splitTextToSize(`"${comment}"`, pageWidth - 50);
      if (yPos + lines.length * 5 > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(lines, 25, yPos);
      yPos += lines.length * 5 + 3;
    });

    if (teacher.goodComments.length > 5) {
      doc.text(
        `... et ${teacher.goodComments.length - 5} autres commentaires`,
        25,
        yPos,
      );
      yPos += 8;
    }
  }

  // Suggestions d'amélioration
  if (teacher.improveComments.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...warningColor);
    doc.text(
      `Suggestions d'amélioration (${teacher.improveComments.length})`,
      20,
      yPos,
    );

    yPos += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...grayColor);

    const suggestionsToShow = teacher.improveComments.slice(0, 5);
    suggestionsToShow.forEach((comment) => {
      const lines = doc.splitTextToSize(`"${comment}"`, pageWidth - 50);
      if (yPos + lines.length * 5 > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(lines, 25, yPos);
      yPos += lines.length * 5 + 3;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Page ${i} / ${pageCount} - EduEval - Rapport confidentiel`,
      pageWidth / 2,
      290,
      { align: "center" },
    );
  }

  // Téléchargement
  doc.save(
    `EduEval_${teacher.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}

export function exportGlobalReportToPDF(
  analytics: GlobalAnalytics,
  teachers: TeacherAnalytics[],
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const primaryColor: [number, number, number] = [79, 70, 229];
  const grayColor: [number, number, number] = [107, 114, 128];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EduEval", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Rapport global des évaluations", 20, 30);

  doc.setFontSize(10);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
    pageWidth - 20,
    30,
    { align: "right" },
  );

  // Statistiques générales
  let yPos = 55;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Vue d'ensemble", 20, yPos);

  yPos += 10;

  const statsData = [
    ["Total évaluations", analytics.totalEvaluations.toString()],
    ["Nombre d'enseignants", analytics.totalTeachers.toString()],
    ["Matières", analytics.totalCourses.toString()],
    ["Classes", analytics.totalClasses.toString()],
    ["Moyenne générale", `${analytics.overallAverage.toFixed(2)} / 8`],
  ];

  autoTable(doc, {
    startY: yPos,
    body: statsData,
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: {
      fontSize: 11,
      cellPadding: 6,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 80 },
      1: { halign: "right" },
    },
  });

  // Classement des enseignants
  yPos =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Classement des enseignants", 20, yPos);

  yPos += 5;

  const teacherData = teachers.map((t, i) => [
    (i + 1).toString(),
    t.name,
    t.courses.join(", "),
    t.evaluationCount.toString(),
    `${t.overallAverage.toFixed(2)} / 8`,
    getScoreLabel(t.overallAverage),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["#", "Nom", "Matières", "Éval.", "Score", "Appréciation"]],
    body: teacherData,
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 25, halign: "center" },
      5: { cellWidth: 30 },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Page ${i} / ${pageCount} - EduEval - Rapport confidentiel`,
      pageWidth / 2,
      290,
      { align: "center" },
    );
  }

  doc.save(
    `EduEval_Rapport_Global_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}
