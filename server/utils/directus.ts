interface DirectusResponse<T> {
  data: T
}

export async function readDirectus<T>(collection: string, query: Record<string, unknown>) {
  const { directusUrl } = useRuntimeConfig()
  try {
    const response = await $fetch<DirectusResponse<T>>(`/items/${collection}`, {
      baseURL: directusUrl,
      query,
      timeout: 5000,
      retry: 0,
    })
    return response.data
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'База знаний временно недоступна',
    })
  }
}

export const articleFields = [
  'id',
  'slug',
  'title',
  'excerpt',
  'reading_minutes',
  'featured',
  'is_faq',
  'is_demo',
  'date_updated',
  'category.id',
  'category.slug',
  'category.name',
  'category.description',
  'category.icon',
  'category.tone',
  'category.sort',
].join(',')
