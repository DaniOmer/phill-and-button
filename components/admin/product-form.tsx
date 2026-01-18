/**
 * Formulaire de création/édition de produit
 * Utilise React Hook Form + Zod pour la validation
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { productFormSchema, type ProductFormInput, type Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null
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
      image_url: product?.image_url ?? "",
      is_trending: product?.is_trending ?? false,
      stock: product?.stock ?? 0,
      category: product?.category ?? "",
    },
  });

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
    if (product) {
      updateMutation.mutate({ id: product.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPG, PNG ou WebP.");
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];

        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileBase64: base64,
          contentType: file.type,
        });

        setValue("image_url", result.url);
        setImagePreview(result.url);
        toast.success("Image uploadée");
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setValue("image_url", "");
    setImagePreview(null);
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
              <p className="text-sm text-red-600">{errors.description.message}</p>
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

          {/* Image */}
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-40">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-2">Upload</span>
                    </>
                  )}
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG ou WebP. Max 5MB.
            </p>
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
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
        >
          {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {product ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
