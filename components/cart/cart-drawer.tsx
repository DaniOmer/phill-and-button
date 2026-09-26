"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { formatFcfa, buildWhatsAppUrl } from "@/lib/cart/whatsapp";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const handleOrder = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const url = buildWhatsAppUrl(phoneNumber, items, window.location.origin);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 sm:max-w-md"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mon panier
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Votre panier est vide</p>
            <Button variant="outline" onClick={closeCart} asChild>
              <Link href="/store">Découvrir la boutique</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-20 w-16 shrink-0 rounded object-cover bg-gray-100"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium leading-tight">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        aria-label={`Retirer ${item.name} (taille ${item.size})`}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Taille {item.size}</span>
                      {item.onOrder && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                          Sur commande
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatFcfa(item.price)} FCFA/u
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          disabled={!item.onOrder && item.quantity >= item.stock}
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-semibold">
                        {formatFcfa(item.price * item.quantity)} FCFA
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatFcfa(totalPrice)} FCFA</span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleOrder}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Commander via WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
              >
                Continuer mes achats
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
