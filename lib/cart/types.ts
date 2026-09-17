/**
 * Un article dans le panier (données minimales nécessaires côté client).
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
}

/**
 * Données produit nécessaires pour ajouter un article au panier.
 */
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}
