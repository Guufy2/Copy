const input = (field, type = 'string', extra = {}) => ({
  field,
  type,
  meta: { interface: 'input', ...extra.meta },
  schema: { ...extra.schema },
})
const id = () => ({
  field: 'id',
  type: 'uuid',
  meta: { hidden: true, special: ['uuid'] },
  schema: { is_primary_key: true },
})
const slug = () =>
  input('slug', 'string', {
    schema: { is_unique: true, is_nullable: false },
    meta: {
      required: true,
      note: 'Латинские буквы, цифры и дефисы; используется в URL.',
      validation: { slug: { _regex: '^[a-z0-9]+(-[a-z0-9]+)*$' } },
    },
  })
const bool = (field, defaultValue = false) =>
  input(field, 'boolean', {
    meta: { interface: 'boolean', special: ['cast-boolean'] },
    schema: { default_value: defaultValue, is_nullable: false },
  })

export const collections = [
  {
    collection: 'categories',
    schema: {},
    meta: {
      icon: 'category',
      sort_field: 'sort',
      display_template: '{{name}}',
      translations: [{ language: 'ru-RU', translation: 'Разделы' }],
    },
    fields: [
      id(),
      slug(),
      input('name', 'string', { schema: { is_nullable: false }, meta: { required: true } }),
      input('description', 'text', { meta: { interface: 'input-multiline' } }),
      input('icon', 'string', { schema: { default_value: '◈' } }),
      input('tone', 'integer', {
        schema: { default_value: 0, is_nullable: false },
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [0, 1, 2, 3, 4].map((value) => ({ text: `Цвет ${value + 1}`, value })),
          },
        },
      }),
      input('sort', 'integer', { schema: { default_value: 0 } }),
    ],
  },
  {
    collection: 'articles',
    schema: {},
    meta: {
      icon: 'article',
      sort_field: 'sort',
      display_template: '{{title}}',
      translations: [{ language: 'ru-RU', translation: 'Статьи' }],
    },
    fields: [
      id(),
      slug(),
      input('status', 'string', {
        schema: { default_value: 'draft', is_nullable: false },
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Черновик', value: 'draft' },
              { text: 'Опубликовано', value: 'published' },
            ],
          },
        },
      }),
      input('title', 'string', { schema: { is_nullable: false }, meta: { required: true } }),
      input('excerpt', 'text', { meta: { interface: 'input-multiline' } }),
      input('body', 'text', {
        meta: {
          interface: 'input-rich-text-html',
          width: 'full',
          note: 'Текст статьи. Заголовки h2/h3 автоматически попадают в оглавление сайта.',
        },
      }),
      input('category', 'uuid', {
        meta: { interface: 'select-dropdown-m2o', special: ['m2o'], required: true },
        schema: { is_nullable: false },
      }),
      input('reading_minutes', 'integer', {
        schema: { default_value: 3, is_nullable: false },
        meta: { validation: { reading_minutes: { _gte: 1 } } },
      }),
      bool('featured'),
      bool('is_faq'),
      bool('is_demo'),
      input('sort', 'integer', { schema: { default_value: 0 } }),
      {
        field: 'date_updated',
        type: 'timestamp',
        meta: { interface: 'datetime', special: ['date-updated'], readonly: true, hidden: true },
        schema: {},
      },
    ],
  },
]

export const publicFields = {
  categories: ['id', 'slug', 'name', 'description', 'icon', 'tone', 'sort'],
  articles: [
    'id',
    'slug',
    'status',
    'title',
    'excerpt',
    'body',
    'category',
    'reading_minutes',
    'featured',
    'is_faq',
    'is_demo',
    'sort',
    'date_updated',
  ],
}
