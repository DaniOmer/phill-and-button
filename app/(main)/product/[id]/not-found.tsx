/**
 * Page 404 pour un produit non trouvé
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-amsterdam mb-4">Produit non trouvé</h1>
      <p className="text-gray-600 mb-8">
        Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
      </p>
      <Button asChild>
        <Link href="/store" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>
      </Button>
    </div>
  );
}
