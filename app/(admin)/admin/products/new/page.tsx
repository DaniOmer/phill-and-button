/**
 * Page création d'un nouveau produit
 */
import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
