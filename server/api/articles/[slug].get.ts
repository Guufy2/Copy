import type { Article } from '../../../shared/types/content'

export default defineEventHandler(async (event): Promise<Article> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Статья не найдена' })
  }
  const articles = await readDirectus<Omit<Article, 'toc'>[]>('articles', {
    fields: `${articleFields},body`,
    filter: { _and: [{ slug: { _eq: slug } }, { status: { _eq: 'published' } }] },
    limit: 1,
  })
  const article = articles[0]
  if (!article?.category)
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Статья не найдена' })
  return { ...article, ...prepareArticleHtml(article.body ?? '') }
})
