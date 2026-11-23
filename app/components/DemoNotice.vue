<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <p
    class="mb-6 rounded-xl border px-4 py-3 text-[13px] leading-[1.65]"
    :class="[
      route.path.startsWith('/articles/')
        ? 'border-[#dbe5f3] text-[#596c89]'
        : 'border-[#ffffff1d] text-[#9aaed3]',
      { 'mt-6': route.path === '/' },
    ]"
    role="note"
  >
    Демонстрационные материалы из макета. Сведения и инструкции ещё не проверены университетом.
  </p>
</template>
