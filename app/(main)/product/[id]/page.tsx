import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TRPCError } from "@trpc/server";
import { serverTrpc } from "@/lib/trpc/server";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ProductImageCarousel from "@/components/public/product-image-carousel";
import ProductPurchase from "@/components/public/product-purchase";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export const revalidate = 300; // ISR - revalidation toutes les 5 minutes

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await serverTrpc.products.getById({ id });
    return product;
  } catch (error) {
    // Seul un produit réellement introuvable donne un 404 ;
    // toute autre erreur remonte vers error.tsx.
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produit introuvable" };
  }

  const description =
    product.description?.slice(0, 160) ||
    `${product.name} — ${formatPrice(product.price)} chez Phill & Button.`;
  const image = product.images?.[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Retour */}
      <Link
        href="/store"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la boutique
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="relative">
          <ProductImageCarousel
            images={product.images?.map((img) => img.url) || []}
            autoPlay={false}
            showControls={true}
            className="aspect-[3/4]"
            alt={product.name}
          />
          {product.is_trending && (
            <Badge className="absolute top-4 left-4 z-20">Tendance</Badge>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {product.category && (
            <Badge variant="secondary">{product.category}</Badge>
          )}

          <h1 className="text-3xl lg:text-4xl">{product.name}</h1>

          <p className="text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <div className="prose prose-gray max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {/* Tailles, disponibilité, ajout au panier & commande WhatsApp */}
          <ProductPurchase
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0]?.url ?? null,
              sizes: product.sizes,
              availableOnOrder: product.available_on_order,
            }}
          />
        </div>
      </div>
    </div>
  );
}
