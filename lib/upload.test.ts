import { describe, it, expect } from "vitest";
import {
  extensionForContentType,
  buildImageObjectName,
  MAX_IMAGE_BYTES,
} from "./upload";

describe("extensionForContentType", () => {
  it("returns the extension for allowed image types", () => {
    expect(extensionForContentType("image/jpeg")).toBe("jpg");
    expect(extensionForContentType("image/png")).toBe("png");
    expect(extensionForContentType("image/webp")).toBe("webp");
  });

  it("returns null for disallowed types", () => {
    expect(extensionForContentType("image/gif")).toBeNull();
    expect(extensionForContentType("application/pdf")).toBeNull();
    expect(extensionForContentType("text/html")).toBeNull();
  });
});

describe("buildImageObjectName", () => {
  it("builds a name from the uuid and the type extension, ignoring client input", () => {
    expect(buildImageObjectName("image/png", "abc-123")).toBe("abc-123.png");
  });

  it("throws for an unsupported content type", () => {
    expect(() => buildImageObjectName("image/gif", "abc-123")).toThrow();
  });
});

describe("MAX_IMAGE_BYTES", () => {
  it("is 10 MB", () => {
    expect(MAX_IMAGE_BYTES).toBe(10 * 1024 * 1024);
  });
});
