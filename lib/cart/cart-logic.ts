import type { CartItem, CartProduct } from "./types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Ajoute un produit au panier (ou incrémente sa quantité), plafonné au stock.
 * Un produit en rupture (stock 0) n'est pas ajouté. Ne mute pas l'entrée.
 */
export function addItem(
  items: CartItem[],
  product: CartProduct,
  quantity = 1
): CartItem[] {
  const existing = items.find((i) => i.id === product.id);
  const currentQty = existing?.quantity ?? 0;
  const nextQty = clamp(currentQty + quantity, 0, product.stock);

  if (nextQty < 1) {
    return items;
  }

  if (existing) {
    return items.map((i) =>
      i.id === product.id ? { ...i, quantity: nextQty } : i
    );
  }

  return [...items, { ...product, quantity: nextQty }];
}

/**
 * Définit la quantité d'un article, bornée entre 1 et son stock.
 */
export function updateQuantity(
  items: CartItem[],
  id: string,
  quantity: number
): CartItem[] {
  return items.map((i) =>
    i.id === id ? { ...i, quantity: clamp(quantity, 1, i.stock) } : i
  );
}

/**
 * Retire un article du panier.
 */
export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((i) => i.id !== id);
}

/**
 * Nombre total d'articles et prix total du panier.
 */
export function cartTotals(items: CartItem[]): {
  totalItems: number;
  totalPrice: number;
} {
  return items.reduce(
    (acc, i) => ({
      totalItems: acc.totalItems + i.quantity,
      totalPrice: acc.totalPrice + i.price * i.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}
