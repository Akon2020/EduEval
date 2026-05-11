import type { Metadata } from "next";
import { DocsClient } from "./docs-client";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guide complet pour utiliser EduEval et structurer vos fichiers CSV.",
};

export default function DocsPage() {
  return <DocsClient />;
}
