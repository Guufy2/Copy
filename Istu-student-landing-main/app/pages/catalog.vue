<script setup lang="ts">
useHead({ title: 'Все статьи' })
const { data, pending, error, refresh } = await useKnowledgeBase()
const route = useRoute()
const selected = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : '',
)
const articles = computed(
  () =>
    data.value?.articles.filter(
      (article) => !selected.value || article.category.slug === selected.value,
    ) ?? [],
)
</script>

<template>
  <div
    class="mx-auto grid min-h-[1050px] max-w-[1520px] grid-cols-[260px_1fr] gap-[45px] px-[55px] pt-[42px] pb-[95px] max-[1100px]:gap-5 max-[1100px]:p-[30px]"
  >
    <KnowledgeSidebar :categories="data?.categories ?? []" :total="data?.articles.length ?? 0" />
    <main id="main-content" class="min-w-0">
      <div class="mt-[30px] mb-[34px]">
        <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
          >БАЗА ЗНАНИЙ</span
        >
        <h1 class="mb-2.5 text-[48px] font-extrabold tracking-[-.045em] text-[#f2f5ff]">
          Все статьи
        </h1>
        <p class="text-[14px] leading-[1.65] text-[#a2b5d7]">
          Ответы, инструкции и полезные материалы — всё в одном месте.
        </p>
      </div>
      <DemoNotice v-if="data?.articles.some((article) => article.is_demo)" />
      <ContentState :pending="pending" :failed="!!error" @retry="refresh()">
        <div class="mb-[43px] grid grid-cols-[repeat(5,1fr)] gap-3">
          <CategoryTile
            v-for="category in data?.categories"
            :key="category.id"
            compact
            :category="category"
            :count="
              data?.articles.filter((article) => article.category.id === category.id).length ?? 0
            "
          />
        </div>
        <div class="mb-[21px] flex items-center justify-between">
          <h2 class="text-[23px] font-bold tracking-[-.04em] text-[#f2f5ff]">
            Материалы справки
            <span
              class="inline-block rounded-[20px] bg-[#e9eeff] px-[9px] py-[5px] align-middle text-[11px] tracking-normal text-[#6576ea]"
              >{{ articles.length }}</span
            >
          </h2>
        </div>
        <nav class="mb-5 flex flex-wrap gap-2" aria-label="Фильтр по разделу">
          <NuxtLink
            class="rounded-[9px] border border-[#b8caff2a] px-[15px] py-[11px] text-[11px] font-bold"
            :class="!selected ? 'bg-[#506dff] text-white' : 'bg-[#a8bdff11] text-[#e5edff]'"
            to="/catalog"
            :aria-current="!selected ? 'page' : undefined"
            >Все материалы</NuxtLink
          >
          <NuxtLink
            v-for="category in data?.categories"
            :key="category.id"
            class="rounded-[9px] border border-[#b8caff2a] px-[15px] py-[11px] text-[11px] font-bold"
            :class="
              selected === category.slug
                ? 'bg-[#506dff] text-white'
                : 'bg-[#a8bdff11] text-[#e5edff]'
            "
            :to="{ path: '/catalog', query: { category: category.slug } }"
            :aria-current="selected === category.slug ? 'page' : undefined"
            >{{ category.name }}</NuxtLink
          >
        </nav>
        <ContentState :empty="!articles.length"
          ><div class="grid grid-cols-[1fr_1fr] gap-3 max-[1100px]:grid-cols-1">
            <ArticleCard
              v-for="article in articles"
              :key="article.id"
              compact
              :article="article"
            /></div
        ></ContentState>
      </ContentState>
    </main>
  </div>
</template>
