import { describe, it, expect } from "vitest";
import {
  addItem,
  updateQuantity,
  removeItem,
  cartTotals,
} from "./cart-logic";
import type { CartItem, CartProduct } from "./types";

const product = (overrides: Partial<CartProduct> = {}): CartProduct => ({
  id: "p1",
  name: "Chemise en lin",
  price: 25000,
  image: "https://img/1.jpg",
  stock: 5,
  ...overrides,
});

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "p1",
  name: "Chemise en lin",
  price: 25000,
  image: "https://img/1.jpg",
  stock: 5,
  quantity: 1,
  ...overrides,
});

describe("addItem", () => {
  it("adds a new product with the requested quantity", () => {
    const result = addItem([], product(), 2);
    expect(result).toEqual([item({ quantity: 2 })]);
  });

  it("increments quantity when the product is already in the cart", () => {
    const result = addItem([item({ quantity: 2 })], product(), 1);
    expect(result).toEqual([item({ quantity: 3 })]);
  });

  it("caps the quantity at the available stock", () => {
    const result = addItem([item({ quantity: 4, stock: 5 })], product({ stock: 5 }), 10);
    expect(result[0].quantity).toBe(5);
  });

  it("does not add a product that is out of stock", () => {
    const result = addItem([], product({ stock: 0 }), 1);
    expect(result).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const original = [item({ quantity: 1 })];
    addItem(original, product(), 1);
    expect(original[0].quantity).toBe(1);
  });
});

describe("updateQuantity", () => {
  it("sets the quantity for an existing item", () => {
    const result = updateQuantity([item({ quantity: 1 })], "p1", 3);
    expect(result[0].quantity).toBe(3);
  });

  it("caps the quantity at the available stock", () => {
    const result = updateQuantity([item({ quantity: 1, stock: 5 })], "p1", 99);
    expect(result[0].quantity).toBe(5);
  });

  it("clamps quantity to a minimum of 1", () => {
    const result = updateQuantity([item({ quantity: 3 })], "p1", 0);
    expect(result[0].quantity).toBe(1);
  });

  it("leaves other items untouched", () => {
    const items = [item({ id: "p1", quantity: 1 }), item({ id: "p2", quantity: 2 })];
    const result = updateQuantity(items, "p1", 4);
    expect(result.find((i) => i.id === "p2")?.quantity).toBe(2);
  });
});

describe("removeItem", () => {
  it("removes the matching item", () => {
    const items = [item({ id: "p1" }), item({ id: "p2" })];
    const result = removeItem(items, "p1");
    expect(result).toEqual([item({ id: "p2" })]);
  });
});

describe("cartTotals", () => {
  it("computes total item count and total price", () => {
    const items = [
      item({ id: "p1", price: 25000, quantity: 2 }),
      item({ id: "p2", price: 30000, quantity: 1 }),
    ];
    expect(cartTotals(items)).toEqual({ totalItems: 3, totalPrice: 80000 });
  });

  it("returns zeros for an empty cart", () => {
    expect(cartTotals([])).toEqual({ totalItems: 0, totalPrice: 0 });
  });
});
