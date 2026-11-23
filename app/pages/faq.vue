<script setup lang="ts">
useHead({ title: 'Частые вопросы' })
const { data, pending, error, refresh } = await useKnowledgeBase()
const route = useRoute()
const selected = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : '',
)
const questions = computed(
  () =>
    data.value?.articles.filter(
      (article) => article.is_faq && (!selected.value || article.category.slug === selected.value),
    ) ?? [],
)
</script>

<template>
  <main id="main-content" class="bg-transparent pb-[95px]">
    <section class="h-[460px] pt-[65px] text-center text-white">
      <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#a6b6ff]"
        >ЗДЕСЬ ЕСТЬ ОТВЕТЫ</span
      >
      <h1 class="text-[51px] leading-[1.14] font-bold tracking-[-.045em]">
        Вопросы, которые<br /><em
          class="bg-[linear-gradient(90deg,#9ed8ff,#c6b2ff_45%,#d995ff)] bg-clip-text text-transparent not-italic"
          >задают чаще всего.</em
        >
      </h1>
      <p class="mx-auto my-[19px] max-w-[550px] text-[14px] leading-[1.65] text-[#bdcbed]">
        Собрали материалы о том, что обычно приходится искать по десяткам чатов и документов.
      </p>
      <SearchPlaceholder compact placeholder="Поиск по частым вопросам…" />
    </section>
    <div
      class="relative z-2 mx-auto -mt-[38px] max-w-[1050px] rounded-[23px] border border-[#bdcaff28] bg-[#132346ee] px-[43px] pt-[35px] pb-[55px] text-[#e6edff] shadow-[inset_0_1px_#ffffff12,0_14px_35px_#0309192b] backdrop-blur-[20px]"
    >
      <div class="mb-[25px] flex items-end justify-between">
        <div>
          <h2 class="text-[23px] font-[750] tracking-[-.04em]">Популярные вопросы</h2>
          <p class="mt-2 text-[12px] leading-[1.65] text-[#a2b5d7]">
            Выбери вопрос, чтобы перейти к подробной статье
          </p>
        </div>
        <span
          class="inline-block rounded-[20px] bg-[#e9eeff] px-[9px] py-[5px] align-middle text-[11px] tracking-normal text-[#6576ea]"
          >{{ questions.length }}</span
        >
      </div>
      <DemoNotice v-if="questions.some((article) => article.is_demo)" />
      <ContentState :pending="pending" :failed="!!error" @retry="refresh()">
        <nav class="mb-5 flex flex-wrap gap-2" aria-label="Фильтр вопросов по разделу">
          <NuxtLink
            class="rounded-[9px] border border-[#b8caff2a] px-[15px] py-[11px] text-[11px] font-bold"
            :class="!selected ? 'bg-[#506dff] text-white' : 'bg-[#a8bdff11] text-[#e5edff]'"
            to="/faq"
            >Все материалы</NuxtLink
          ><NuxtLink
            v-for="category in data?.categories"
            :key="category.id"
            class="rounded-[9px] border border-[#b8caff2a] px-[15px] py-[11px] text-[11px] font-bold"
            :class="
              selected === category.slug
                ? 'bg-[#506dff] text-white'
                : 'bg-[#a8bdff11] text-[#e5edff]'
            "
            :to="{ path: '/faq', query: { category: category.slug } }"
            >{{ category.name }}</NuxtLink
          >
        </nav>
        <ContentState :empty="!questions.length"
          ><div class="border-t border-[#e8edf6]">
            <NuxtLink
              v-for="article in questions"
              :key="article.id"
              class="flex items-center gap-[23px] border-b border-[#baccff2a] px-2 py-[19px] text-inherit backdrop-blur-[20px]"
              :to="`/articles/${article.slug}`"
              ><div class="flex-1">
                <b class="text-[14px] font-bold">{{ article.title }}</b><small
                  class="mt-[5px] block text-[11px] text-[#a8bcde]"
                  >{{ article.category.name }} · Подробнее в базе знаний</small
                >
              </div></NuxtLink
            >
          </div></ContentState
        >
      </ContentState>
      <div
        class="mt-[33px] flex items-center justify-between rounded-[18px] border border-[#9db5ff32] bg-[linear-gradient(120deg,#496ec73d,#7353a833)] px-[30px] py-[26px] text-[#e8edff]"
      >
        <div>
          <h2 class="text-[21px] font-bold tracking-[-.045em]">Не нашёл нужного вопроса?</h2>
          <p class="mt-[6px] text-[12px] leading-[1.65] text-[#b9c9e8]">
            Посмотри остальные материалы в каталоге статей.
          </p>
        </div>
        <NuxtLink
          class="inline-block rounded-xl bg-[#516bf4] px-[21px] py-[13px] text-[12px] font-extrabold text-white"
          to="/catalog"
          >Открыть каталог</NuxtLink
        >
      </div>
    </div>
  </main>
</template>
