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
import { Upload, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((img) => img.url) || []
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      image_urls: product?.images?.map((img) => img.url) || [],
      is_trending: product?.is_trending ?? false,
      stock: product?.stock ?? 0,
      category: product?.category ?? "",
    },
  });

  // Synchroniser imageUrls quand le produit change
  useEffect(() => {
    if (product?.images) {
      const urls = product.images.map((img) => img.url);
      setImageUrls(urls);
      setValue("image_urls", urls);
    }
  }, [product, setValue]);

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

    console.log("Submitting with images:", imageUrls.length, imageUrls);

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
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          throw new Error(
            `Format non supporté pour ${file.name}. Utilisez JPG, PNG ou WebP.`
          );
        }

        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} dépasse 5MB`);
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
                contentType: file.type,
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
        console.log("Before update - Current images:", currentUrls.length);
        console.log("Uploaded images:", uploadedUrls.length);
        console.log("New total images:", newImageUrls.length);

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

          {/* Prix et Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="25000"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="10"
              />
              {errors.stock && (
                <p className="text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Ex: Vestes, Pantalons, etc."
            />
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
                        JPG, PNG ou WebP. Max 5MB par image. Maximum 10 images.
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
    </form>
  );
}
