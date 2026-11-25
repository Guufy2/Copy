<script setup lang="ts">
import type { SearchIndexArticle } from '~~/shared/types/content'

const isOpen = defineModel<boolean>({ default: false })
const query = ref('')
const history = ref<string[]>([])
const activeIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const { pending, error, loadIndex, searchArticles } = useSearchIndex()

const HISTORY_KEY = 'istu-search-history'
const suggestions = computed(() => (query.value.trim() ? searchArticles(query.value).slice(0, 7) : []))

function readHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    const parsed: unknown = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 10)
      : []
  } catch {
    return []
  }
}

function recordHistory(value: string) {
  const cleaned = value.trim()
  if (!cleaned) return

  const normalized = normalizeSearchQuery(cleaned)
  history.value = [
    cleaned,
    ...history.value.filter((item) => normalizeSearchQuery(item) !== normalized),
  ].slice(0, 10)

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  } catch {
    // Поиск продолжает работать, даже если браузер запретил localStorage.
  }
}

function close() {
  isOpen.value = false
}

async function submitSearch(value = query.value) {
  const cleaned = value.trim()
  if (!cleaned) return

  recordHistory(cleaned)
  close()
  await navigateTo({ path: '/search', query: { q: cleaned } })
}

async function openArticle(article: SearchIndexArticle) {
  recordHistory(query.value || article.title)
  close()
  await navigateTo(`/articles/${encodeURIComponent(article.slug)}`)
}

function chooseHistory(value: string) {
  query.value = value
  void submitSearch(value)
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' && suggestions.value.length) {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
  } else if (event.key === 'ArrowUp' && suggestions.value.length) {
    event.preventDefault()
    activeIndex.value =
      (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

watch(query, () => {
  activeIndex.value = 0
})

watch(isOpen, async (open) => {
  if (open) {
    history.value = readHistory()
    await loadIndex()
    await nextTick()
    searchInput.value?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

watch(isOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#030817b8] px-4 pt-[12vh] pb-8 backdrop-blur-md sm:pt-[15vh]"
        @click.self="close"
      >
        <section
          class="w-full max-w-[640px] overflow-hidden rounded-[24px] border border-[#b8caff38] bg-[linear-gradient(145deg,#15284af2,#0a1730f5)] shadow-[0_28px_100px_#020817b8,0_0_45px_#718cff18] ring-1 ring-white/[0.04]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
          @keydown.esc.stop.prevent="close"
        >
          <h2 id="search-dialog-title" class="sr-only">Поиск по справке</h2>

          <div class="flex items-center gap-3 border-b border-[#b8caff24] px-5 py-4 sm:px-6">
            <svg
              class="size-5 shrink-0 text-[#9db5ff]"
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
              ref="searchInput"
              v-model="query"
              class="min-w-0 flex-1 bg-transparent text-[16px] text-[#f2f5ff] outline-none placeholder:text-[#8295bc]"
              type="search"
              placeholder="Что хотите найти?"
              autocomplete="off"
              aria-label="Поиск по статьям"
              @keydown="handleInputKeydown"
              @keydown.enter.prevent="submitSearch()"
            />
            <button
              type="button"
              class="rounded-lg border border-[#b8caff30] bg-[#b3caff12] px-2 py-1 text-[11px] font-semibold text-[#aebfe2] hover:bg-[#b3caff22]"
              aria-label="Закрыть поиск"
              @click="close"
            >
              Esc
            </button>
          </div>

          <div class="max-h-[min(60vh,520px)] overflow-y-auto px-3 py-4 sm:px-4">
            <template v-if="query.trim()">
              <div class="mb-2 px-3 text-[10px] font-extrabold tracking-[.16em] text-[#8198c4]">
                ПОДСКАЗКИ
              </div>
              <div v-if="pending" class="px-3 py-5 text-[13px] text-[#a2b5d7]">
                Загружаем статьи…
              </div>
              <div v-else-if="error" class="px-3 py-5 text-[13px] text-[#e2b9c2]">
                Не удалось загрузить поиск. Попробуйте закрыть и открыть окно ещё раз.
              </div>
              <div v-else-if="suggestions.length" class="space-y-1">
                <button
                  v-for="(article, index) in suggestions"
                  :key="article.slug"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                  :class="
                    activeIndex === index
                      ? 'bg-[#7896ff25] text-white'
                      : 'text-[#dce6ff] hover:bg-[#b3caff12]'
                  "
                  @mouseenter="activeIndex = index"
                  @click="openArticle(article)"
                >
                  <span
                    class="grid size-9 shrink-0 place-items-center rounded-xl border border-[#a9bfff24] bg-[#b3caff12] text-[16px]"
                    aria-hidden="true"
                  >{{ article.category?.icon || '•' }}</span>
                  <span class="min-w-0 flex-1 truncate text-[13px] font-semibold">
                    {{ article.title }}
                  </span>
                  <svg
                    class="size-4 shrink-0 text-[#8298c7]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
              <p v-else class="px-3 py-5 text-[13px] text-[#a2b5d7]">
                Ничего не найдено. Попробуйте изменить запрос.
              </p>
              <button
                v-if="!pending && !error"
                type="button"
                class="mt-3 flex w-full items-center justify-between rounded-xl border border-[#a9bfff26] bg-[#b3caff0d] px-4 py-3 text-left text-[12px] font-bold text-[#cbd8ff] transition hover:bg-[#b3caff18]"
                @click="submitSearch()"
              >
                Все результаты
                <span aria-hidden="true">→</span>
              </button>
            </template>

            <template v-else>
              <div class="mb-2 flex items-center justify-between px-3">
                <span class="text-[10px] font-extrabold tracking-[.16em] text-[#8198c4]">
                  ИСТОРИЯ ПОИСКА
                </span>
                <button
                  v-if="history.length"
                  type="button"
                  class="text-[11px] font-semibold text-[#8fa8e1] hover:text-white"
                  @click="history = []; localStorage.removeItem(HISTORY_KEY)"
                >
                  Очистить
                </button>
              </div>
              <div v-if="history.length" class="space-y-1">
                <button
                  v-for="item in history"
                  :key="item"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] text-[#c4d2f1] transition hover:bg-[#b3caff12]"
                  @click="chooseHistory(item)"
                >
                  <svg
                    class="size-4 shrink-0 text-[#8198c4]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" stroke-linecap="round" />
                  </svg>
                  {{ item }}
                </button>
              </div>
              <p v-else class="px-3 py-5 text-[13px] text-[#8295bc]">
                Здесь появятся ваши недавние запросы.
              </p>
            </template>
          </div>

          <div
            class="flex items-center justify-between border-t border-[#b8caff24] px-5 py-3 text-[10px] text-[#8198c4] sm:px-6"
          >
            <span>Введите запрос, чтобы найти статью</span>
            <span><kbd class="rounded border border-[#a9bfff30] px-1.5 py-1">Enter</kbd> искать</span>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
