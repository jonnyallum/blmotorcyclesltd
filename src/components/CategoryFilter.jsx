// B&L Motorcycles Ltd - Category Filter Component (Updated)
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCategories } from '../hooks/useCategories'

export function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Calculate total products across all categories
  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-white mb-4">Categories</h3>
      
      {/* All Categories */}
      <Button
        variant={!selectedCategory ? "default" : "ghost"}
        className={`w-full justify-start ${
          !selectedCategory 
            ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
            : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-800'
        }`}
        onClick={() => onCategoryChange(null)}
      >
        All Categories
        <Badge variant="secondary" className="ml-auto bg-gray-700 text-gray-300">
          {totalProducts.toLocaleString()}
        </Badge>
      </Button>

      {/* Category List */}
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              selectedCategory === category.id
                ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-800'
            }`}
            onClick={() => onCategoryChange(category.id)}
            title={category.description}
          >
            <span className="truncate">{category.name}</span>
            <Badge 
              variant="secondary" 
              className={`ml-auto ${
                selectedCategory === category.id
                  ? 'bg-black/20 text-black'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {category.count.toLocaleString()}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Category Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Products:</span>
            <span className="text-yellow-500">{totalProducts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Categories:</span>
            <span className="text-yellow-500">{categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

