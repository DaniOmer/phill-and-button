import { Gem } from "lucide-react";

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
}

/**
 * En-tête réutilisable pour les pages de contenu (contact, légales, etc.).
 */
export function PageHeading({ eyebrow, title, intro }: PageHeadingProps) {
  return (
    <section className="max-w-3xl">
      <div className="flex gap-2 items-center text-sm font-medium mb-4">
        <Gem size={16} />
        <span>{eyebrow}</span>
      </div>
      <h1 className="text-3xl sm:text-5xl uppercase leading-tight mb-6">
        {title}
      </h1>
      {intro && (
        <p className="text-lg text-gray-600 leading-relaxed">{intro}</p>
      )}
    </section>
  );
}
