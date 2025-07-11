// B&L Motorcycles Ltd - Mock Products Hook for Local Testing
import { useState, useEffect } from 'react'
import { mockProducts } from '../data/mockData'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(filters)])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredProducts = [...mockProducts]

      // Apply filters
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category_id === filters.category)
      }
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase())
      }
      if (filters.featured) {
        filteredProducts = filteredProducts.filter(p => p.is_featured)
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.short_description.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }
      if (filters.priceMin) {
        filteredProducts = filteredProducts.filter(p => p.base_price >= filters.priceMin)
      }
      if (filters.priceMax) {
        filteredProducts = filteredProducts.filter(p => p.base_price <= filters.priceMax)
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'created_at'
      const sortOrder = filters.sortOrder || 'desc'
      
      filteredProducts.sort((a, b) => {
        let aVal = a[sortBy]
        let bVal = b[sortBy]
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      // Apply pagination
      if (filters.limit) {
        filteredProducts = filteredProducts.slice(0, filters.limit)
      }

      setProducts(filteredProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(identifier, bySlug = false) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (identifier) {
      fetchProduct()
    }
  }, [identifier, bySlug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const field = bySlug ? 'slug' : 'id'
      const product = mockProducts.find(p => p[field] === identifier)

      if (!product) {
        throw new Error('Product not found')
      }

      setProduct(product)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { product, loading, error, refetch: fetchProduct }
}

