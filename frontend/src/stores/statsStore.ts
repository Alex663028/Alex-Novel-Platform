import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statsApi } from '../api/stats'
import { novelApi } from '../api/novel'
import type { GlobalStats, BookStats, ChapterStats, WritingProgress } from '../types/api'

export const useStatsStore = defineStore('stats', () => {
  // ============================================================================
  // State
  // ============================================================================

  const globalStats = ref<GlobalStats | null>(null)
  const bookStatsCache = ref<Map<string, BookStats>>(new Map())
  const chapterStatsCache = ref<Map<string, ChapterStats>>(new Map())
  const progressCache = ref<Map<string, WritingProgress[]>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============================================================================
  // Getters
  // ============================================================================

  const hasGlobalStats = computed(() => globalStats.value !== null)

  const getBookStats = computed(() => (slug: string) => {
    return bookStatsCache.value.get(slug) || null
  })

  const getChapterStats = computed(() => (key: string) => {
    return chapterStatsCache.value.get(key) || null
  })

  const getProgress = computed(() => (slug: string) => {
    return progressCache.value.get(slug) || null
  })

  const isCached = computed(() => (type: 'global' | 'book' | 'chapter' | 'progress', key?: string) => {
    switch (type) {
      case 'global':
        return globalStats.value !== null
      case 'book':
        return key ? bookStatsCache.value.has(key) : false
      case 'chapter':
        return key ? chapterStatsCache.value.has(key) : false
      case 'progress':
        return key ? progressCache.value.has(key) : false
      default:
        return false
    }
  })

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Load global statistics
   * @param force - Force refresh even if cached
   */
  async function loadGlobalStats(force = false) {
    if (!force && globalStats.value !== null) {
      return globalStats.value
    }

    loading.value = true
    error.value = null

    try {
      const data = await statsApi.getGlobal()
      globalStats.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load global stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load statistics for a specific book
   * @param slug - Book slug
   * @param force - Force refresh even if cached
   */
  async function loadBookStats(slug: string, force = false) {
    if (!force && bookStatsCache.value.has(slug)) {
      return bookStatsCache.value.get(slug)!
    }

    loading.value = true
    error.value = null

    try {
      const data = await novelApi.getNovelStatistics(slug)
      bookStatsCache.value.set(slug, data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to load book stats for ${slug}`
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load statistics for a specific chapter
   * @param slug - Book slug
   * @param chapterId - Chapter ID
   * @param force - Force refresh even if cached
   */
  async function loadChapterStats(slug: string, chapterId: number, force = false) {
    const cacheKey = `${slug}:${chapterId}`

    if (!force && chapterStatsCache.value.has(cacheKey)) {
      return chapterStatsCache.value.get(cacheKey)!
    }

    loading.value = true
    error.value = null

    try {
      const data = await statsApi.getChapter(slug, chapterId)
      chapterStatsCache.value.set(cacheKey, data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to load chapter stats for ${slug}:${chapterId}`
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load writing progress for a book
   * @param slug - Book slug
   * @param days - Number of days to retrieve (default: 30)
   * @param force - Force refresh even if cached
   */
  async function loadProgress(slug: string, days = 30, force = false) {
    const cacheKey = `${slug}:${days}`

    if (!force && progressCache.value.has(cacheKey)) {
      return progressCache.value.get(cacheKey)!
    }

    loading.value = true
    error.value = null

    try {
      const data = await statsApi.getProgress(slug, days)
      progressCache.value.set(cacheKey, data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to load progress for ${slug}`
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load book stats and progress in parallel
   * @param slug - Book slug
   * @param days - Number of days for progress (default: 30)
   * @param force - Force refresh even if cached
   */
  async function loadBookAllStats(slug: string, days = 30, force = false) {
    const bookCached = bookStatsCache.value.has(slug)
    const progressCacheKey = `${slug}:${days}`
    const progressCached = progressCache.value.has(progressCacheKey)

    if (!force && bookCached && progressCached) {
      return {
        bookStats: bookStatsCache.value.get(slug)!,
        progress: progressCache.value.get(progressCacheKey)!,
      }
    }

    loading.value = true
    error.value = null

    try {
      const { bookStats, progress } = await statsApi.getBookAllStats(slug, days)
      bookStatsCache.value.set(slug, bookStats)
      progressCache.value.set(progressCacheKey, progress)
      return { bookStats, progress }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to load all stats for ${slug}`
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear all caches
   */
  function clearCache() {
    globalStats.value = null
    bookStatsCache.value.clear()
    chapterStatsCache.value.clear()
    progressCache.value.clear()
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  /**
   * Handle job completion - invalidate cache and reload stats
   * @param slug - Book slug
   */
  function onJobCompleted(slug: string) {
    if (bookStatsCache.value.has(slug)) {
      bookStatsCache.value.delete(slug)
    }
    loadBookStats(slug, true)
    loadGlobalStats(true)
  }

  /**
   * Handle chapter save - invalidate cache and reload book stats
   * @param slug - Book slug
   * @param chapterId - Chapter ID
   */
  function onChapterSaved(slug: string, chapterId: number) {
    if (bookStatsCache.value.has(slug)) {
      bookStatsCache.value.delete(slug)
    }
    loadBookStats(slug, true)
  }

  return {
    // State
    globalStats,
    bookStatsCache,
    chapterStatsCache,
    progressCache,
    loading,
    error,

    // Getters
    hasGlobalStats,
    getBookStats,
    getChapterStats,
    getProgress,
    isCached,

    // Actions
    loadGlobalStats,
    loadBookStats,
    loadChapterStats,
    loadProgress,
    loadBookAllStats,
    clearCache,
    clearError,
    onJobCompleted,
    onChapterSaved,
  }
})
