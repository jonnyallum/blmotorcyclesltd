// B&L Motorcycles Ltd - Products Hook (Updated to prioritize working images)
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

      // Products with confirmed working images (Dynavolt batteries)
      const workingImageSkus = [
        'CB12AA', 'CB12AB', 'CB12ALA2', 'CB12BB2', 'CB14AA2', 
        'CB16B', 'CB18LA2', 'CB25LC', 'CB3LB', 'CB4LB', 'CB7CA'
      ]

      // Query product_inventory with category join
      let query = supabase
        .from('product_inventory')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`)
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        // If it's a number, filter by category_id, otherwise by category name
        if (!isNaN(filters.category)) {
          query = query.eq('category_id', parseInt(filters.category))
        } else {
          query = query.eq('categories.slug', filters.category)
        }
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'created_at'
      const sortOrder = filters.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination - limit to reasonable number for performance
      const limit = filters.limit || 50
      query = query.limit(limit)

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error('Products fetch error:', fetchError)
        throw fetchError
      }

      // Transform BikeIt data for display
      const transformedProducts = data.map(product => ({
        id: product.id,
        sku: product.sku,
        name: product.title,
        title: product.title,
        short_description: product.title,
        long_description: product.title,
        brand: extractBrand(product.title),
        category_id: product.category_id,
        category_name: product.categories?.name || 'Motorcycle Parts',
        category_slug: product.categories?.slug || 'motorcycle-parts',
        
        // Pricing with B&L markup (cost × 1.5 + £6 delivery)
        cost_price: product.trade_price,
        trade_price: product.trade_price,
        retail_price: product.retail_price,
        price: product.retail_price,
        base_price: product.trade_price * 1.5,
        final_price: product.retail_price,
        delivery_cost: 6.00,
        total_price: product.retail_price + 6.00,
        
        // Images - use BikeIt's real product images
        image_url: product.image_url_1 || getDefaultImage(product.categories?.name),
        image_url_1: product.image_url_1,
        image_url_2: product.image_url_2,
        image_url_3: product.image_url_3,
        image_url_4: product.image_url_4,
        image_url_5: product.image_url_5,
        
        // Stock and availability
        in_stock: true, // Assume in stock from BikeIt
        stock_level: 10, // Default stock level
        
        // Product flags - prioritize products with working images
        is_active: true,
        is_featured: workingImageSkus.includes(product.sku), // Featured if has working image
        on_sale: product.retail_price < (product.trade_price * 2), // On sale if good margin
        has_real_image: workingImageSkus.includes(product.sku), // Flag for real images
        
        // Metadata
        created_at: product.created_at,
        updated_at: product.updated_at,
        source: 'BikeIt International'
      }))

      // Sort to prioritize products with working images
      const sortedProducts = transformedProducts.sort((a, b) => {
        // Products with real images come first
        if (a.has_real_image && !b.has_real_image) return -1
        if (!a.has_real_image && b.has_real_image) return 1
        
        // Then by featured status
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        
        // Then by original sort order
        return 0
      })

      setProducts(sortedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract brand from title
  const extractBrand = (title) => {
    if (!title) return 'Unknown'
    
    // Common motorcycle part brands
    const brands = ['WRP', 'Dynavolt', 'intAct', 'Motobatt', 'Yuasa', 'NGK', 'Denso', 'Bosch']
    
    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand
      }
    }
    
    // Extract first word as brand fallback
    return title.split(' ')[0] || 'Unknown'
  }

  // Helper function to get default image based on category
  const getDefaultImage = (categoryName) => {
    // Return null to use fallback motorcycle icon
    return null
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

