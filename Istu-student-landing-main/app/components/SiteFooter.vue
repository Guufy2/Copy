<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <footer
    class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center border-t border-[#b4c5ff23] px-4 py-6 sm:px-[7%] sm:py-[30px] text-[12px]"
    :class="
      route.path.startsWith('/articles/')
        ? 'bg-[#060d20] text-[#bdceeb]'
        : 'bg-transparent text-[#c7d3ef]'
    "
  >
    <SiteBrand class="[&_b]:text-white [&_small]:text-[#93a6d1]" />
    <span>Помогаем разобраться в университетской жизни — без лишней бюрократии.</span>
    <span>Сайт-справка для студентов</span>
  </footer>
</template>
