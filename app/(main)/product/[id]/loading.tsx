/**
 * Loading state pour la page produit
 */
export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />

        {/* Informations skeleton */}
        <div className="space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
