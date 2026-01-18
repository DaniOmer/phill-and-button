/**
 * Carte produit réutilisable
 * Affiche les informations d'un produit avec lien vers sa page détail
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="flex flex-col gap-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Aucune image
            </div>
          )}
          {product.is_trending && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
              Tendance
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Rupture de stock</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </span>
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
        </div>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
