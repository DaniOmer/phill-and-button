/**
 * Formate un montant en FCFA avec un espace comme séparateur de milliers.
 * Déterministe (indépendant de la version d'ICU) → évite les mismatchs
 * d'hydratation SSR/CSR que peut provoquer Intl.NumberFormat.
 */
export function formatFcfa(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Montant formaté suivi de l'unité, ex: "25 000 FCFA".
 */
export function formatPrice(amount: number): string {
  return `${formatFcfa(amount)} FCFA`;
}
