/**
 * Formulaire de création/édition de produit
 * Utilise React Hook Form + Zod pour la validation
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import {
  productFormSchema,
  type ProductFormInput,
  type Product,
} from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Loader2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateCategoryDialog from "@/components/admin/create-category-dialog";
import {
  ALLOWED_IMAGE_CONTENT_TYPES,
  MAX_IMAGE_BYTES,
  type AllowedImageType,
} from "@/lib/upload";
import { SIZE_ORDER } from "@/lib/sizes";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((img) => img.url) || []
  );
  // Stock par taille : une clé présente = taille proposée.
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    product?.sizes?.forEach((s) => {
      initial[s.size] = s.stock;
    });
    return initial;
  });
  const [isUploading, setIsUploading] = useState(false);
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);

  // Charger les catégories
  const { data: categories = [] } = trpc.categories.getAll.useQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      image_urls: product?.images?.map((img) => img.url) || [],
      is_trending: product?.is_trending ?? false,
      available_on_order: product?.available_on_order ?? false,
      sizes: (product?.sizes ?? []) as ProductFormInput["sizes"],
      category_id: null, // Sera mis à jour dans useEffect
    },
  });

  // Trouver l'ID de la catégorie une fois les catégories chargées
  useEffect(() => {
    if (product?.category && categories.length > 0) {
      const foundCategory = categories.find(
        (cat) => cat.name === product.category
      );
      if (foundCategory) {
        setValue("category_id", foundCategory.id);
      }
    }
  }, [product?.category, categories, setValue]);

  // Suivre la valeur actuelle de category_id
  const currentCategoryId = watch("category_id");

  // Synchroniser imageUrls quand le produit change
  useEffect(() => {
    if (product?.images) {
      const urls = product.images.map((img) => img.url);
      setImageUrls(urls);
      setValue("image_urls", urls);
    }
  }, [product, setValue]);

  // Synchroniser les tailles (ordre canonique) vers le champ du formulaire
  useEffect(() => {
    const sizes = SIZE_ORDER.filter((s) => s in sizeStocks).map((s) => ({
      size: s,
      stock: sizeStocks[s],
    }));
    setValue("sizes", sizes, { shouldValidate: true });
  }, [sizeStocks, setValue]);

  const toggleSize = (size: string) => {
    setSizeStocks((current) => {
      const next = { ...current };
      if (size in next) {
        delete next[size];
      } else {
        next[size] = 0;
      }
      return next;
    });
  };

  const setSizeStock = (size: string, stock: number) => {
    setSizeStocks((current) => ({
      ...current,
      [size]: Number.isFinite(stock) && stock >= 0 ? stock : 0,
    }));
  };

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Produit créé avec succès");
      router.push("/admin/products");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Produit mis à jour");
      router.push("/admin/products");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const uploadMutation = trpc.products.uploadImage.useMutation();

  const onSubmit = async (data: ProductFormInput) => {
    // S'assurer que image_urls est à jour avec l'état local (toujours utiliser l'état local)
    const submitData = {
      ...data,
      image_urls: imageUrls, // Utiliser l'état local qui contient toutes les images
    };

    if (product) {
      updateMutation.mutate({ id: product.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Vérifier le nombre d'images (max 10)
    if (imageUrls.length + files.length > 10) {
      toast.error("Maximum 10 images par produit");
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Vérifier le type
        if (
          !ALLOWED_IMAGE_CONTENT_TYPES.includes(file.type as AllowedImageType)
        ) {
          throw new Error(
            `Format non supporté pour ${file.name}. Utilisez JPG, PNG ou WebP.`
          );
        }

        // Vérifier la taille (10MB max)
        if (file.size > MAX_IMAGE_BYTES) {
          throw new Error(`${file.name} dépasse 10MB`);
        }

        // Convertir en base64
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(",")[1];
              const result = await uploadMutation.mutateAsync({
                fileName: file.name,
                fileBase64: base64,
                contentType: file.type as AllowedImageType,
              });
              resolve(result.url);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Utiliser une fonction de mise à jour pour éviter les problèmes de closure
      setImageUrls((currentUrls) => {
        const newImageUrls = [...currentUrls, ...uploadedUrls];

        // Mettre à jour le formulaire avec les nouvelles URLs
        setValue("image_urls", newImageUrls);

        toast.success(
          `${uploadedUrls.length} image(s) uploadée(s). Total: ${newImageUrls.length}`
        );

        return newImageUrls;
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setValue("image_urls", newImageUrls);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === imageUrls.length - 1)
    ) {
      return;
    }

    const newImageUrls = [...imageUrls];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newImageUrls[index], newImageUrls[targetIndex]] = [
      newImageUrls[targetIndex],
      newImageUrls[index],
    ];
    setImageUrls(newImageUrls);
    setValue("image_urls", newImageUrls);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? "Modifier le produit" : "Nouveau produit"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nom du produit"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description du produit"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label htmlFor="price">Prix (FCFA) *</Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="25000"
              className="max-w-xs"
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Tailles & stock */}
          <div className="space-y-3">
            <Label>Tailles &amp; stock</Label>
            <div className="space-y-2">
              {SIZE_ORDER.map((size) => {
                const enabled = size in sizeStocks;
                return (
                  <div key={size} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSize(size)}
                      aria-pressed={enabled}
                      className={`w-14 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        enabled
                          ? "border-primary bg-primary text-primary-foreground"
                          : "text-gray-600 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                    {enabled ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={sizeStocks[size]}
                          onChange={(e) =>
                            setSizeStock(size, e.target.valueAsNumber)
                          }
                          className="w-28"
                          placeholder="Stock"
                        />
                        <span className="text-sm text-gray-500">en stock</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Non proposée</span>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.sizes && (
              <p className="text-sm text-red-600">
                {errors.sizes.message as string}
              </p>
            )}
          </div>

          {/* Disponible sur commande */}
          <div className="flex items-center gap-2">
            <input
              id="available_on_order"
              type="checkbox"
              {...register("available_on_order")}
              className="h-4 w-4"
            />
            <Label htmlFor="available_on_order" className="cursor-pointer">
              Disponible sur commande (les tailles en rupture restent
              commandables)
            </Label>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category_id">Catégorie</Label>
            <div className="flex gap-2">
              <Select
                value={currentCategoryId ?? undefined}
                onValueChange={(value) => {
                  // Convertir "__none__" en null, sinon utiliser la valeur
                  setValue("category_id", value === "__none__" ? null : value);
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Aucune catégorie</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setCreateCategoryDialogOpen(true)}
                title="Créer une nouvelle catégorie"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.category_id && (
              <p className="text-sm text-red-600">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images ({imageUrls.length}/10)</Label>
            <div className="space-y-4">
              {/* Grille d'images */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay avec contrôles */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0}
                            className="bg-white/90 hover:bg-white text-gray-900 rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Déplacer vers le haut"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded p-1"
                            aria-label="Supprimer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "down")}
                            disabled={index === imageUrls.length - 1}
                            className="bg-white/90 hover:bg-white text-gray-900 rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Déplacer vers le bas"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Numéro d'ordre */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton d'upload */}
              {imageUrls.length < 10 && (
                <label className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                    multiple
                  />
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">
                        Cliquez pour ajouter des images
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        JPG, PNG ou WebP. Max 10MB par image. Maximum 10 images.
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
            {errors.image_urls && (
              <p className="text-sm text-red-600">
                {errors.image_urls.message}
              </p>
            )}
          </div>

          {/* Tendance */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_trending"
              {...register("is_trending")}
              className="rounded"
            />
            <Label htmlFor="is_trending">Produit tendance</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={
            isSubmitting || createMutation.isPending || updateMutation.isPending
          }
        >
          {(isSubmitting ||
            createMutation.isPending ||
            updateMutation.isPending) && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {product ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>

      {/* Modale de création de catégorie */}
      <CreateCategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
        onSuccess={(categoryId) => {
          // Sélectionner automatiquement la nouvelle catégorie
          setValue("category_id", categoryId);
        }}
      />
    </form>
  );
}
