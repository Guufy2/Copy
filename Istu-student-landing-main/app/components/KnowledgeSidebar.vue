<script setup lang="ts">
import type { Category } from '~~/shared/types/content'
defineProps<{ categories: Category[]; total: number }>()
</script>

<template>
  <aside class="border-r border-[#c1d0ff27] pt-5 pr-5 pb-[30px] text-[13px]">
    <nav aria-label="Навигация по справке">
      <div
        class="mb-6 ml-[13px] flex justify-between text-[10px] font-extrabold tracking-[.16em] text-[#9bb0d8]"
      >
        НАВИГАЦИЯ
      </div>
      <NuxtLink
        to="/catalog"
        class="mb-[3px] flex items-center gap-2.5 rounded-[10px] px-[11px] py-3 font-semibold text-[#b1c1df] aria-[current=page]:border aria-[current=page]:border-[#a9baff33] aria-[current=page]:bg-[linear-gradient(110deg,#4d73ec7a,#7759c047)] aria-[current=page]:text-[#e7edff]"
        >▦ &nbsp; Все статьи
        <span class="ml-auto font-medium text-[#8399c6]">{{ total }}</span></NuxtLink
      >
      <div class="mx-3 mt-7 mb-2.5 text-[10px] font-extrabold tracking-[.15em] text-[#9bb0d8]">
        РАЗДЕЛЫ
      </div>
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/sections/${category.slug}`"
        class="mb-[3px] flex items-center gap-2.5 rounded-[10px] px-[11px] py-3 font-semibold text-[#b1c1df] aria-[current=page]:border aria-[current=page]:border-[#a9baff33] aria-[current=page]:bg-[linear-gradient(110deg,#4d73ec7a,#7759c047)] aria-[current=page]:text-[#e7edff]"
      >
        <span
          class="grid size-[25px] place-items-center rounded-lg text-[14px] font-medium"
          :class="categoryTone(category.tone)"
          aria-hidden="true"
          >{{ category.icon }}</span>{{ category.name }}
      </NuxtLink>
      <div class="mt-[22px] border-t border-[#b2c7ff2c]" />
      <div class="mx-3 mt-7 mb-2.5 text-[10px] font-extrabold tracking-[.15em] text-[#9bb0d8]">
        ПОЛЕЗНОЕ
      </div>
      <NuxtLink
        to="/faq"
        class="mb-[3px] flex items-center gap-2.5 rounded-[10px] px-[11px] py-3 font-semibold text-[#b1c1df] aria-[current=page]:border aria-[current=page]:border-[#a9baff33] aria-[current=page]:bg-[linear-gradient(110deg,#4d73ec7a,#7759c047)] aria-[current=page]:text-[#e7edff]"
        >◉ &nbsp; Популярные вопросы</NuxtLink
      >
    </nav>
    <div
      class="mt-[55px] rounded-[15px] border border-[#9db5ff32] bg-[linear-gradient(120deg,#496ec73d,#7353a833)] p-5 text-[#e8edff]"
    >
      <b class="text-[14px] font-bold">Не нашёл ответ?</b>
      <p class="mt-[7px] mb-[13px] text-[12px] leading-[1.65] text-[#b9c9e8]">
        Посмотри материалы в других разделах справки.
      </p>
      <NuxtLink to="/sections">Открыть разделы</NuxtLink>
    </div>
  </aside>
</template>
