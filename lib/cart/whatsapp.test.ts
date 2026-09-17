import { describe, it, expect } from "vitest";
import { formatFcfa, buildOrderMessage, buildWhatsAppUrl } from "./whatsapp";
import type { CartItem } from "./types";

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "p1",
  name: "Chemise en lin",
  price: 25000,
  image: null,
  stock: 5,
  quantity: 1,
  ...overrides,
});

describe("formatFcfa", () => {
  it("groups thousands with a regular space", () => {
    expect(formatFcfa(25000)).toBe("25 000");
    expect(formatFcfa(80000)).toBe("80 000");
    expect(formatFcfa(500)).toBe("500");
  });
});

describe("buildOrderMessage", () => {
  it("lists each item with quantity, unit price, line total and product link", () => {
    const items = [
      item({ id: "p1", name: "Chemise en lin", price: 25000, quantity: 2 }),
      item({ id: "p2", name: "Pantalon chino", price: 30000, quantity: 1 }),
    ];

    const message = buildOrderMessage(items, "https://shop.test");

    expect(message).toBe(
      "Bonjour, je souhaite commander :\n\n" +
        "1. Chemise en lin (x2) — 25 000 FCFA/u → 50 000 FCFA\n" +
        "https://shop.test/product/p1\n\n" +
        "2. Pantalon chino (x1) — 30 000 FCFA/u → 30 000 FCFA\n" +
        "https://shop.test/product/p2\n\n" +
        "Total : 80 000 FCFA"
    );
  });

  it("strips a trailing slash from the origin", () => {
    const message = buildOrderMessage([item({ id: "p1" })], "https://shop.test/");
    expect(message).toContain("https://shop.test/product/p1");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me link with the URL-encoded message", () => {
    const url = buildWhatsAppUrl("221771234567", [item({ quantity: 1 })], "https://shop.test");
    expect(url.startsWith("https://wa.me/221771234567?text=")).toBe(true);
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("Bonjour, je souhaite commander :");
    expect(text).toContain("Total : 25 000 FCFA");
  });
});
