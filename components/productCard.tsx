/**
 * Carte produit réutilisable
 * Affiche les informations d'un produit avec lien vers sa page détail
 */
import Link from "next/link";
import type { Product } from "@/types/product";
import ProductImageCarousel from "@/components/public/product-image-carousel";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const imageUrls = product.images?.map((img) => img.url) || [];

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <ProductImageCarousel
            images={imageUrls}
            autoPlay={true}
            showControls={true}
            imageClassName="transition-transform duration-300 group-hover:scale-105"
          />
          {product.is_trending && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded z-20">
              Tendance
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-lg">
              <span className="text-white font-semibold">Rupture de stock</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </span>
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
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
