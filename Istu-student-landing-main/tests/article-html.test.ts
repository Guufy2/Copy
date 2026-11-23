import assert from 'node:assert/strict'
import { test } from 'node:test'
import { prepareArticleHtml } from '../server/utils/article-html.ts'

test('removes scripts, event handlers and dangerous links from CMS HTML', () => {
  const { body } = prepareArticleHtml(
    '<script>alert(1)</script><p onclick="alert(1)">Текст<img src=x onerror=alert(1)></p><a href="javascript:alert(1)">ссылка</a><a href="https://istu.ru">университет</a><iframe src="https://example.com"></iframe>',
  )
  assert.equal(body, '<p>Текст</p><a>ссылка</a><a href="https://istu.ru">университет</a>')
})

test('generates unique safe anchors and plain-text table of contents', () => {
  const { body, toc } = prepareArticleHtml(
    '<h2 id="untrusted">Учёба &amp; <em>документы</em></h2><h3>Учёба &amp; документы</h3>',
  )
  assert.deepEqual(toc, [
    { id: 'section-1', title: 'Учёба & документы' },
    { id: 'section-2', title: 'Учёба & документы' },
  ])
  assert.match(body, /<h2 id="section-1">/)
  assert.match(body, /<h3 id="section-2">/)
  assert.doesNotMatch(body, /untrusted/)
})
