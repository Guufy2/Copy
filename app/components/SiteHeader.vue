<script setup lang="ts">
const route = useRoute()
const isArticle = computed(() => route.path.startsWith('/articles/'))
const mobileMenu = ref<HTMLDetailsElement | null>(null)
const searchOpen = ref(false)
const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Все статьи' },
  { to: '/sections', label: 'Разделы' },
  { to: '/faq', label: 'Вопросы и ответы' },
]
</script>

<template>
  <header
    class="relative z-10 flex h-16 items-center gap-3 border-b border-[#adc0ff30] px-4 backdrop-blur-[24px] sm:px-5 md:h-20 md:gap-5 xl:gap-[60px]"
    :class="
      isArticle
        ? 'bg-[linear-gradient(110deg,#0c1a39,#1b2d51)] text-white'
        : 'bg-[linear-gradient(100deg,#07132bed,#172747ec)] text-[#e7edff]'
    "
  >
    <SiteBrand class="shrink-0" />
    <nav
      class="hidden min-w-0 flex-1 items-center gap-3 text-[13px] font-semibold text-[#b3c4e5] md:flex lg:gap-6 xl:gap-9"
      aria-label="Основная навигация"
    >
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="whitespace-nowrap hover:underline aria-[current=page]:text-[#f2f5ff]"
        >{{ item.label }}</NuxtLink
      >
    </nav>
    <div class="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-[11px] border border-[#a7c4ff36] bg-[#b3caff12] text-[#b3c4e5] transition hover:border-[#a7c4ff70] hover:bg-[#b3caff20] lg:h-[38px] lg:w-[225px] lg:justify-start lg:gap-2 lg:px-3"
        aria-label="Открыть поиск по справке"
        @click="searchOpen = true"
      >
        <svg
          class="size-5 shrink-0 lg:size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" stroke-linecap="round" />
        </svg>
        <span class="hidden text-[12px] lg:inline">Поиск по справке</span>
      </button>
      <details
        ref="mobileMenu"
        class="relative md:hidden"
        @keydown.esc="mobileMenu?.removeAttribute('open')"
      >
        <summary
          class="grid size-11 cursor-pointer list-none place-items-center rounded-[11px] border border-[#a7c4ff36] bg-[#b3caff12] text-[#b3c4e5] [&::-webkit-details-marker]:hidden"
          aria-label="Меню навигации"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>
        <nav
          class="absolute top-[calc(100%+12px)] right-0 z-20 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-[#a7c4ff36] bg-[#0c1a39] p-2 text-[14px] font-semibold text-[#b3c4e5] shadow-[0_14px_35px_#03091980]"
          aria-label="Мобильная навигация"
        >
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex min-h-11 items-center rounded-xl px-4 py-3 hover:bg-[#b3caff12] aria-[current=page]:bg-[#b3caff12] aria-[current=page]:text-[#f2f5ff]"
            @click="mobileMenu?.removeAttribute('open')"
            >{{ item.label }}</NuxtLink
          >
        </nav>
      </details>
    </div>
  </header>
  <SearchDialog v-model="searchOpen" />
</template>
