<script setup lang="ts">
import type { Article } from '~~/shared/types/content'
definePageMeta({ key: (route) => route.path })
const route = useRoute()
const {
  data: article,
  pending,
  error,
  refresh,
} = await useFetch<Article>(() => `/api/articles/${encodeURIComponent(String(route.params.slug))}`)
const { data: knowledge } = await useKnowledgeBase()
if (error.value?.statusCode === 404)
  throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Статья не найдена' })
const related = computed(
  () =>
    knowledge.value?.articles.filter((item) => item.category.id === article.value?.category.id) ??
    [],
)
const updated = computed(() =>
  article.value?.date_updated
    ? new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Yekaterinburg',
      }).format(new Date(article.value.date_updated))
    : '',
)
useHead(() => ({
  title: article.value?.title ?? 'Статья',
  meta: [{ name: 'description', content: article.value?.excerpt ?? '' }],
}))
</script>

<template>
  <div
    class="mx-auto grid max-w-[1530px] grid-cols-[245px_minmax(0,790px)_220px] items-start gap-[50px] bg-[#f4f7fc] px-[45px] pt-[38px] pb-[95px] text-[#263653] max-[1100px]:grid-cols-[200px_1fr]"
  >
    <aside class="min-h-[1130px] border-r border-[#dce5f2] bg-[#f0f4fb] pr-5 text-[#233958]">
      <div class="mx-3 mt-7 mb-2.5 text-[10px] font-extrabold tracking-[.15em] text-[#9bb0d8]">
        БАЗА ЗНАНИЙ / РАЗДЕЛЫ
      </div>
      <nav aria-label="Статьи раздела">
        <b
          class="flex justify-between border-b border-[#e7ebf4] px-2 pt-5 pb-[22px] text-[13px] font-bold text-[#14274b]"
          >{{ article?.category.name ?? 'Справка' }}</b><NuxtLink
          v-for="item in related"
          :key="item.id"
          :to="`/articles/${item.slug}`"
          class="mx-0 my-0.5 block rounded-[9px] px-[15px] py-[11px] text-[12px] text-[#516786] aria-[current=page]:bg-[#dce6ff] aria-[current=page]:text-[#335bca]"
          >{{ item.title }}</NuxtLink
        ><small class="mx-2.5 mt-5 mb-[11px] block text-[11px] font-[750] text-[#a2adc0]"
          >Другие разделы</small
        ><NuxtLink
          v-for="category in knowledge?.categories"
          :key="category.id"
          :to="`/sections/${category.slug}`"
          class="mx-0 my-0.5 block rounded-[9px] px-[15px] py-[11px] text-[12px] text-[#516786]"
          >{{ category.name }}</NuxtLink
        >
      </nav>
    </aside>
    <main id="main-content" class="text-[#192747]">
      <ContentState :pending="pending" :failed="!!error" @retry="refresh()">
        <template v-if="article">
          <nav class="mt-4 mb-[35px] text-[11px] text-[#7185a7]" aria-label="Хлебные крошки">
            <NuxtLink to="/">Главная</NuxtLink><span class="px-2.5">›</span
            ><NuxtLink :to="`/sections/${article.category.slug}`">{{
              article.category.name
            }}</NuxtLink
            ><span class="px-2.5">›</span>{{ article.title }}
          </nav>
          <DemoNotice v-if="article.is_demo" />
          <span
            class="inline-flex rounded-lg bg-[#dce6ff] px-3 py-[7px] text-[10px] font-extrabold tracking-[.05em] text-[#335bca]"
            >{{ article.category.name }}</span
          >
          <h1
            class="mt-[21px] mb-[17px] text-[43px] leading-[1.14] font-extrabold tracking-[-.045em] text-[#14274b]"
          >
            {{ article.title }}
          </h1>
          <p class="text-[15px] leading-[1.8] text-[#596c89]">{{ article.excerpt }}</p>
          <div
            class="mt-0 mb-7 flex gap-5 border-b border-[#e7ebf3] py-[25px] text-[11px] text-[#596c89]"
          >
            <span>◷ {{ article.reading_minutes }} мин чтения</span
            ><span v-if="updated">Обновлено {{ updated }}</span>
          </div>
          <div
            class="relative flex h-[210px] items-end justify-between overflow-hidden rounded-[18px] bg-[radial-gradient(ellipse_at_80%_45%,#6e5ac7,transparent_40%),linear-gradient(125deg,#152954,#4b67af)] p-[38px] text-white"
          >
            <div
              class="absolute -top-[75px] right-[140px] size-[230px] rounded-full border border-[#ffffff9c] bg-[radial-gradient(circle_at_28%_22%,#fff9,transparent_24%),linear-gradient(135deg,#92c6ff86,#a16ddd55)] shadow-[inset_0_0_36px_#efff]"
              aria-hidden="true"
            />
            <span class="self-start text-[10px] leading-[1.8] font-bold tracking-[.2em]">{{
              article.category.name
            }}</span><strong class="z-1 text-[25px] font-bold tracking-[-.04em]"
              >Всё по шагам. ✳</strong
            >
          </div>
          <!-- Only sanitized HTML from the server-side allowlist is rendered here. -->
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="[&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#596c89] [&_p+p]:mt-3 [&_li]:text-[14px] [&_li]:leading-[1.85] [&_li]:text-[#596c89] [&_a]:text-[#3659b9] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:rounded-[13px] [&_blockquote]:border [&_blockquote]:border-[#d4e1ff] [&_blockquote]:bg-[#edf3ff] [&_blockquote]:px-5 [&_blockquote]:py-[17px] [&_h2]:mt-[34px] [&_h2]:mb-3 [&_h2]:scroll-mt-6 [&_h2]:text-[23px] [&_h2]:font-extrabold [&_h2]:tracking-[-.045em] [&_h2]:text-[#14274b] [&_h3]:scroll-mt-6 [&_h3]:text-[1.17em] [&_h3]:font-bold [&_h3]:tracking-[-.045em] [&_h3]:text-[#14274b] [&_ul]:my-[14px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-[14px] [&_ol]:list-decimal [&_ol]:pl-10"
            v-html="article.body"
          />
          <!-- eslint-enable vue/no-v-html -->
          <NuxtLink
            class="mt-8 flex items-center gap-[13px] rounded-xl border border-[#dae3f3] bg-white px-5 py-4 text-[26px] text-[#4965c1]"
            :to="`/sections/${article.category.slug}`"
            >Все материалы раздела</NuxtLink
          >
        </template>
      </ContentState>
    </main>
    <aside
      v-if="article"
      class="sticky top-[30px] mt-[77px] border-l border-[#dbe5f3] bg-[#eef3fb] pl-[25px] text-[#374d70] max-[1100px]:hidden"
      aria-label="Оглавление статьи"
    >
      <b class="text-[10px] font-bold tracking-[.13em] text-[#8592a9]">НА ЭТОЙ СТРАНИЦЕ</b
      ><a
        v-for="heading in article.toc"
        :key="heading.id"
        :href="`#${heading.id}`"
        class="block py-3 pl-3 text-[11px] leading-[1.45] text-[#536887]"
        >{{ heading.title }}</a
      >
      <div class="mt-[35px] rounded-[13px] bg-[#e1eaff] p-[19px] text-[#263d6c]">
        <strong class="text-[13px] font-bold">Остались вопросы?</strong>
        <p class="my-2 text-[11px] leading-[1.65] text-[#7f8cac]">
          Посмотри похожие материалы в этом разделе.
        </p>
        <NuxtLink
          class="block py-3 pl-3 text-[11px] leading-[1.45] text-[#536887]"
          :to="`/sections/${article.category.slug}`"
          >Все материалы</NuxtLink
        >
      </div>
    </aside>
  </div>
</template>
