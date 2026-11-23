<script setup lang="ts">
defineProps<{ pending?: boolean; failed?: boolean; empty?: boolean }>()
defineEmits<{ retry: [] }>()
const route = useRoute()
const isArticle = computed(() => route.path.startsWith('/articles/'))
</script>

<template>
  <div v-if="pending" class="my-6 rounded-2xl border border-[#ffffff1d] p-8" role="status">
    Загружаем материалы…
  </div>
  <div v-else-if="failed" class="my-6 rounded-2xl border border-[#ffffff1d] p-8" role="alert">
    <h2 class="text-[21px] font-bold tracking-[-.045em]">Не удалось загрузить материалы</h2>
    <p class="my-3 leading-[1.65]" :class="isArticle ? 'text-[#596c89]' : 'text-[#9aaed3]'">
      База знаний временно недоступна. Попробуйте ещё раз.
    </p>
    <button
      class="mt-6 inline-block cursor-pointer rounded-xl bg-white px-[21px] py-[13px] text-[12px] font-extrabold text-[#273b7d]"
      type="button"
      @click="$emit('retry')"
    >
      Повторить
    </button>
  </div>
  <div v-else-if="empty" class="my-6 rounded-2xl border border-[#ffffff1d] p-8" role="status">
    <h2 class="text-[21px] font-bold tracking-[-.045em]">Здесь пока нет статей</h2>
    <p class="my-3 leading-[1.65]" :class="isArticle ? 'text-[#596c89]' : 'text-[#9aaed3]'">
      Опубликованные материалы появятся в этом разделе.
    </p>
  </div>
  <slot v-else />
</template>
