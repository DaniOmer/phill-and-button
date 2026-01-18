"use client";

import Link from "next/link";
import { Gem } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import ProductCard from "../productCard";

const TrendingProducts = () => {
  const { data: products, isLoading } = trpc.products.getTrending.useQuery();

  return (
    <section className="mt-10">
      <div className="flex gap-2 items-center mb-4">
        <Gem size={16} />
        <span>Tendances</span>
      </div>
      <div className="flex justify-between items-center mb-12">
        <h2 className="font-medium text-2xl uppercase">
          Les tendances du moment
        </h2>
        <Link href={`/store`} className="text-sm hover:underline">
          Voir plus
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Aucun produit tendance pour le moment
        </div>
      )}
    </section>
  );
};

export default TrendingProducts;
