import sanitizeHtml from 'sanitize-html'

function headingText(value: string) {
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  }
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
      if (entity.startsWith('#')) {
        const code =
          entity[1]?.toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1))
        return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
      }
      return entities[entity] ?? match
    })
    .trim()
}

export function prepareArticleHtml(input: string) {
  const toc: { id: string; title: string }[] = []
  const clean = sanitizeHtml(input, {
    allowedTags: [
      'p',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'strong',
      'b',
      'em',
      'i',
      'a',
      'blockquote',
      'br',
      'hr',
    ],
    allowedAttributes: { a: ['href', 'title'] },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    allowProtocolRelative: false,
  })
  const body = clean.replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (_match, tag: string, content: string) => {
      const id = `section-${toc.length + 1}`
      toc.push({ id, title: headingText(content) })
      return `<${tag} id="${id}">${content}</${tag}>`
    },
  )
  return { body, toc }
}
