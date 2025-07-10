import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Search, ShoppingCart, Menu, X, Phone, Mail, MapPin, Wrench, Zap, Shield } from 'lucide-react'
import logo from './assets/logo.png'
import './App.css'

// Navigation Component
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="B&L Motorcycles" className="h-10 w-auto logo-glow" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gold-gradient">B&L MOTORCYCLES</h1>
              <p className="text-xs text-yellow-400">PARTS & REPAIRS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                  location.pathname === item.path ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="btn-gold">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 border-t border-yellow-500/20">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-yellow-400 ${
                    location.pathname === item.path ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button className="btn-gold w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Home Page Component
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <img src={logo} alt="B&L Motorcycles" className="h-32 w-auto mx-auto mb-8 logo-glow" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gold-gradient text-shadow-gold">
            B&L MOTORCYCLES
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 font-light">
            PARTS & REPAIRS
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Your trusted partner for motorcycle parts, repairs, and maintenance. 
            Quality service with genuine parts and expert craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gold text-lg px-8 py-3">
              Shop Parts
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg px-8 py-3">
              Book Service
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gold-gradient">
            Why Choose B&L Motorcycles?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover bg-gray-800/50 border-yellow-500/20">
              <CardHeader className="text-center">
                <Wrench className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-yellow-400">Expert Repairs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Professional motorcycle repair services with years of experience and certified technicians.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover bg-gray-800/50 border-yellow-500/20">
              <CardHeader className="text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-yellow-400">Quality Parts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Genuine OEM and high-quality aftermarket parts sourced from trusted suppliers worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover bg-gray-800/50 border-yellow-500/20">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-yellow-400">Warranty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  All our work comes with comprehensive warranty coverage for your peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gold-gradient">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Phone</h3>
              <p className="text-gray-300">07881274193</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Email</h3>
              <p className="text-gray-300">brett@blmotorcyclesltd.co.uk</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Company</h3>
              <p className="text-gray-300">Company No: 14122962</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Shop Page Component
function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock products for now - will be replaced with Supabase data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Brake Pads - Front',
          price: 45.99,
          originalPrice: 30.66,
          category: 'Brakes',
          image: '/api/placeholder/300/200',
          inStock: true
        },
        {
          id: 2,
          name: 'Chain & Sprocket Kit',
          price: 89.99,
          originalPrice: 59.99,
          category: 'Transmission',
          image: '/api/placeholder/300/200',
          inStock: true
        },
        {
          id: 3,
          name: 'Oil Filter',
          price: 18.99,
          originalPrice: 12.66,
          category: 'Engine',
          image: '/api/placeholder/300/200',
          inStock: false
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gold-gradient">Motorcycle Parts Shop</h1>
          <p className="text-gray-300 mb-6">
            Browse our extensive collection of motorcycle parts and accessories
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-yellow-500/20 text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-gray-800/50 border-yellow-500/20 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="card-hover bg-gray-800/50 border-yellow-500/20">
                <div className="h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-yellow-400">{product.name}</CardTitle>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    Category: {product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-yellow-400">£{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        (Cost: £{product.originalPrice})
                      </span>
                    </div>
                    <Button 
                      className="btn-gold" 
                      disabled={!product.inStock}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Price includes £6 delivery
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Services Page Component
function ServicesPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gold-gradient">Our Services</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Motorcycle Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Complete motorcycle repair services including engine work, electrical repairs, and general maintenance.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Parts Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Professional installation of motorcycle parts and accessories with warranty coverage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// About Page Component
function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gold-gradient">About B&L Motorcycles</h1>
        <Card className="bg-gray-800/50 border-yellow-500/20">
          <CardContent className="p-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              B&L Motorcycles Ltd is your trusted partner for motorcycle parts and repairs. 
              With years of experience in the industry, we provide quality service and genuine parts 
              to keep your motorcycle running at its best.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Contact Page Component
function ContactPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gold-gradient">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">07881274193</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">brett@blmotorcyclesltd.co.uk</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Company No: 14122962</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

