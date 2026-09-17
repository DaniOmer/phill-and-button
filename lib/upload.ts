/**
 * Content-types d'images autorisés à l'upload (source unique, réutilisée
 * par le schéma Zod côté serveur et la validation côté client).
 */
export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

/**
 * Extension de fichier associée à chaque content-type autorisé.
 */
export const ALLOWED_IMAGE_TYPES: Record<AllowedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Taille maximale d'une image (10 Mo). */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Renvoie l'extension pour un content-type autorisé, ou null sinon.
 */
export function extensionForContentType(contentType: string): string | null {
  return ALLOWED_IMAGE_TYPES[contentType as AllowedImageType] ?? null;
}

/**
 * Construit un nom d'objet storage sûr à partir d'un UUID et de l'extension
 * déduite du content-type. Le nom fourni par le client est volontairement
 * ignoré pour éviter toute injection de chemin.
 */
export function buildImageObjectName(contentType: string, uuid: string): string {
  const ext = extensionForContentType(contentType);
  if (!ext) {
    throw new Error(`Type de fichier non supporté : ${contentType}`);
  }
  return `${uuid}.${ext}`;
}
