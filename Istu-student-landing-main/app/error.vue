<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
useHead({
  title: 'Страница недоступна',
  bodyAttrs: {
    class:
      'm-0 font-sans text-[14px] [line-height:normal] [&_:is(a,button,summary):focus-visible]:outline-2 [&_:is(a,button,summary):focus-visible]:outline-offset-4 [&_:is(a,button,summary):focus-visible]:outline-[#7a96ff] text-[#edf2ff] [background:radial-gradient(ellipse_at_7%_24%,#283f86_0,transparent_28%),radial-gradient(ellipse_at_95%_45%,#392a76_0,transparent_34%),#09152c]',
  },
})
</script>

<template>
  <div>
    <SiteHeader />
    <main class="mx-auto my-[90px] max-w-[900px] p-[25px]">
      <span class="mb-[15px] block text-[11px] font-extrabold tracking-[.2em] text-[#9aaaff]">{{
        error.statusCode
      }}</span>
      <h1 class="text-[28px] font-bold tracking-[-.045em]">
        {{ error.statusCode === 404 ? 'Страница не найдена' : 'Не удалось открыть страницу' }}
      </h1>
      <p class="mt-4 leading-[1.65]">
        {{
          error.statusCode === 404
            ? 'Материал не существует или ещё не опубликован.'
            : 'Попробуйте открыть страницу ещё раз.'
        }}
      </p>
      <button
        class="mt-6 inline-block cursor-pointer rounded-xl bg-white px-[21px] py-[13px] text-[12px] font-extrabold text-[#273b7d]"
        type="button"
        @click="clearError({ redirect: '/catalog' })"
      >
        Открыть каталог
      </button>
    </main>
    <SiteFooter />
  </div>
</template>
