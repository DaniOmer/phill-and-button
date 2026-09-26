/**
 * Un article dans le panier : identifié par le couple (produit + taille).
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  size: string;
  /** Stock disponible pour cette taille (au moment de l'ajout). */
  stock: number;
  /** True si la ligne est commandée « sur commande » (taille en rupture, produit commandable). */
  onOrder: boolean;
  quantity: number;
}

/**
 * Données nécessaires pour ajouter une taille de produit au panier.
 */
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  size: string;
  stock: number;
  onOrder: boolean;
}
