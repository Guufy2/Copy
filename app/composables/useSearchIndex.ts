import type { SearchIndex, SearchIndexArticle } from '~~/shared/types/content'

export function normalizeSearchQuery(value: string) {
  return value.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim().replace(/\s+/g, ' ')
}

export function useSearchIndex() {
  const { data, pending, error, execute } = useFetch<SearchIndex | null>('/api/search-index', {
    key: 'search-index',
    immediate: false,
    default: () => null,
  })

  async function loadIndex() {
    if (data.value) return data.value
    await execute()
    return data.value
  }

  function searchArticles(query: string): SearchIndexArticle[] {
    const normalizedQuery = normalizeSearchQuery(query)
    if (!normalizedQuery) return []

    return (data.value?.articles ?? [])
      .map((article, index) => {
        const title = normalizeSearchQuery(article.title)
        const matches = title.includes(normalizedQuery)
        const startsWord = title.split(' ').some((word) => word.startsWith(normalizedQuery))
        const rank = title.startsWith(normalizedQuery) ? 0 : startsWord ? 1 : 2

        return { article, index, matches, rank }
      })
      .filter((item) => item.matches)
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map((item) => item.article)
  }

  return {
    index: data,
    pending,
    error,
    loadIndex,
    searchArticles,
  }
}
