/** Taille de page par défaut. */
export const DEFAULT_PAGE_SIZE = 24;

/** Taille de page maximale (garde-fou contre les requêtes non bornées). */
export const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Normalise les paramètres de pagination : applique les défauts, borne la
 * taille de page et calcule l'offset (`skip`).
 */
export function normalizePagination(
  params: PaginationParams = {}
): NormalizedPagination {
  const limit = clamp(
    Math.floor(params.limit ?? DEFAULT_PAGE_SIZE),
    1,
    MAX_PAGE_SIZE
  );
  const page = Math.max(1, Math.floor(params.page ?? 1));
  return { page, limit, skip: (page - 1) * limit };
}

/**
 * Nombre total de pages pour un total d'éléments donné (au moins 1).
 */
export function totalPages(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / limit));
}
