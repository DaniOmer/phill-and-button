import { notFound } from "next/navigation";
import { serverTrpc } from "@/lib/trpc/server";
import ProductForm from "@/components/admin/product-form";
import type { Product } from "@/types/product";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await serverTrpc.products.getById({ id });
    return product;
  } catch (error) {
    return null;
  }
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
