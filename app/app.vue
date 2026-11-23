<script setup lang="ts">
const route = useRoute()
useHead(() => ({
  bodyAttrs: {
    class: [
      'm-0 font-sans text-[14px] [line-height:normal] [&_:is(a,button,summary):focus-visible]:outline-2 [&_:is(a,button,summary):focus-visible]:outline-offset-4 [&_:is(a,button,summary):focus-visible]:outline-[#7a96ff]',
      route.path.startsWith('/articles/')
        ? 'bg-[#f4f7fc] text-[#192747]'
        : 'text-[#edf2ff] [background:radial-gradient(ellipse_at_7%_24%,#283f86_0,transparent_28%),radial-gradient(ellipse_at_95%_45%,#392a76_0,transparent_34%),#09152c]',
    ].join(' '),
  },
}))
</script>

<template>
  <div>
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50"
      >К содержимому</a
    >
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
