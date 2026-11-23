<script setup lang="ts">
definePageMeta({ key: (route) => route.path })
const route = useRoute()
const { data, pending, error, refresh } = await useKnowledgeBase()
const category = computed(() =>
  data.value?.categories.find((item) => item.slug === route.params.slug),
)
const articles = computed(
  () => data.value?.articles.filter((article) => article.category.id === category.value?.id) ?? [],
)
if (!error.value && !category.value)
  throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Раздел не найден' })
useHead(() => ({ title: category.value?.name ?? 'Раздел справки' }))
</script>

<template>
  <div
    class="mx-auto grid min-h-[1050px] max-w-[1520px] grid-cols-[260px_1fr] gap-[45px] px-[55px] pt-[42px] pb-[95px] max-[1100px]:gap-5 max-[1100px]:p-[30px]"
  >
    <KnowledgeSidebar :categories="data?.categories ?? []" :total="data?.articles.length ?? 0" />
    <main id="main-content" class="min-w-0">
      <ContentState :pending="pending" :failed="!!error" @retry="refresh()">
        <template v-if="category">
          <div class="mt-[30px] mb-[34px]">
            <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
              >РАЗДЕЛ СПРАВКИ</span
            >
            <h1 class="mb-2.5 text-[48px] font-extrabold tracking-[-.045em] text-[#f2f5ff]">
              {{ category.name }}
            </h1>
            <p class="text-[14px] leading-[1.65] text-[#a2b5d7]">{{ category.description }}</p>
          </div>
          <DemoNotice v-if="articles.some((article) => article.is_demo)" />
          <div
            class="flex min-h-[270px] justify-between overflow-hidden rounded-[23px] bg-[radial-gradient(ellipse_at_70%_35%,#7352ba,transparent_49%),linear-gradient(110deg,#152a59,#101e3d)] px-[45px] py-[38px] text-white"
          >
            <div>
              <span class="text-[11px] font-extrabold tracking-[.15em] text-[#b9c8ff]"
                >✳ &nbsp; {{ category.name }}</span
              >
              <h2 class="my-[17px] text-[30px] leading-[1.2] font-bold tracking-[-.045em]">
                Нужные ответы<br />в одном разделе.
              </h2>
              <p class="text-[13px] leading-[1.65] text-[#c4cdec]">{{ category.description }}</p>
            </div>
            <span
              class="shrink-0 -rotate-20 text-[220px] leading-[.8] text-[#b5c4ff70]"
              aria-hidden="true"
              >{{ category.icon }}</span
            >
          </div>
          <div class="mt-[39px] mb-5 flex items-end justify-between">
            <div>
              <h2 class="text-[23px] font-[750] tracking-[-.04em]">Темы раздела</h2>
              <p class="mt-2 text-[12px] leading-[1.65] text-[#a2b5d7]">
                Выбери тему — и найди нужную инструкцию
              </p>
            </div>
          </div>
          <div class="grid grid-cols-[repeat(3,1fr)] gap-3 bg-[#a8bdff11] text-[#e5edff]">
            <NuxtLink
              v-for="article in articles"
              :key="article.id"
              class="relative min-h-[125px] rounded-[14px] border border-[#bdcaff28] bg-[linear-gradient(130deg,#a9c8ff14,#717dcc09)] p-[19px] text-[#e6edff] shadow-[inset_0_1px_#ffffff12,0_14px_35px_#0309192b] backdrop-blur-[20px]"
              :to="`/articles/${article.slug}`"
              ><span
                class="mb-3 grid size-8 place-items-center rounded-[10px] text-[19px]"
                :class="categoryTone(category.tone)"
                aria-hidden="true"
                >{{ category.icon }}</span
              ><b class="block text-[13px] font-bold text-[#eef3ff]">{{ article.title }}</b
              ><small class="mt-1 block text-[11px] text-[#a3b4d4]"
                >◷ {{ article.reading_minutes }} мин чтения</small
              ></NuxtLink
            >
          </div>
          <div class="mt-[39px] mb-5 flex items-end justify-between">
            <div>
              <h2 class="text-[23px] font-[750] tracking-[-.04em]">Статьи раздела</h2>
              <p class="mt-2 text-[12px] leading-[1.65] text-[#a2b5d7]">
                Инструкции и полезные материалы
              </p>
            </div>
            <NuxtLink to="/catalog" class="text-[13px] font-bold text-[#b2bdff] hover:underline"
              >Все статьи</NuxtLink
            >
          </div>
          <ContentState :empty="!articles.length"
            ><div class="grid grid-cols-[1fr_1fr] gap-3 max-[1100px]:grid-cols-1">
              <ArticleCard
                v-for="article in articles"
                :key="article.id"
                compact
                :article="article"
              /></div
          ></ContentState>
        </template>
      </ContentState>
    </main>
  </div>
</template>
