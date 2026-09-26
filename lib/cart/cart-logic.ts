import type { CartItem, CartProduct } from "./types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Quantité maximale pour une ligne : illimitée si « sur commande », sinon le stock. */
const maxQuantity = (line: { stock: number; onOrder: boolean }): number =>
  line.onOrder ? Infinity : line.stock;

const sameLine = (
  a: { id: string; size: string },
  b: { id: string; size: string }
): boolean => a.id === b.id && a.size === b.size;

/**
 * Ajoute une taille de produit au panier (ou incrémente la ligne existante).
 * - Ligne identifiée par le couple (id, size).
 * - Plafonnée au stock, sauf ligne « sur commande » (illimitée).
 * - Une taille en rupture non commandable n'est pas ajoutée.
 */
export function addItem(
  items: CartItem[],
  product: CartProduct,
  quantity = 1
): CartItem[] {
  const existing = items.find((i) => sameLine(i, product));
  const currentQty = existing?.quantity ?? 0;
  const nextQty = clamp(currentQty + quantity, 0, maxQuantity(product));

  if (nextQty < 1) {
    return items;
  }

  if (existing) {
    return items.map((i) =>
      sameLine(i, product) ? { ...i, quantity: nextQty } : i
    );
  }

  return [...items, { ...product, quantity: nextQty }];
}

/**
 * Définit la quantité d'une ligne (id, size), bornée entre 1 et son maximum.
 */
export function updateQuantity(
  items: CartItem[],
  id: string,
  size: string,
  quantity: number
): CartItem[] {
  return items.map((i) =>
    sameLine(i, { id, size })
      ? { ...i, quantity: clamp(quantity, 1, maxQuantity(i)) }
      : i
  );
}

/**
 * Retire une ligne (id, size) du panier.
 */
export function removeItem(
  items: CartItem[],
  id: string,
  size: string
): CartItem[] {
  return items.filter((i) => !sameLine(i, { id, size }));
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
