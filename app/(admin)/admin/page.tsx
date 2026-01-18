/**
 * Page principale du dashboard admin
 * Affiche les statistiques et un résumé
 */
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, AlertTriangle, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createServerSupabaseClient();

  // Compter les produits
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Compter les produits tendance
  const { count: trendingProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_trending", true);

  // Compter les produits en rupture
  const { count: outOfStock } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("stock", 0);

  return {
    totalProducts: totalProducts ?? 0,
    trendingProducts: trendingProducts ?? 0,
    outOfStock: outOfStock ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits Tendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trendingProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rupture de stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.outOfStock}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Voir tous les produits</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/products/new">Ajouter un produit</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">Voir le site</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
