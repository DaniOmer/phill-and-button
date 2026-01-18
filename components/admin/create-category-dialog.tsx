"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (categoryId: string) => void;
}

export default function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const utils = trpc.useUtils();

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: (newCategory) => {
      // Réinitialiser le formulaire
      setName("");
      setSlug("");
      // Fermer la modale
      onOpenChange(false);
      // Rafraîchir la liste des catégories
      utils.categories.getAll.invalidate();
      // Appeler le callback si fourni
      if (onSuccess) {
        onSuccess(newCategory.id);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    createMutation.mutate({
      name: name.trim(),
      slug: slug.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle catégorie de produits. Le slug sera généré
            automatiquement si non fourni.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vestes, Pantalons, etc."
                required
                minLength={2}
                disabled={createMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optionnel)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: vestes, pantalons (généré automatiquement si vide)"
                disabled={createMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Le slug est utilisé pour les URLs. Il sera généré
                automatiquement à partir du nom si non fourni.
              </p>
            </div>
            {createMutation.error && (
              <p className="text-sm text-red-600">
                {createMutation.error.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
