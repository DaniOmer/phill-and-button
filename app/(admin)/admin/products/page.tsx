/**
 * Page liste des produits admin
 * Affiche un tableau avec actions CRUD
 */
"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Star, StarOff, Package } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminProductsPage() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.getAll.useQuery();

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Produit supprimé");
      utils.products.getAll.invalidate();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const toggleTrendingMutation = trpc.products.toggleTrending.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.is_trending
          ? "Produit ajouté aux tendances"
          : "Produit retiré des tendances"
      );
      utils.products.getAll.invalidate();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {products && products.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="secondary">{product.category}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {product.stock === 0 ? (
                      <span className="text-red-600">Rupture</span>
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell>
                    {product.is_trending && (
                      <Badge className="bg-yellow-500">Tendance</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleTrendingMutation.mutate({ id: product.id })
                        }
                        disabled={toggleTrendingMutation.isPending}
                        title={
                          product.is_trending
                            ? "Retirer des tendances"
                            : "Ajouter aux tendances"
                        }
                      >
                        {product.is_trending ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer ce produit ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Le produit sera
                              définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteMutation.mutate({ id: product.id })
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucun produit pour le moment</p>
          <Button asChild className="mt-4">
            <Link href="/admin/products/new">Créer votre premier produit</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
