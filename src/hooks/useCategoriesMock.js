// B&L Motorcycles Ltd - Mock Categories Hook for Local Testing
import { useState, useEffect } from 'react'
import { mockCategories } from '../data/mockData'

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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      setCategories(mockCategories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: fetchCategories }
}

export function useCategory(slug) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchCategory()
    }
  }, [slug])

  const fetchCategory = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const category = mockCategories.find(c => c.slug === slug)

      if (!category) {
        throw new Error('Category not found')
      }

      setCategory(category)
    } catch (err) {
      console.error('Error fetching category:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { category, loading, error, refetch: fetchCategory }
}

