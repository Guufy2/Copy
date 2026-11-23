<script setup lang="ts">
import type { Category } from '~~/shared/types/content'
withDefaults(defineProps<{ category: Category; count: number; compact?: boolean }>(), {
  compact: false,
})
</script>

<template>
  <NuxtLink
    class="rounded-[19px] border border-[#bdcaff28] bg-[linear-gradient(130deg,#a9c8ff14,#717dcc09)] text-[#e6edff] shadow-[inset_0_1px_#ffffff12,0_14px_35px_#0309192b] backdrop-blur-[20px]"
    :class="compact ? 'min-h-[140px] p-[15px]' : 'min-h-[223px] px-[19px] py-[23px]'"
    :to="`/sections/${category.slug}`"
  >
    <div
      class="grid place-items-center"
      :class="[
        categoryTone(category.tone),
        compact
          ? 'mb-[13px] size-[31px] rounded-[9px] text-[17px]'
          : 'mb-[25px] size-[50px] rounded-[13px] text-[25px]',
      ]"
      aria-hidden="true"
    >
      {{ category.icon }}
    </div>
    <strong
      class="block font-bold tracking-[-.04em] text-[#eef3ff]"
      :class="compact ? 'text-[12px]' : 'text-[16px]'"
      >{{ category.name }}</strong
    >
    <p
      class="leading-[1.5] text-[#a3b4d4]"
      :class="compact ? 'mt-[5px] text-[10px]' : 'mt-2 text-[12px]'"
    >
      {{ category.description }}
    </p>
    <small
      class="flex justify-between font-bold text-[#a5b9f9]"
      :class="compact ? 'mt-[6px] text-[10px]' : 'mt-5 text-[11.6667px]'"
      >Материалов: {{ count }}</small
    >
  </NuxtLink>
</template>
