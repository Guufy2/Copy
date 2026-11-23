<script setup lang="ts">
import type { ArticleSummary } from '~~/shared/types/content'
withDefaults(defineProps<{ article: ArticleSummary; compact?: boolean }>(), { compact: false })
</script>

<template>
  <NuxtLink
    class="relative flex items-start gap-5 rounded-[17px] border border-[#bdcaff28] bg-[linear-gradient(130deg,#a9c8ff14,#717dcc09)] text-[#e6edff] shadow-[inset_0_1px_#ffffff12,0_14px_35px_#0309192b] backdrop-blur-[20px]"
    :class="compact ? 'min-h-[158px] p-5' : 'min-h-[149px] p-[23px]'"
    :to="`/articles/${article.slug}`"
  >
    <div
      class="grid size-[50px] shrink-0 place-items-center rounded-[13px] text-[25px]"
      :class="categoryTone(article.category.tone)"
      aria-hidden="true"
    >
      {{ article.category.icon }}
    </div>
    <div class="flex min-w-0 flex-1 flex-col self-stretch wrap-break-words">
      <span
        class="inline-flex self-start rounded-lg bg-[#6b83ff36] px-2.25 py-1.25 text-[9px] font-extrabold tracking-wider text-[#c0cbff]"
        >{{ article.category.name }}</span
      >
      <h3 class="mt-2.25 mb-1.25 text-[17px] font-bold tracking-[-.035em] text-[#eef3ff]">
        {{ article.title }}
      </h3>
      <p class="max-w-150 text-[12px] leading-[1.65] text-[#a3b4d4]">{{ article.excerpt }}</p>
      <span class="mt-auto block pt-3.25 text-[11px] text-[#a3b4d4]"
        >◷ {{ article.reading_minutes }} мин чтения <span class="px-1.25">·</span>
        {{ article.is_demo ? 'Демо' : 'Статья' }}</span
      >
    </div>
  </NuxtLink>
</template>
