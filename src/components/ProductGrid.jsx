// B&L Motorcycles Ltd - Product Grid Component
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Grid, List, SlidersHorizontal } from 'lucide-react'

export function ProductGrid({ 
  products, 
  loading, 
  error, 
  onAddToCart,
  sortBy,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange
}) {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-800 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-800 rounded w-48 animate-pulse" />
        </div>
        
        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-6 bg-gray-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Products</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-white font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-white">
          <h2 className="text-xl font-semibold">
            {products.length} Product{products.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-700 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-none ${
                viewMode === 'grid' 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => onViewModeChange?.('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-none ${
                viewMode === 'list' 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => onViewModeChange?.('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="created_at:desc" className="text-white hover:bg-gray-800">
                Newest First
              </SelectItem>
              <SelectItem value="created_at:asc" className="text-white hover:bg-gray-800">
                Oldest First
              </SelectItem>
              <SelectItem value="base_price:asc" className="text-white hover:bg-gray-800">
                Price: Low to High
              </SelectItem>
              <SelectItem value="base_price:desc" className="text-white hover:bg-gray-800">
                Price: High to Low
              </SelectItem>
              <SelectItem value="name:asc" className="text-white hover:bg-gray-800">
                Name: A to Z
              </SelectItem>
              <SelectItem value="name:desc" className="text-white hover:bg-gray-800">
                Name: Z to A
              </SelectItem>
              <SelectItem value="brand:asc" className="text-white hover:bg-gray-800">
                Brand: A to Z
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {products.length >= 20 && (
        <div className="text-center pt-8">
          <Button 
            variant="outline" 
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}

