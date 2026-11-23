<script setup lang="ts">
useHead({ title: 'Главная' })
const { data, pending, error, refresh } = await useKnowledgeBase()
const featured = computed(
  () => data.value?.articles.filter((article) => article.featured).slice(0, 4) ?? [],
)
const questions = computed(
  () => data.value?.articles.filter((article) => article.is_faq).slice(0, 6) ?? [],
)
</script>

<template>
  <div>
    <section
      class="relative overflow-hidden pb-8 sm:pb-10 lg:h-[730px] lg:pb-0 bg-transparent text-white before:absolute before:inset-0 before:content-[''] before:bg-[linear-gradient(90deg,transparent_49.92%,#ffffff08_50%,transparent_50.08%),linear-gradient(#ffffff06_1px,transparent_1px)] before:bg-size-[90px_90px] before:[mask-image:linear-gradient(to_bottom,transparent,#0008,transparent)]"
      aria-labelledby="hero-title"
    >
      <GlassSphere
        class="top-[70px] -left-[130px] size-[240px] -rotate-18 opacity-50 sm:-left-[150px] sm:size-[320px] lg:top-[92px] lg:-left-[195px] lg:size-[460px] lg:opacity-100"
      />
      <GlassSphere
        class="-top-[60px] -right-[90px] size-[220px] opacity-60 sm:size-[300px] lg:top-0 lg:-right-[125px] lg:size-[375px] lg:opacity-100"
      />
      <GlassSphere
        class="right-[30px] bottom-[65px] hidden size-[150px] opacity-70 md:block lg:right-[110px] lg:bottom-[85px] lg:size-[205px]"
      />
      <div
        class="relative z-1 mx-auto max-w-[900px] px-4 pt-12 text-center sm:px-6 sm:pt-16 lg:px-0 lg:pt-24"
      >
        <span
          class="inline-flex max-w-full items-center gap-2 rounded-[40px] border border-[#a0b5ff47] bg-[#c4d2ff14] px-3 py-[9px] text-[9px] font-extrabold tracking-[.12em] sm:px-[15px] sm:text-[10px] sm:tracking-[.18em] text-[#c0cdf8]"
          ><i
            class="size-[6px] shrink-0 rounded-full bg-[#6ff9e5] shadow-[0_0_12px_#6ff9e5]"
            aria-hidden="true"
          />ТВОЙ НАВИГАТОР ПО УНИВЕРСИТЕТУ</span
        >
        <h1
          id="hero-title"
          class="mx-auto mt-6 mb-5 text-[clamp(1.875rem,8vw,3.25rem)] lg:mt-7 lg:mb-[21px] lg:text-[64px] leading-[1.12] font-[750] tracking-[-.067em]"
        >
          В университете всё<br />сложнее, чем кажется.<br /><em
            class="bg-[linear-gradient(90deg,#9ed8ff,#c6b2ff_45%,#d995ff)] bg-clip-text text-transparent not-italic"
            >Но не со справкой.</em
          >
        </h1>
        <p class="mx-auto max-w-[590px] text-[15px] sm:text-[17px] leading-[1.7] text-[#becae9]">
          Ответы на вопросы об учёбе, документах, стипендиях и жизни в ИжГТУ — в одном месте.
        </p>
        <SearchPlaceholder />
        <div class="mt-6 text-[10px] lg:mt-[39px] font-[750] tracking-[.18em] text-[#a8bbef]">
          ПОПУЛЯРНЫЕ ВОПРОСЫ <span class="text-[18px] text-[#b88afb]" aria-hidden="true">▏</span>
        </div>
        <div class="mt-[14px] flex flex-wrap justify-center gap-2.5">
          <NuxtLink
            v-for="article in questions.slice(0, 3)"
            :key="article.id"
            :to="`/articles/${article.slug}`"
            class="inline-flex max-w-full"
            ><span
              class="inline-flex min-h-11 items-center justify-center rounded-[20px] border border-[#b5c7ff40] bg-[#ffffff17] px-[15px] py-2 text-center text-[12px] leading-[1.4] sm:py-[11px] text-[#e1e8fa] backdrop-blur-[14px]"
              >{{ article.title }}</span
            ></NuxtLink
          >
        </div>
      </div>
      <div
        class="relative mx-4 mt-8 flex flex-col items-center gap-3 text-center text-[9px] leading-[1.5] font-bold tracking-[.1em] text-[#9eacd2] sm:mx-6 sm:flex-row sm:justify-between sm:text-left sm:text-[10px] lg:absolute lg:right-[7%] lg:bottom-[30px] lg:left-[7%] lg:mx-0 lg:mt-0 lg:tracking-[.15em]"
      >
        <span>↓ &nbsp; ЛИСТАЙ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ</span
        ><span>Создано студентами · Для студентов</span>
      </div>
    </section>
    <main
      id="main-content"
      class="mx-auto max-w-[1370px] px-4 pt-12 pb-16 sm:px-[25px] sm:pt-[90px] sm:pb-[110px]"
    >
      <DemoNotice v-if="data?.articles.some((article) => article.is_demo)" />
      <div
        class="mb-[27px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
            >НАВИГАЦИЯ</span
          >
          <h2 class="text-[30px] font-[750] sm:text-[38px] tracking-[-.045em]">
            Найди то, что нужно
          </h2>
          <p class="mt-2 text-[14px] leading-[1.65] text-[#a2b5d7]">
            Всё университетское — по полочкам, а не в десятках чатов.
          </p>
        </div>
        <NuxtLink
          to="/catalog"
          class="shrink-0 text-[13px] font-bold text-[#b2bdff] hover:underline"
          >Открыть каталог</NuxtLink
        >
      </div>
      <ContentState
        :pending="pending"
        :failed="!!error"
        :empty="!data?.categories.length"
        @retry="refresh()"
      >
        <div
          class="grid grid-cols-1 gap-[14px] min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <CategoryTile
            v-for="category in data?.categories"
            :key="category.id"
            :category="category"
            :count="
              data?.articles.filter((article) => article.category.id === category.id).length ?? 0
            "
          />
        </div>
      </ContentState>
      <div
        class="mb-[27px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mt-14 sm:mt-24"
      >
        <div>
          <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
            >ПОД РУКОЙ</span
          >
          <h2 class="text-[30px] font-[750] sm:text-[38px] tracking-[-.045em]">
            Часто ищут студенты
          </h2>
          <p class="mt-2 text-[14px] leading-[1.65] text-[#a2b5d7]">
            Инструкции для ситуаций, которые случаются с каждым.
          </p>
        </div>
        <NuxtLink
          to="/catalog"
          class="shrink-0 text-[13px] font-bold text-[#b2bdff] hover:underline"
          >Все статьи</NuxtLink
        >
      </div>
      <ContentState
        :pending="pending"
        :failed="!!error"
        :empty="!featured.length"
        @retry="refresh()"
      >
        <div class="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <ArticleCard v-for="article in featured" :key="article.id" :article="article" />
        </div>
      </ContentState>
      <section
        class="relative my-14 flex min-h-[310px] sm:mt-[100px] sm:mb-[92px] overflow-hidden rounded-[29px] border border-[#b9caff38] bg-[radial-gradient(ellipse_at_75%_33%,#6248b1_0,transparent_55%),linear-gradient(120deg,#0b1b3c,#1b3068)] px-6 py-8 text-white sm:px-10 lg:px-[65px] lg:py-[55px] shadow-[0_24px_90px_#020b2780]"
        aria-labelledby="help-title"
      >
        <div>
          <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#b2c2ff]"
            >КОГДА НУЖНА ПОМОЩЬ</span
          >
          <h2 id="help-title" class="mb-3 text-[30px] font-[750] sm:text-[38px] tracking-[-.045em]">
            Не знаешь, с чего начать?
          </h2>
          <p class="max-w-[450px] leading-[1.65] text-[#b9c8ec]">
            Открой каталог и выбери тему — нужные инструкции собраны по разделам.
          </p>
          <NuxtLink
            class="mt-6 inline-block rounded-xl bg-white px-[21px] py-[13px] text-[12px] font-extrabold text-[#273b7d]"
            to="/catalog"
            >Найти статью</NuxtLink
          >
        </div>
        <div class="relative ml-auto hidden w-[300px] shrink-0 lg:block" aria-hidden="true">
          <div
            class="absolute grid size-[125px] place-items-center rounded-[32px] border border-[#eef9ff82] bg-[#aebfff42] text-[60px] text-white shadow-[inset_0_5px_25px_#ffffff62,0_20px_70px_#010d3499] backdrop-blur-[15px] top-[35px] left-[15px] rotate-17"
          >
            ✳
          </div>
          <div
            class="absolute grid size-[125px] place-items-center rounded-[32px] border border-[#eef9ff82] bg-[#aebfff42] text-[60px] text-white shadow-[inset_0_5px_25px_#ffffff62,0_20px_70px_#010d3499] backdrop-blur-[15px] -top-2.5 left-[115px] -rotate-15"
          >
            ?
          </div>
          <div
            class="absolute grid size-[125px] place-items-center rounded-[32px] border border-[#eef9ff82] bg-[#aebfff42] text-[60px] text-white shadow-[inset_0_5px_25px_#ffffff62,0_20px_70px_#010d3499] backdrop-blur-[15px] top-[105px] left-[165px] rotate-12"
          >
            ↗
          </div>
        </div>
      </section>
      <div
        class="mb-[27px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
            >КОРОТКО О ВАЖНОМ</span
          >
          <h2 class="text-[30px] font-[750] sm:text-[38px] tracking-[-.045em]">Частые вопросы</h2>
        </div>
        <NuxtLink to="/faq" class="shrink-0 text-[13px] font-bold text-[#b2bdff] hover:underline"
          >Смотреть все</NuxtLink
        >
      </div>
      <ContentState
        :pending="pending"
        :failed="!!error"
        :empty="!questions.length"
        @retry="refresh()"
      >
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <NuxtLink
            v-for="article in questions"
            :key="article.id"
            class="flex justify-between rounded-[13px] border border-[#bdcaff28] bg-[linear-gradient(130deg,#a9c8ff14,#717dcc09)] p-5 font-[650] text-[#e6edff] shadow-[inset_0_1px_#ffffff12,0_14px_35px_#0309192b] backdrop-blur-[20px]"
            :to="`/articles/${article.slug}`"
            >{{ article.title }}</NuxtLink
          >
        </div>
      </ContentState>
    </main>
  </div>
</template>
