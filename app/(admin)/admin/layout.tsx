/**
 * Layout pour le dashboard admin
 * Sidebar de navigation + protection auth via proxy
 */
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/admin" className="text-xl">
              Gestion de stock
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              href="/admin"
              icon={<LayoutDashboard className="h-5 w-5" />}
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/admin/products"
              icon={<Package className="h-5 w-5" />}
            >
              Produits
            </NavLink>
            <NavLink
              href="/admin/settings"
              icon={<Settings className="h-5 w-5" />}
            >
              Paramètres
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white shadow z-40 flex items-center px-4">
        <Link href="/admin" className="text-xl font-amsterdam">
          Admin
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <Package className="h-5 w-5" />
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      <Toaster />
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
