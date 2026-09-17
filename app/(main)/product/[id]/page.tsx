import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TRPCError } from "@trpc/server";
import { serverTrpc } from "@/lib/trpc/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Package } from "lucide-react";
import ProductImageCarousel from "@/components/public/product-image-carousel";
import AddToCartButton from "@/components/public/add-to-cart-button";
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

  // Générer le lien WhatsApp
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par ${product.name} au prix de ${formatPrice(
      product.price
    )}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" />
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} en stock</span>
            ) : (
              <span className="text-red-600">Rupture de stock</span>
            )}
          </div>

          {/* Actions : ajout au panier + commande directe WhatsApp */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url ?? null,
                stock: product.stock,
              }}
              className="w-full sm:w-auto"
            />
            {product.stock > 0 && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-green-600 text-green-700 hover:bg-green-50"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Commander via WhatsApp
                </a>
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {product.stock > 0
              ? "Ajoutez au panier ou commandez directement ce produit via WhatsApp"
              : "Ce produit est actuellement en rupture de stock"}
          </p>
        </div>
      </div>
    </div>
  );
}
