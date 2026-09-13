import { afterEach, describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("siteUrl", () => {
  it("prefers the configured production URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://shop.example.com/path";
    expect(siteUrl("https://preview.example.com")).toBe(
      "https://shop.example.com",
    );
  });

  it("uses the request origin when no production URL is configured", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("rejects unsafe URL protocols", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "javascript:alert(1)";
    expect(siteUrl("https://preview.example.com")).toBe(
      "http://localhost:3000",
    );
  });
});
