import type { KbArticle } from "@/types";
import { KbCard } from "./kb-card";

// Two-column grid of knowledge base article cards.
export function KbList({
  articles,
  onEdit,
  onDelete,
}: {
  articles: KbArticle[];
  onEdit: (article: KbArticle) => void;
  onDelete: (article: KbArticle) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {articles.map((article) => (
        <KbCard
          key={article.id}
          article={article}
          onEdit={() => onEdit(article)}
          onDelete={() => onDelete(article)}
        />
      ))}
    </div>
  );
}
