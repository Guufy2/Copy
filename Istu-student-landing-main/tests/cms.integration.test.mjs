import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

const cms = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055'
const site = process.env.SITE_URL || 'http://127.0.0.1:3000'

test('drafts stay private, publication reaches Nuxt and CMS HTML is sanitized', async () => {
  const auth = await fetch(`${cms}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.DIRECTUS_ADMIN_EMAIL,
      password: process.env.DIRECTUS_ADMIN_PASSWORD,
    }),
  })
  assert.equal(auth.status, 200)
  const {
    data: { access_token: token },
  } = await auth.json()
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const { categories } = await (await fetch(`${site}/api/knowledge`)).json()
  assert.ok(categories.length > 0)
  const slug = `integration-${randomUUID()}`
  let id
  try {
    const created = await fetch(`${cms}/items/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        slug,
        title: 'Проверка публикации',
        category: categories[0].id,
        status: 'draft',
        body: '<h2>Раздел</h2><p onclick="alert(1)">Тест</p><script>alert(1)</script>',
        is_demo: true,
      }),
    })
    assert.equal(created.status, 200)
    id = (await created.json()).data.id
    const publicDraft = await fetch(`${cms}/items/articles?filter[slug][_eq]=${slug}`)
    assert.deepEqual((await publicDraft.json()).data, [])
    assert.equal((await fetch(`${site}/api/articles/${slug}`)).status, 404)
    assert.equal((await fetch(`${site}/articles/${slug}`)).status, 404)
    const knowledge = await (await fetch(`${site}/api/knowledge`)).json()
    assert.ok(!knowledge.articles.some((article) => article.slug === slug))

    const forbiddenWrite = await fetch(`${cms}/items/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Запрещено' }),
    })
    assert.equal(forbiddenWrite.status, 403)

    const published = await fetch(`${cms}/items/articles/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'published' }),
    })
    assert.equal(published.status, 200)
    const articleResponse = await fetch(`${site}/api/articles/${slug}`)
    assert.equal(articleResponse.status, 200)
    const article = await articleResponse.json()
    assert.equal(article.title, 'Проверка публикации')
    assert.deepEqual(article.toc, [{ id: 'section-1', title: 'Раздел' }])
    assert.doesNotMatch(article.body, /<script|onclick/)
    const page = await fetch(`${site}/articles/${slug}`)
    assert.equal(page.status, 200)
    assert.match(await page.text(), /Проверка публикации/)
  } finally {
    // Remove only the temporary article created by this test.
    if (id) {
      const cleanup = await fetch(`${cms}/items/articles/${id}`, { method: 'DELETE', headers })
      assert.equal(cleanup.status, 204)
    }
  }
})
