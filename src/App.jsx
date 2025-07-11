import { useState } from 'react'
import { Header } from './components/Header'
import { CategoryFilter } from './components/CategoryFilter'
import { ProductGrid } from './components/ProductGrid'
// Using live Supabase hooks for production
// import { useProducts } from './hooks/useProductsMock'
import { useProducts } from './hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Award,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import blLogo from './assets/bl-motorcycles-logo.png'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at:desc')
  const [viewMode, setViewMode] = useState('grid')
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  // Build filters object
  const filters = {
    category: selectedCategory,
    search: searchQuery,
    sortBy: sortBy.split(':')[0],
    sortOrder: sortBy.split(':')[1],
    limit: 20
  }

  const { products, loading, error } = useProducts(filters)

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
  }

  // Handle add to cart
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  // Calculate cart total
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.total_price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header 
        cartItemCount={cartItemCount}
        onSearch={handleSearch}
        onCartClick={() => setShowCart(!showCart)}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-black to-black py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <img 
              src={blLogo} 
              alt="B&L Motorcycles Ltd" 
              className="h-24 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Premium </span>
              <span className="text-amber-500">Motorcycle Parts</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your trusted source for high-quality motorcycle parts, accessories, and performance upgrades. 
              Professional service with competitive pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-amber-500 text-black text-lg px-4 py-2">
                <Truck className="w-5 h-5 mr-2" />
                Free UK Delivery
              </Badge>
              <Badge className="bg-amber-500 text-black text-lg px-4 py-2">
                <Shield className="w-5 h-5 mr-2" />
                Quality Guaranteed
              </Badge>
              <Badge className="bg-amber-500 text-black text-lg px-4 py-2">
                <Award className="w-5 h-5 mr-2" />
                Expert Service
              </Badge>
            </div>
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 py-3"
              onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our hand-picked selection of premium motorcycle parts and accessories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.is_featured).slice(0, 4).map((product) => (
              <Card key={product.id} className="bg-black border-amber-500/20 hover:border-amber-500/40 transition-all">
                <CardContent className="p-4">
                  <div className="aspect-square bg-black rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-6xl">🏍️</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-amber-500 font-medium">{product.brand}</p>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{product.short_description}</p>
                    <div className="flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-lg font-bold text-amber-500">
                            £{product.sale_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            £{product.retail_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-amber-500">
                          £{product.final_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      + £{product.delivery_cost.toFixed(2)} delivery
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-black"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Shop Section */}
      <section id="shop" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Shop All Products</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse our complete range of motorcycle parts and accessories
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-black rounded-lg p-6 sticky top-24">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                onAddToCart={handleAddToCart}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">About B&L Motorcycles</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              B&L Motorcycles Ltd has been serving the motorcycle community with premium parts and accessories. 
              We pride ourselves on offering high-quality products at competitive prices, backed by expert knowledge 
              and exceptional customer service. Whether you're looking for performance upgrades, maintenance parts, 
              or accessories, we have everything you need to keep your motorcycle running at its best.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Quality Products</h3>
                <p className="text-gray-400">Only the finest motorcycle parts from trusted brands</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
                <p className="text-gray-400">Quick and reliable shipping across the UK</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-gray-400">Professional advice from motorcycle enthusiasts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
              <p className="text-gray-400">
                Have questions? Need advice? Our team is here to help.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-black border-gray-800">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Phone</h3>
                  <p className="text-gray-400">0121 123 4567</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black border-gray-800">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <p className="text-gray-400">info@blmotorcycles.co.uk</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black border-gray-800">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Location</h3>
                  <p className="text-gray-400">Birmingham, UK</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <img 
              src={blLogo} 
              alt="B&L Motorcycles Ltd" 
              className="h-12 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              © 2025 B&L Motorcycles Ltd. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Premium motorcycle parts and accessories with professional service.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-black border-l border-gray-800 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                ×
              </Button>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-black rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{item.brand}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-amber-500 font-bold">
                          £{(item.total_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-amber-500 font-bold text-xl">
                      £{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

