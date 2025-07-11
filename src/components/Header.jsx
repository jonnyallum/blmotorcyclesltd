// B&L Motorcycles Ltd - Header Component
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Phone,
  Mail
} from 'lucide-react'
import blLogo from '../assets/bl-motorcycles-logo.png'

export function Header({ cartItemCount = 0, onSearch, onCartClick, onMenuClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (onMenuClick) {
      onMenuClick(!isMenuOpen)
    }
  }

  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Categories', href: '#categories' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <header className="bg-black border-b border-yellow-500/20 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>0121 123 4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>info@blmotorcycles.co.uk</span>
              </div>
            </div>
            <div className="text-yellow-500 font-medium">
              Free UK Delivery on Orders Over £50
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={blLogo} 
              alt="B&L Motorcycles Ltd" 
              className="h-12 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">B&L Motorcycles</h1>
              <p className="text-sm text-yellow-500">Premium Parts & Accessories</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search motorcycle parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-500"
              />
              <Button 
                type="submit"
                className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button - Mobile */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden text-white hover:text-yellow-500"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User Account */}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-yellow-500"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Shopping Cart */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-white hover:text-yellow-500"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden text-white hover:text-yellow-500"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex mt-4 pt-4 border-t border-gray-800">
          <div className="flex gap-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-yellow-500 transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              placeholder="Search motorcycle parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-500"
            />
            <Button 
              type="submit"
              className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-500 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

