/**
 * Tailles disponibles, dans l'ordre canonique d'affichage.
 */
export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

export type Size = (typeof SIZE_ORDER)[number];

/**
 * Trie une liste d'éléments portant une `size` selon l'ordre canonique.
 * Les tailles inconnues sont renvoyées en fin de liste. Ne mute pas l'entrée.
 */
export function sortSizes<T extends { size: string }>(items: T[]): T[] {
  const rank = (size: string) => {
    const index = SIZE_ORDER.indexOf(size as Size);
    return index === -1 ? SIZE_ORDER.length : index;
  };
  return [...items].sort((a, b) => rank(a.size) - rank(b.size));
}

export type Availability = "in_stock" | "out_of_stock" | "on_order";

/**
 * État de disponibilité d'une taille selon son stock et la possibilité de
 * commande du produit.
 */
export function sizeAvailability(
  stock: number,
  availableOnOrder: boolean
): Availability {
  if (stock > 0) return "in_stock";
  return availableOnOrder ? "on_order" : "out_of_stock";
}
