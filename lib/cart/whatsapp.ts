import type { CartItem } from "./types";
import { cartTotals } from "./cart-logic";
import { formatFcfa } from "@/lib/format";

// Re-exporté pour compatibilité : la source unique vit dans lib/format.
export { formatFcfa };

/**
 * Construit le message de commande (texte brut, non encodé) listant chaque
 * article avec quantité, prix unitaire, sous-total, lien produit, et le total.
 */
export function buildOrderMessage(items: CartItem[], origin: string): string {
  const baseUrl = origin.replace(/\/$/, "");

  const lines = items.map((item, index) => {
    const lineTotal = item.price * item.quantity;
    const onOrder = item.onOrder ? " (sur commande)" : "";
    return (
      `${index + 1}. ${item.name} — Taille ${item.size}${onOrder} (x${item.quantity}) — ` +
      `${formatFcfa(item.price)} FCFA/u → ${formatFcfa(lineTotal)} FCFA\n` +
      `${baseUrl}/product/${item.id}`
    );
  });

  const { totalPrice } = cartTotals(items);

  return (
    "Bonjour, je souhaite commander :\n\n" +
    lines.join("\n\n") +
    `\n\nTotal : ${formatFcfa(totalPrice)} FCFA`
  );
}

/**
 * Construit le lien wa.me avec le message de commande encodé.
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  items: CartItem[],
  origin: string
): string {
  const text = encodeURIComponent(buildOrderMessage(items, origin));
  return `https://wa.me/${phoneNumber}?text=${text}`;
}
