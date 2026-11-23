import type { ArticleSummary, Category, KnowledgeBase } from '../../shared/types/content'

export default defineEventHandler(async (): Promise<KnowledgeBase> => {
  const [categories, articles] = await Promise.all([
    readDirectus<Category[]>('categories', {
      fields: 'id,slug,name,description,icon,tone,sort',
      sort: 'sort,name',
      limit: -1,
    }),
    readDirectus<ArticleSummary[]>('articles', {
      fields: articleFields,
      filter: { status: { _eq: 'published' } },
      sort: 'sort,title',
      limit: -1,
    }),
  ])
  return {
    categories,
    articles: articles.filter(
      (article) => article.category && typeof article.category === 'object',
    ),
  }
})
