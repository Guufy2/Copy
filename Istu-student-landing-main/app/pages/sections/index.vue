<script setup lang="ts">
useHead({ title: 'Разделы справки' })
const { data, pending, error, refresh } = await useKnowledgeBase()
</script>

<template>
  <div
    class="mx-auto grid min-h-[1050px] max-w-[1520px] grid-cols-[260px_1fr] gap-[45px] px-[55px] pt-[42px] pb-[95px] max-[1100px]:gap-5 max-[1100px]:p-[30px]"
  >
    <KnowledgeSidebar :categories="data?.categories ?? []" :total="data?.articles.length ?? 0" />
    <main id="main-content" class="min-w-0">
      <div class="mt-[30px] mb-[34px]">
        <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
          >НАВИГАЦИЯ</span
        >
        <h1 class="mb-2.5 text-[48px] font-extrabold tracking-[-.045em] text-[#f2f5ff]">
          Разделы справки
        </h1>
        <p class="text-[14px] leading-[1.65] text-[#a2b5d7]">
          Выбери тему, чтобы открыть статьи по нужному вопросу.
        </p>
      </div>
      <DemoNotice v-if="data?.articles.some((article) => article.is_demo)" />
      <ContentState
        :pending="pending"
        :failed="!!error"
        :empty="!data?.categories.length"
        @retry="refresh()"
      >
        <div class="grid grid-cols-3 gap-3">
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
    </main>
  </div>
</template>
