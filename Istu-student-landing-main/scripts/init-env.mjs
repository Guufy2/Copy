import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

try {
  await writeFile(
    new URL('../.env', import.meta.url),
    [
      'NUXT_DIRECTUS_URL=http://127.0.0.1:8055',
      'DIRECTUS_URL=http://127.0.0.1:8055',
      `DIRECTUS_SECRET=${randomBytes(48).toString('hex')}`,
      'DIRECTUS_ADMIN_EMAIL=admin@example.com',
      `DIRECTUS_ADMIN_PASSWORD=${randomBytes(24).toString('base64url')}`,
      '',
    ].join('\n'),
    { flag: 'wx', mode: 0o600 },
  )
  console.log('Создан локальный .env. Данные входа в Directus находятся в этом файле.')
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.log('.env уже существует; настройки сохранены.')
}
