import { describe, it, expect } from "vitest";
import {
  normalizePagination,
  totalPages,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "./pagination";

describe("normalizePagination", () => {
  it("applies defaults when nothing is provided", () => {
    expect(normalizePagination()).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      skip: 0,
    });
  });

  it("computes skip from page and limit", () => {
    expect(normalizePagination({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
    });
  });

  it("clamps limit to the maximum page size", () => {
    expect(normalizePagination({ limit: 9999 }).limit).toBe(MAX_PAGE_SIZE);
  });

  it("forces a minimum page of 1", () => {
    expect(normalizePagination({ page: 0 }).page).toBe(1);
    expect(normalizePagination({ page: -5 }).page).toBe(1);
  });

  it("forces a minimum limit of 1", () => {
    expect(normalizePagination({ limit: 0 }).limit).toBe(1);
  });
});

describe("totalPages", () => {
  it("rounds up", () => {
    expect(totalPages(25, 10)).toBe(3);
    expect(totalPages(20, 10)).toBe(2);
  });

  it("is at least 1 even for an empty result set", () => {
    expect(totalPages(0, 10)).toBe(1);
  });
});
