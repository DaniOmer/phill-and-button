/**
 * Contenu de la page boutique (client component)
 * Gère les filtres et la recherche
 */
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import ProductGrid from "@/components/public/product-grid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function StoreContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  // Récupérer les produits avec filtres
  const { data: products, isLoading } = trpc.products.getAll.useQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
  });

  // Récupérer les catégories disponibles
  const { data: categories } = trpc.products.getCategories.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nombre de résultats */}
      <p className="text-sm text-gray-500">
        {products?.length ?? 0} produit(s) trouvé(s)
      </p>

      {/* Grille de produits */}
      <ProductGrid products={products ?? []} />
    </div>
  );
}
