<script setup lang="ts">
const route = useRoute()
const { pending, error, loadIndex, searchArticles } = useSearchIndex()

await loadIndex()

const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const searchInput = ref(query.value)
const pageSize = 20

watch(query, (value) => {
  searchInput.value = value
})

const results = computed(() => searchArticles(query.value))
const requestedPage = computed(() => {
  const value = Number(route.query.page ?? 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / pageSize)))
const currentPage = computed(() => Math.min(requestedPage.value, pageCount.value))
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return results.value.slice(start, start + pageSize)
})

useHead(() => ({
  title: query.value ? `Поиск: ${query.value}` : 'Поиск',
}))

async function submitSearch() {
  const value = searchInput.value.trim()
  if (!value) return
  await navigateTo({ path: '/search', query: { q: value } })
}

async function changePage(page: number) {
  await navigateTo({
    path: '/search',
    query: {
      q: query.value,
      ...(page > 1 ? { page: String(page) } : {}),
    },
  })
}
</script>

<template>
  <main id="main-content" class="mx-auto max-w-[1370px] px-[25px] pt-[90px] pb-[110px]">
    <div class="mt-[30px] mb-[34px]">
      <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]">
        БАЗА ЗНАНИЙ
      </span>
      <h1 class="mb-2.5 text-[48px] font-extrabold tracking-[-.045em] text-[#f2f5ff]">
        Поиск по справке
      </h1>
      <p class="text-[14px] leading-[1.65] text-[#a2b5d7]">
        Найдите нужную инструкцию, ответ или материал базы знаний.
      </p>
    </div>

    <form
      class="mb-8 flex max-w-[760px] items-center gap-3 rounded-2xl border border-[#a9bfff38] bg-[#b3caff0d] p-2 shadow-[0_12px_40px_#02081730] backdrop-blur-xl"
      role="search"
      @submit.prevent="submitSearch"
    >
      <svg
        class="ml-3 size-5 shrink-0 text-[#9db5ff]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" stroke-linecap="round" />
      </svg>
      <input
        v-model="searchInput"
        class="min-w-0 flex-1 bg-transparent px-1 py-3 text-[14px] text-[#f2f5ff] outline-none placeholder:text-[#8295bc]"
        type="search"
        placeholder="Введите название статьи…"
        aria-label="Поисковый запрос"
      />
      <button
        type="submit"
        class="rounded-xl bg-[#607df2] px-5 py-3 text-[12px] font-extrabold text-white transition hover:bg-[#7892ff]"
      >
        Найти
      </button>
    </form>

    <div v-if="pending" class="py-10 text-[14px] text-[#a2b5d7]">
      Загружаем поисковый индекс…
    </div>
    <div v-else-if="error" class="max-w-[760px] rounded-2xl border border-[#e5a9b52c] bg-[#a94c5a12] p-5 text-[13px] text-[#f0c4cc]">
      Поиск временно недоступен. Попробуйте обновить страницу немного позже.
    </div>
    <template v-else-if="query">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p class="text-[13px] text-[#a2b5d7]">
          Найдено: <strong class="text-[#e8eeff]">{{ results.length }}</strong>
          <span v-if="results.length">по запросу «{{ query }}»</span>
        </p>
        <span v-if="results.length" class="text-[11px] text-[#8295bc]">
          Страница {{ currentPage }} из {{ pageCount }}
        </span>
      </div>

      <div v-if="paginatedResults.length" class="max-w-[900px] space-y-2">
        <NuxtLink
          v-for="article in paginatedResults"
          :key="article.slug"
          :to="`/articles/${article.slug}`"
          class="group flex items-center gap-4 rounded-2xl border border-[#a9bfff24] bg-[#b3caff0a] px-5 py-4 transition hover:border-[#9db5ff65] hover:bg-[#b3caff14]"
        >
          <span
            class="grid size-11 shrink-0 place-items-center rounded-xl border border-[#a9bfff24] bg-[#b3caff12] text-[18px]"
            aria-hidden="true"
          >{{ article.category?.icon || '•' }}</span>
          <span class="min-w-0 flex-1">
            <span class="block text-[14px] font-bold text-[#e8eeff] group-hover:text-white">
              {{ article.title }}
            </span>
            <span class="mt-1 block text-[11px] text-[#8298c7]">
              Открыть статью
            </span>
          </span>
          <svg
            class="size-4 shrink-0 text-[#8298c7] transition group-hover:translate-x-1 group-hover:text-[#cbd8ff]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>
      <div v-else class="max-w-[760px] rounded-2xl border border-[#a9bfff24] bg-[#b3caff0a] p-6">
        <h2 class="text-[16px] font-bold text-[#e8eeff]">Ничего не найдено</h2>
        <p class="mt-2 text-[13px] leading-6 text-[#a2b5d7]">
          Попробуйте проверить запрос или использовать другие слова.
        </p>
        <NuxtLink
          to="/catalog"
          class="mt-4 inline-flex rounded-xl bg-[#607df2] px-4 py-3 text-[12px] font-bold text-white hover:bg-[#7892ff]"
        >
          Перейти в каталог
        </NuxtLink>
      </div>

      <nav
        v-if="pageCount > 1"
        class="mt-7 flex max-w-[900px] items-center justify-between border-t border-[#a9bfff24] pt-5"
        aria-label="Страницы результатов поиска"
      >
        <button
          type="button"
          class="rounded-xl border border-[#a9bfff30] px-4 py-2.5 text-[12px] font-semibold text-[#cbd8ff] transition hover:bg-[#b3caff12] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          ← Назад
        </button>
        <span class="text-[12px] text-[#a2b5d7]">
          {{ currentPage }} / {{ pageCount }}
        </span>
        <button
          type="button"
          class="rounded-xl border border-[#a9bfff30] px-4 py-2.5 text-[12px] font-semibold text-[#cbd8ff] transition hover:bg-[#b3caff12] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage >= pageCount"
          @click="changePage(currentPage + 1)"
        >
          Далее →
        </button>
      </nav>
    </template>
    <p v-else class="text-[13px] text-[#a2b5d7]">
      Введите запрос, чтобы найти опубликованные статьи.
    </p>
  </main>
</template>
