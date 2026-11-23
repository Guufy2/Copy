import { readFile } from 'node:fs/promises'
import { collections, publicFields } from '../directus/schema.mjs'

const url = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055'
let token
async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(new URL(path, url), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(`${method} ${path}: ${response.status} ${result.errors?.[0]?.message || ''}`)
  }
  if (response.status === 204) return null
  return (await response.json()).data
}

if (!process.env.DIRECTUS_ADMIN_EMAIL || !process.env.DIRECTUS_ADMIN_PASSWORD) {
  throw new Error('Укажите DIRECTUS_ADMIN_EMAIL и DIRECTUS_ADMIN_PASSWORD в .env')
}
token = (
  await api('/auth/login', {
    method: 'POST',
    body: {
      email: process.env.DIRECTUS_ADMIN_EMAIL,
      password: process.env.DIRECTUS_ADMIN_PASSWORD,
    },
  })
).access_token

// Re-runs add missing schema and content, but never overwrite editorial changes.
const existing = await api('/collections')
for (const collection of collections) {
  if (!existing.some((item) => item.collection === collection.collection)) {
    await api('/collections', { method: 'POST', body: collection })
  } else {
    const fields = await api(`/fields/${collection.collection}`)
    for (const field of collection.fields) {
      if (!fields.some((item) => item.field === field.field)) {
        await api(`/fields/${collection.collection}`, { method: 'POST', body: field })
      }
    }
  }
}
const relations = await api('/relations')
if (!relations.some((item) => item.collection === 'articles' && item.field === 'category')) {
  await api('/relations', {
    method: 'POST',
    body: {
      collection: 'articles',
      field: 'category',
      related_collection: 'categories',
      schema: { on_delete: 'RESTRICT' },
      meta: {
        many_collection: 'articles',
        many_field: 'category',
        one_collection: 'categories',
        one_deselect_action: 'nullify',
      },
    },
  })
}

const policies = await api('/policies?limit=-1')
let policy = policies.find((item) => item.name === 'Student help: published content')
if (!policy) {
  policy = await api('/policies', {
    method: 'POST',
    body: {
      name: 'Student help: published content',
      icon: 'menu_book',
      admin_access: false,
      app_access: false,
    },
  })
  await api('/access', { method: 'POST', body: { role: null, user: null, policy: policy.id } })
}
const access = await api(`/access?filter[policy][_eq]=${policy.id}`)
if (!access.some((item) => !item.role && !item.user)) {
  await api('/access', { method: 'POST', body: { role: null, user: null, policy: policy.id } })
}
const permissions = await api(`/permissions?filter[policy][_eq]=${policy.id}`)
for (const [collection, fields] of Object.entries(publicFields)) {
  if (!permissions.some((item) => item.collection === collection && item.action === 'read')) {
    await api('/permissions', {
      method: 'POST',
      body: {
        policy: policy.id,
        collection,
        action: 'read',
        fields,
        permissions: collection === 'articles' ? { status: { _eq: 'published' } } : {},
      },
    })
  }
}

const seed = JSON.parse(
  await readFile(new URL('../directus/demo-content.json', import.meta.url), 'utf8'),
)
const categories = await api('/items/categories?limit=-1')
for (const category of seed.categories) {
  if (!categories.some((item) => item.slug === category.slug)) {
    categories.push(await api('/items/categories', { method: 'POST', body: category }))
  }
}
const articles = await api('/items/articles?fields=slug&limit=-1')
for (const article of seed.articles) {
  if (!articles.some((item) => item.slug === article.slug)) {
    const category = categories.find((item) => item.slug === article.category)
    if (!category) throw new Error(`Не найден раздел ${article.category}`)
    await api('/items/articles', { method: 'POST', body: { ...article, category: category.id } })
  }
}
console.log(
  'Directus настроен: разделы, статьи, редактор и чтение только опубликованных материалов. Существующий контент сохранён.',
)
