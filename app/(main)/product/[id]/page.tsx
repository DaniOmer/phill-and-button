/**
 * Page de détail d'un produit
 * Affiche toutes les informations et le bouton WhatsApp pour commander
 */
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Package } from "lucide-react";
import type { Product } from "@/types/product";

export const revalidate = 300; // ISR - revalidation toutes les 5 minutes

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  // Générer le lien WhatsApp
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par ${product.name} au prix de ${formatPrice(product.price)}`
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
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Aucune image disponible
            </div>
          )}
          {product.is_trending && (
            <Badge className="absolute top-4 left-4">Tendance</Badge>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {product.category && (
            <Badge variant="secondary">{product.category}</Badge>
          )}

          <h1 className="text-3xl lg:text-4xl font-amsterdam">{product.name}</h1>

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
              <span className="text-green-600">
                {product.stock} en stock
              </span>
            ) : (
              <span className="text-red-600">Rupture de stock</span>
            )}
          </div>

          {/* Bouton WhatsApp */}
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            disabled={product.stock === 0}
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

          <p className="text-sm text-gray-500">
            Cliquez pour ouvrir WhatsApp avec un message pré-rempli
          </p>
        </div>
      </div>
    </div>
  );
}
