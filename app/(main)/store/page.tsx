/**
 * Page Boutique - Affiche tous les produits
 * Inclut la recherche et les filtres par catégorie
 */
import { Suspense } from "react";
import StoreContent from "./store-content";

export const revalidate = 60; // ISR - revalidation toutes les 60 secondes

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-amsterdam text-center mb-8">Notre Boutique</h1>
      <Suspense fallback={<StoreLoading />}>
        <StoreContent />
      </Suspense>
    </div>
  );
}

function StoreLoading() {
  return (
    <div className="space-y-6">
      {/* Skeleton pour les filtres */}
      <div className="flex gap-4 mb-8">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      {/* Skeleton pour la grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
