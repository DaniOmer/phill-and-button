"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, CartProduct } from "./types";
import {
  addItem as addItemLogic,
  updateQuantity as updateQuantityLogic,
  removeItem as removeItemLogic,
  cartTotals,
} from "./cart-logic";

const STORAGE_KEY = "phill-button-cart";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Chargement depuis localStorage après le montage (évite tout mismatch SSR).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // localStorage indisponible ou corrompu : on démarre avec un panier vide.
    }
    setHydrated(true);
  }, []);

  // Persistance à chaque changement, une fois l'hydratation faite.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore les erreurs d'écriture (mode privé, quota, etc.).
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => addItemLogic(current, product, quantity));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => updateQuantityLogic(current, id, quantity));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => removeItemLogic(current, id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { totalItems, totalPrice } = useMemo(() => cartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}
