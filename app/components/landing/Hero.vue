<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()
const { data } = await useProducts()

const images = computed(() => (data.value?.items ?? [])
  .filter(p => p.productFiles.length)
  .map((p, i) => ({
    src: p.productFiles[0]!.url,
    alt: p.title,
    index: i
  }))
)
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        <span class="font-bold text-4xl sm:text-6xl lg:text-8xl tracking-tight text-primary">
          wallflow.store
        </span>
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        {{ t('landing.hero.headline') }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.6, delay: 0.3 }"
      >
        {{ t('landing.hero.description') }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
        :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
        :transition="{ duration: 0.6, delay: 0.5 }"
      >
        <div class="flex items-center gap-3">
          <UButton 
            :to="localePath('/products')" 
            size="lg"
          >
            {{ t('nav.browseShop') }}
          </UButton>
        </div>
      </Motion>
    </template>

    <UMarquee
      class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(img, index) in images"
        :key="index"
        class="pb-6"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)' 
        }"
        :transition="{ 
          duration: 0.6, 
          delay: index * 0.1
        }"
      >
        <img
          width="234"
          height="234"
          class="rounded-lg aspect-square object-cover"
          :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          v-bind="img"
        >
      </Motion>
    </UMarquee>
  </UPageHero>
</template>