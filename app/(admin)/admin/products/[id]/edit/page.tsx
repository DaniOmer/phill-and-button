/**
 * Page d'édition d'un produit existant
 */
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/product-form";
import type { Product } from "@/types/product";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        id,
        url,
        order_index,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  // Transformer les données pour avoir images triées par order_index
  return {
    ...data,
    images: ((data as any).product_images || [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((img: any) => ({
        id: img.id,
        product_id: data.id,
        url: img.url,
        order_index: img.order_index,
        created_at: img.created_at,
      })),
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Modifier le produit</h1>
      <ProductForm product={product} />
    </div>
  );
}
