<script setup lang="ts">
useHead({ title: 'Поиск' })
</script>

<template>
  <main id="main-content" class="mx-auto max-w-[1370px] px-[25px] pt-[90px] pb-[110px]">
    <div class="mt-[30px] mb-[34px]">
      <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]"
        >БАЗА ЗНАНИЙ</span
      >
      <h1 class="mb-2.5 text-[48px] font-extrabold tracking-[-.045em] text-[#f2f5ff]">
        Поиск по справке
      </h1>
      <p class="text-[14px] leading-[1.65] text-[#a2b5d7]">
        Поиск пока недоступен. Найти материалы можно через каталог и разделы.
      </p>
    </div>
    <NuxtLink
      class="mt-6 inline-block rounded-xl bg-white px-[21px] py-[13px] text-[12px] font-extrabold text-[#273b7d]"
      to="/catalog"
      >Открыть каталог</NuxtLink
    >
  </main>
</template>
