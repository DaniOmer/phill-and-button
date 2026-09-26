import { describe, it, expect } from "vitest";
import { SIZE_ORDER, sortSizes, sizeAvailability } from "./sizes";

describe("SIZE_ORDER", () => {
  it("lists the 7 sizes from XS to 3XL in order", () => {
    expect(SIZE_ORDER).toEqual(["XS", "S", "M", "L", "XL", "XXL", "3XL"]);
  });
});

describe("sortSizes", () => {
  it("orders items by the canonical size order", () => {
    const input = [{ size: "XL" }, { size: "XS" }, { size: "M" }];
    expect(sortSizes(input).map((i) => i.size)).toEqual(["XS", "M", "XL"]);
  });

  it("does not mutate the input array", () => {
    const input = [{ size: "L" }, { size: "S" }];
    sortSizes(input);
    expect(input.map((i) => i.size)).toEqual(["L", "S"]);
  });
});

describe("sizeAvailability", () => {
  it("is in_stock when stock is positive", () => {
    expect(sizeAvailability(3, false)).toBe("in_stock");
    expect(sizeAvailability(3, true)).toBe("in_stock");
  });

  it("is on_order when out of stock but the product allows ordering", () => {
    expect(sizeAvailability(0, true)).toBe("on_order");
  });

  it("is out_of_stock when out of stock and not orderable", () => {
    expect(sizeAvailability(0, false)).toBe("out_of_stock");
  });
});
