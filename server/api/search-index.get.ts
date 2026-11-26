import type { SearchIndex, SearchIndexArticle, SearchIndexCategory } from '../../shared/types/content'

interface DirectusSearchArticle {
  slug: string
  title: string
  category: SearchIndexCategory | null
}

const PAGE_SIZE = 100

export default defineCachedEventHandler(
  async (): Promise<SearchIndex> => {
    const articles: SearchIndexArticle[] = []
    let offset = 0

    while (true) {
      const page = await readDirectus<DirectusSearchArticle[]>('articles', {
        fields: 'slug,title,category.slug,category.icon,category.tone',
        filter: { status: { _eq: 'published' } },
        sort: 'title',
        limit: PAGE_SIZE,
        offset,
      })

      articles.push(
        ...page
          .filter((article) => article.slug && article.title)
          .map((article) => ({
            slug: article.slug,
            title: article.title,
            category: article.category
              ? {
                  slug: article.category.slug ?? '',
                  icon: article.category.icon ?? '•',
                  tone: article.category.tone ?? 0,
                }
              : null,
          })),
      )

      if (page.length < PAGE_SIZE) break
      offset += PAGE_SIZE
    }

    return { articles }
  },
  {
    name: 'search-index',
    maxAge: 300,
    swr: true,
  },
)
