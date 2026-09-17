import type { MetadataRoute } from "next";
import { serverTrpc } from "@/lib/trpc/server";
import { SITE_URL } from "@/lib/site";
import { MAX_PAGE_SIZE } from "@/lib/pagination";

async function fetchAllProductIds() {
  const first = await serverTrpc.products.getAll({ page: 1, limit: MAX_PAGE_SIZE });
  let items = first.items;
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await serverTrpc.products.getAll({ page, limit: MAX_PAGE_SIZE });
    items = items.concat(next.items);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/store`, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const products = await fetchAllProductIds();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    // En cas d'échec DB, on renvoie au moins les routes statiques.
    return staticRoutes;
  }
}
