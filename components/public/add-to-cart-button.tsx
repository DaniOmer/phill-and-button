"use client";

import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import type { CartProduct } from "@/lib/cart/types";

interface AddToCartButtonProps {
  product: CartProduct;
  className?: string;
}

export default function AddToCartButton({
  product,
  className,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
    toast.success(`${product.name} ajouté au panier`);
    openCart();
  };

  if (product.stock <= 0) {
    return (
      <Button size="lg" className={className} disabled>
        <ShoppingBag className="h-5 w-5 mr-2" />
        Indisponible
      </Button>
    );
  }

  return (
    <Button size="lg" className={className} onClick={handleAdd}>
      <ShoppingBag className="h-5 w-5 mr-2" />
      Ajouter au panier
    </Button>
  );
}
