<script setup lang="ts">
const { t } = useI18n()
const { data } = await useProducts()

useSeoMeta({
  title: t('page.products')
})
</script>

<template>
  <UPage>
    <UPageHero
      :title="t('page.products')"
      :description="t('page.description')"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left'
      }"
    />
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Motion
          v-for="(product, index) in data?.items ?? []"
          :key="product.id"
          :initial="{
            opacity: 0,
            transform: 'translateY(10px)'
          }"
          :while-in-view="{
            opacity: 1,
            transform: 'translateY(0px)'
          }"
          :transition="{
            delay: 0.1 * index
          }"
          :in-view-options="{
            once: true
          }"
        >
          <ProductCard :product="product" />
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>