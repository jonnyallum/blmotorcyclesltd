// B&L Motorcycles Ltd - Categories Hook (Updated for Clean Database)
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get categories from the categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) {
        throw categoriesError
      }

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          const { count } = await supabase
            .from('product_inventory')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)

          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image_url: category.image_url || getCategoryImage(category.name),
            parent_id: category.parent_id,
            count: count || 0,
            created_at: category.created_at,
            updated_at: category.updated_at
          }
        })
      )

      // Sort by product count (highest first)
      categoriesWithCounts.sort((a, b) => b.count - a.count)

      setCategories(categoriesWithCounts)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: fetchCategories }
}

// Get a single category by ID or slug
export function useCategory(identifier, bySlug = false) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (identifier) {
      fetchCategory()
    }
  }, [identifier, bySlug])

  const fetchCategory = async () => {
    try {
      setLoading(true)
      setError(null)

      const column = bySlug ? 'slug' : 'id'
      
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq(column, identifier)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Get product count for this category
      const { count } = await supabase
        .from('product_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', data.id)

      const categoryWithCount = {
        ...data,
        count: count || 0,
        image_url: data.image_url || getCategoryImage(data.name)
      }

      setCategory(categoryWithCount)
    } catch (err) {
      console.error('Error fetching category:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { category, loading, error, refetch: fetchCategory }
}

// Get category statistics
export function useCategoryStats() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    categoriesWithProducts: 0,
    averageProductsPerCategory: 0,
    topCategory: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all categories with product counts
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')

      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          const { count } = await supabase
            .from('product_inventory')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)

          return {
            ...category,
            count: count || 0
          }
        })
      )

      const totalCategories = categoriesWithCounts.length
      const categoriesWithProducts = categoriesWithCounts.filter(cat => cat.count > 0).length
      const totalProducts = categoriesWithCounts.reduce((sum, cat) => sum + cat.count, 0)
      const averageProductsPerCategory = categoriesWithProducts > 0 
        ? Math.round(totalProducts / categoriesWithProducts * 100) / 100 
        : 0
      const topCategory = categoriesWithCounts.reduce((top, cat) => 
        cat.count > (top?.count || 0) ? cat : top, null)

      setStats({
        totalCategories,
        categoriesWithProducts,
        averageProductsPerCategory,
        topCategory
      })
    } catch (err) {
      console.error('Error fetching category stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}

// Helper function to get category images
function getCategoryImage(categoryName) {
  const name = categoryName.toLowerCase()
  
  const categoryImages = {
    'batteries & charging': 'https://images.unsplash.com/photo-1609592806596-4d3c1b4c9b8e?w=400&h=400&fit=crop&auto=format',
    'brakes & abs': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
    'engine & performance': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'exhaust systems': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'wheels & tyres': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'suspension & steering': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'body & fairings': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'electrical & lighting': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'tools & maintenance': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'security & locks': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format'
  }
  
  // Try exact match first
  if (categoryImages[name]) {
    return categoryImages[name]
  }
  
  // Try partial matches
  if (name.includes('brake')) {
    return categoryImages['brakes & abs']
  }
  if (name.includes('engine') || name.includes('performance')) {
    return categoryImages['engine & performance']
  }
  if (name.includes('electrical') || name.includes('light')) {
    return categoryImages['electrical & lighting']
  }
  if (name.includes('exhaust')) {
    return categoryImages['exhaust systems']
  }
  if (name.includes('suspension') || name.includes('shock') || name.includes('steering')) {
    return categoryImages['suspension & steering']
  }
  if (name.includes('wheel') || name.includes('tyre') || name.includes('tire')) {
    return categoryImages['wheels & tyres']
  }
  if (name.includes('battery') || name.includes('charging')) {
    return categoryImages['batteries & charging']
  }
  if (name.includes('body') || name.includes('fairing')) {
    return categoryImages['body & fairings']
  }
  if (name.includes('tool') || name.includes('maintenance')) {
    return categoryImages['tools & maintenance']
  }
  if (name.includes('security') || name.includes('lock')) {
    return categoryImages['security & locks']
  }
  
  // Default motorcycle parts image
  return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format'
}

