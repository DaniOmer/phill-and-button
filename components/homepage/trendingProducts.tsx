import Link from "next/link";
import { Gem } from "lucide-react";

import ProductCard from "../productCard";

const TrendingProducts = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
        {Array.from({ length: 6 }).map((element, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </section>
  );
};
export default TrendingProducts;
