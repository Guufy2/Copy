<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string; compact?: boolean }>(), {
  placeholder: 'Например, как оформить академический отпуск?',
  compact: false,
})
</script>

<template>
  <div
    class="mx-auto flex w-full min-w-0 cursor-default items-center gap-3 sm:gap-4 border border-[#ffffff9c] bg-[#f6f8ff24] px-4 py-3 sm:pt-[7px] sm:pr-[9px] sm:pb-[7px] sm:pl-[25px] text-left text-[#d9e0f5] shadow-[0_0_0_8px_#ffffff0b,0_16px_70px_#030f3778] backdrop-blur-[26px]"
    :class="
      compact
        ? 'mt-6 min-h-[60px] max-w-[620px] rounded-[17px] text-[12px] sm:mt-[30px] sm:h-[60px]'
        : 'mt-7 min-h-[64px] max-w-[760px] rounded-[18px] text-[13px] sm:h-[74px] sm:rounded-[22px] sm:text-[14px] lg:mt-9'
    "
    role="note"
    aria-label="Поиск пока недоступен"
  >
    <span
      class="shrink-0 -rotate-15 text-[28px] sm:text-[33px] leading-none font-extralight text-[#dbe4ff]"
      aria-hidden="true"
      >⌕</span
    >
    <span class="min-w-0 flex-1 leading-[1.5]">{{ placeholder }}</span>
    <span class="ml-auto shrink-0 text-xs opacity-70">Скоро</span>
  </div>
</template>
