<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('page.home'),
  description: t('page.description')
})
</script>

<template>
  <UPage>
    <LandingHero />
    <UPageSection 
      :ui="{
        container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout />
      <LandingStack />
    </UPageSection>
    <LandingFAQ />
  </UPage>
</template>