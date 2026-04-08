<script setup lang="ts">
const { footer } = useAppConfig()
const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <UPageSection
    :title="t('landing.about.title')"
    :description="t('landing.about.description')"
    :ui="{
      container: 'p-0!',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <div class="flex items-center gap-2 -mt-5">
      <Motion
        v-for="(link, index) of footer?.links"
        :key="index"

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
          delay: 0.5 + index * 0.1
        }"
      >
        <UButton
          v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
        />
      </Motion>
      
      <Motion
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
          delay: 0.6
        }"
      >
        <UButton
          :to="localePath('/contacts')"
          color="success"
          variant="ghost"
          class="gap-2"
        >
          <template #leading>
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full rounded-full bg-success opacity-75 animate-ping" />
              <span class="relative inline-flex size-2 scale-90 rounded-full bg-success" />
            </span>
          </template>
          {{ t('nav.contactMe') }}
        </UButton>
      </Motion>
    </div>
  </UPageSection>
</template>