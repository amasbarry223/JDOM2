/**
 * Pagination hook
 * Manages pagination state and logic
 */

import { useState, useMemo } from 'react'
import type { PaginationResponse } from '@/lib/types'

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  total?: number
}

export interface UsePaginationReturn {
  page: number
  limit: number
  total: number
  pages: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setTotal: (total: number) => void
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  canGoNext: boolean
  canGoPrevious: boolean
  pagination: PaginationResponse
}

/**
 * Pagination hook
 * @param options - Pagination options
 * @returns Pagination state and controls
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, total: initialTotal = 0 } = options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(initialTotal)

  const pages = useMemo(() => Math.ceil(total / limit), [total, limit])

  const canGoNext = useMemo(() => page < pages, [page, pages])
  const canGoPrevious = useMemo(() => page > 1, [page])

  const nextPage = () => {
    if (canGoNext) {
      setPage((prev) => prev + 1)
    }
  }

  const previousPage = () => {
    if (canGoPrevious) {
      setPage((prev) => prev - 1)
    }
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage)
    }
  }

  const pagination: PaginationResponse = useMemo(
    () => ({
      page,
      limit,
      total,
      pages,
    }),
    [page, limit, total, pages]
  )

  return {
    page,
    limit,
    total,
    pages,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    previousPage,
    goToPage,
    canGoNext,
    canGoPrevious,
    pagination,
  }
}

