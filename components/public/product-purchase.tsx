"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { sortSizes, sizeAvailability } from "@/lib/sizes";
import { buildWhatsAppUrl } from "@/lib/cart/whatsapp";
import type { ProductSizeStock } from "@/types/product";

interface ProductPurchaseProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    sizes: ProductSizeStock[];
    availableOnOrder: boolean;
  };
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = sortSizes(product.sizes);
  const selected = sizes.find((s) => s.size === selectedSize) ?? null;
  const availability = selected
    ? sizeAvailability(selected.stock, product.availableOnOrder)
    : null;
  const onOrder = availability === "on_order";
  const canOrder = availability === "in_stock" || availability === "on_order";

  const buildCartItem = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size: selected!.size,
    stock: selected!.stock,
    onOrder,
  });

  const handleAddToCart = () => {
    if (!selected || !canOrder) return;
    addItem(buildCartItem(), 1);
    toast.success(
      onOrder
        ? `${product.name} (${selected.size}) ajouté — sur commande`
        : `${product.name} (${selected.size}) ajouté au panier`
    );
    openCart();
  };

  const handleWhatsAppOrder = () => {
    if (!selected || !canOrder) return;
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const url = buildWhatsAppUrl(
      phoneNumber,
      [{ ...buildCartItem(), quantity: 1 }],
      window.location.origin
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (sizes.length === 0) {
    return (
      <p className="text-sm text-red-600">
        Aucune taille disponible pour ce produit.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Sélecteur de tailles */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Taille</span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const state = sizeAvailability(s.stock, product.availableOnOrder);
            const disabled = state === "out_of_stock";
            const isSelected = s.size === selectedSize;
            return (
              <button
                key={s.size}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedSize(s.size)}
                aria-pressed={isSelected}
                className={cn(
                  "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  isSelected && "border-primary bg-primary text-primary-foreground",
                  !isSelected && !disabled && "hover:border-primary",
                  disabled &&
                    "cursor-not-allowed border-dashed text-gray-300 line-through"
                )}
                title={
                  state === "on_order"
                    ? "Sur commande"
                    : state === "out_of_stock"
                    ? "Épuisé"
                    : `${s.stock} en stock`
                }
              >
                {s.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* État de la taille choisie */}
      {selected && (
        <p className="text-sm">
          {availability === "in_stock" && (
            <span className="text-green-600">{selected.stock} en stock</span>
          )}
          {availability === "on_order" && (
            <span className="text-amber-600">
              Sur commande (rupture temporaire)
            </span>
          )}
          {availability === "out_of_stock" && (
            <span className="text-red-600">Épuisé</span>
          )}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleAddToCart}
          disabled={!selected || !canOrder}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          {!selected
            ? "Choisir une taille"
            : onOrder
            ? "Ajouter (sur commande)"
            : "Ajouter au panier"}
        </Button>
        {selected && canOrder && (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-green-600 text-green-700 hover:bg-green-50"
            onClick={handleWhatsAppOrder}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Commander via WhatsApp
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {product.availableOnOrder
          ? "Les tailles en rupture restent commandables sur commande."
          : "Sélectionnez une taille pour commander."}
      </p>
    </div>
  );
}
