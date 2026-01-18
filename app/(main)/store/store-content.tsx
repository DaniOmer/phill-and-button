"use client";

import { useState, useEffect } from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: products, isFetching } = trpc.products.getAll.useQuery(
    {
      search: search || undefined,
      category: category === "all" ? undefined : category,
    },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  const { data: categories } = trpc.products.getCategories.useQuery();

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        {isFetching && search && (
          <span className="ml-2 text-gray-400">(recherche en cours...)</span>
        )}
      </p>

      {/* Grille de produits */}
      {isFetching && !products ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={products ?? []} />
      )}
    </div>
  );
}
