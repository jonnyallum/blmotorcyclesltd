import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import logo from './assets/logo.png'

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function Header() {
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="B&L Motorcycles" className="logo-img" />
          <div className="logo-text">
            <span className="logo-main">B&L MOTORCYCLES</span>
            <span className="logo-sub">PARTS & REPAIRS</span>
          </div>
        </Link>
        
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
            Home
          </Link>
          <Link to="/shop" className={location.pathname === '/shop' ? 'nav-link active' : 'nav-link'}>
            Shop
          </Link>
          <Link to="/services" className={location.pathname === '/services' ? 'nav-link active' : 'nav-link'}>
            Services
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>
            About
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>
            Contact
          </Link>
        </nav>

        <button className="cart-btn">
          Cart ({cartCount})
        </button>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <img src={logo} alt="B&L Motorcycles" className="hero-logo" />
            <h1 className="hero-title">B&L MOTORCYCLES</h1>
            <p className="hero-subtitle">PARTS & REPAIRS</p>
            <p className="hero-description">
              Your trusted partner for motorcycle parts, repairs, and maintenance. 
              Quality service with genuine parts and expert craftsmanship.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">Shop Parts</Link>
              <Link to="/services" className="btn btn-secondary">Book Service</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Quality Parts</h3>
              <p>Genuine motorcycle parts from trusted suppliers</p>
            </div>
            <div className="feature-card">
              <h3>Expert Service</h3>
              <p>Professional repairs and maintenance by certified technicians</p>
            </div>
            <div className="feature-card">
              <h3>Fast Delivery</h3>
              <p>Quick dispatch and reliable delivery nationwide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      
      const response = await fetch(`${API_BASE_URL}/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    alert(`Added ${product.name} to cart!`)
  }

  if (loading) {
    return (
      <div className="shop-page">
        <div className="container">
          <h1 className="page-title">Motorcycle Parts Shop</h1>
          <div className="loading">Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="container">
          <h1 className="page-title">Motorcycle Parts Shop</h1>
          <div className="error">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="container">
        <h1 className="page-title">Motorcycle Parts Shop</h1>
        <p className="page-description">Browse our extensive collection of motorcycle parts and accessories</p>
        
        <div className="shop-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found. {searchTerm || selectedCategory ? 'Try adjusting your search or category filter.' : 'Products will appear here once the inventory is synchronized.'}</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="product-image-placeholder">Product Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">Category: {product.category || 'Uncategorized'}</p>
                  <p className="product-sku">SKU: {product.sku}</p>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                  <div className="product-price">
                    <span className="price">£{parseFloat(product.selling_price).toFixed(2)}</span>
                    {product.cost_price && (
                      <span className="cost-price">(Cost: £{parseFloat(product.cost_price).toFixed(2)})</span>
                    )}
                  </div>
                  <p className="delivery-info">Price includes £{product.delivery_cost || 6} delivery</p>
                  <div className="product-stock">
                    {product.in_stock ? (
                      <span className="in-stock">In Stock ({product.stock_quantity || 0})</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>
                  <button 
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.in_stock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ServicesPage() {
  return (
    <div className="services-page">
      <div className="container">
        <h1 className="page-title">Our Services</h1>
        <div className="services-grid">
          <div className="service-card">
            <h3>Motorcycle Repairs</h3>
            <p>Complete motorcycle repair services by certified technicians</p>
          </div>
          <div className="service-card">
            <h3>Maintenance</h3>
            <p>Regular maintenance to keep your motorcycle running smoothly</p>
          </div>
          <div className="service-card">
            <h3>Parts Installation</h3>
            <p>Professional installation of motorcycle parts and accessories</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About B&L Motorcycles</h1>
        <p>B&L Motorcycles is your trusted partner for motorcycle parts, repairs, and maintenance. We provide quality service with genuine parts and expert craftsmanship.</p>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Contact Us</h1>
        <div className="contact-info">
          <p><strong>Email:</strong> brett@blmotorcyclesltd.co.uk</p>
          <p><strong>Phone:</strong> 07881274193</p>
          <p><strong>Company No:</strong> 14122962</p>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 B&L Motorcycles Ltd. All rights reserved.</p>
        <p>Company No: 14122962</p>
      </div>
    </footer>
  )
}

export default App

