// B&L Motorcycles Ltd - ProductCard Component (Updated for Local Images)
import { useState } from 'react'

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Get all available image URLs
  const imageUrls = [
    product.image_url_1,
    product.image_url_2,
    product.image_url_3,
    product.image_url_4,
    product.image_url_5
  ].filter(url => url && url.trim() !== '')

  // Get the current image URL
  const getCurrentImageUrl = () => {
    if (imageUrls.length === 0) return null
    
    const url = imageUrls[currentImageIndex] || imageUrls[0]
    
    // If it's a local URL (starts with /images/), use it directly
    if (url.startsWith('/images/')) {
      return url
    }
    
    // If it's a BikeIt URL, check if we have a local version
    if (url.includes('bikeittrade.com/feeddata/')) {
      // Extract SKU from BikeIt URL
      const match = url.match(/feeddata\/([^\/]+)\//)
      if (match) {
        const sku = match[1]
        const cleanSku = sku.toLowerCase().replace('.', '').replace('-', '').replace('_', '')
        return `/images/products/${cleanSku}.jpg`
      }
    }
    
    // Fallback to original URL
    return url
  }

  const currentImageUrl = getCurrentImageUrl()
  const hasRealImage = currentImageUrl && !imageError

  // Handle image navigation
  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
      setImageError(false)
    }
  }

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
      setImageError(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden group">
        {/* Sale Badge */}
        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-10">
            Sale
          </div>
        )}

        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-sm font-semibold z-10">
            {product.brand}
          </div>
        )}

        {/* Real Image Badge */}
        {hasRealImage && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            Real Image
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full h-full">
          {hasRealImage ? (
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-contain bg-white"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-2">🏍️</div>
                <div className="text-gray-500 text-sm">No Image</div>
              </div>
            </div>
          )}

          {/* Image Navigation */}
          {imageUrls.length > 1 && hasRealImage && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                →
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setImageError(false)
                    }}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-sm text-amber-600 font-semibold mb-1">
          {product.brand}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* SKU */}
        <div className="text-sm text-gray-500 mb-2">
          SKU: {product.sku}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-600 mb-3">
          {product.category_name}
        </div>

        {/* Image Status */}
        {imageUrls.length > 0 && (
          <div className="text-sm text-green-600 mb-3">
            ✓ {imageUrls.length} real image{imageUrls.length > 1 ? 's' : ''} available
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                £{product.final_price?.toFixed(2)}
              </div>
              {product.trade_price && product.final_price > product.trade_price && (
                <div className="text-sm text-gray-500 line-through">
                  £{product.trade_price.toFixed(2)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                + £{product.delivery_cost?.toFixed(2)} delivery
              </div>
              <div className="text-sm font-semibold text-gray-900">
                Total: £{product.total_price?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-600">In Stock ({product.stock_level || 10} available)</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

