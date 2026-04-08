<script setup lang="ts">
const { t } = useI18n()

const items = computed(() => [
  {
    label: t('landing.stack.language'),
    name: 'TypeScript',
    icon: 'i-simple-icons-typescript',
    color: '#3178C6',
    url: 'https://www.typescriptlang.org/'
  }, {
    label: t('landing.stack.frontend'),
    name: 'Vue 3',
    icon: 'i-simple-icons-vuedotjs',
    color: '#4FC08D',
    url: 'https://vuejs.org/'
  }, {
    label: t('landing.stack.framework'),
    name: 'Nuxt',
    icon: 'i-simple-icons-nuxtdotjs',
    color: '#00DC82',
    url: 'https://nuxt.com/'
  }
])
</script>

<template>
  <UPageSection
    :title="t('landing.stack.title')"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(item, index) in items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex items-center text-nowrap gap-2"
        >
          <p class="text-sm">
            {{ item.label }}
          </p>
          <USeparator />
          <ULink
            class="flex items-center gap-1"
            :to="item.url"
            target="_blank"
          >
            <div 
              class="inline-flex items-center gap-1"
              :style="{
                color: item.color
              }"
            >
              <span class="font-medium">
                {{ item.name }}
              </span>
              <UIcon :name="item.icon" />
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>