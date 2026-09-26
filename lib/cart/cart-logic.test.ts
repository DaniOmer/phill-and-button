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
  size: "M",
  stock: 5,
  onOrder: false,
  ...overrides,
});

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "p1",
  name: "Chemise en lin",
  price: 25000,
  image: "https://img/1.jpg",
  size: "M",
  stock: 5,
  onOrder: false,
  quantity: 1,
  ...overrides,
});

describe("addItem", () => {
  it("adds a new product/size with the requested quantity", () => {
    const result = addItem([], product(), 2);
    expect(result).toEqual([item({ quantity: 2 })]);
  });

  it("increments quantity when the same product AND size is already present", () => {
    const result = addItem([item({ quantity: 2 })], product(), 1);
    expect(result).toEqual([item({ quantity: 3 })]);
  });

  it("keeps different sizes of the same product as separate lines", () => {
    const result = addItem(
      [item({ size: "M", quantity: 1 })],
      product({ size: "L" }),
      1
    );
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.size).sort()).toEqual(["L", "M"]);
  });

  it("caps the quantity at the size stock for in-stock lines", () => {
    const result = addItem(
      [item({ quantity: 4, stock: 5 })],
      product({ stock: 5 }),
      10
    );
    expect(result[0].quantity).toBe(5);
  });

  it("does not add an out-of-stock size that is not orderable", () => {
    const result = addItem([], product({ stock: 0, onOrder: false }), 1);
    expect(result).toEqual([]);
  });

  it("adds an out-of-stock size when the product is available on order (no cap)", () => {
    const result = addItem([], product({ stock: 0, onOrder: true }), 3);
    expect(result).toEqual([item({ stock: 0, onOrder: true, quantity: 3 })]);
  });

  it("does not cap on-order lines at stock", () => {
    const result = addItem(
      [item({ stock: 0, onOrder: true, quantity: 2 })],
      product({ stock: 0, onOrder: true }),
      5
    );
    expect(result[0].quantity).toBe(7);
  });
});

describe("updateQuantity", () => {
  it("sets the quantity for a matching (id, size) line", () => {
    const result = updateQuantity([item({ quantity: 1 })], "p1", "M", 3);
    expect(result[0].quantity).toBe(3);
  });

  it("caps at the size stock for in-stock lines", () => {
    const result = updateQuantity([item({ quantity: 1, stock: 5 })], "p1", "M", 99);
    expect(result[0].quantity).toBe(5);
  });

  it("does not cap on-order lines", () => {
    const result = updateQuantity(
      [item({ stock: 0, onOrder: true, quantity: 1 })],
      "p1",
      "M",
      50
    );
    expect(result[0].quantity).toBe(50);
  });

  it("clamps to a minimum of 1", () => {
    const result = updateQuantity([item({ quantity: 3 })], "p1", "M", 0);
    expect(result[0].quantity).toBe(1);
  });

  it("only affects the matching size", () => {
    const items = [
      item({ size: "M", quantity: 1 }),
      item({ size: "L", quantity: 2 }),
    ];
    const result = updateQuantity(items, "p1", "M", 4);
    expect(result.find((i) => i.size === "L")?.quantity).toBe(2);
  });
});

describe("removeItem", () => {
  it("removes only the matching (id, size) line", () => {
    const items = [item({ size: "M" }), item({ size: "L" })];
    const result = removeItem(items, "p1", "M");
    expect(result).toEqual([item({ size: "L" })]);
  });
});

describe("cartTotals", () => {
  it("computes total item count and total price", () => {
    const items = [
      item({ size: "M", price: 25000, quantity: 2 }),
      item({ size: "L", price: 30000, quantity: 1 }),
    ];
    expect(cartTotals(items)).toEqual({ totalItems: 3, totalPrice: 80000 });
  });

  it("returns zeros for an empty cart", () => {
    expect(cartTotals([])).toEqual({ totalItems: 0, totalPrice: 0 });
  });
});
