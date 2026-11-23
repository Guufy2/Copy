import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-23',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  runtimeConfig: { directusUrl: 'http://127.0.0.1:8055' },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      titleTemplate: '%s — Справка ИжГТУ',
      meta: [
        {
          name: 'description',
          content:
            'Справка для действующих студентов ИжГТУ: учёба, документы и университетская жизнь.',
        },
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    },
  },
  routeRules: {
    '/index.html': { redirect: '/' },
    '/catalog.html': { redirect: '/catalog' },
    '/section.html': { redirect: '/sections/study' },
    '/article.html': { redirect: '/articles/academic-leave' },
    '/faq.html': { redirect: '/faq' },
    '/search.html': { redirect: '/search' },
  },
})
