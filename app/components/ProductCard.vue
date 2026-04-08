<script setup lang="ts">
const { formatPrice } = useFormatPrice()
const localePath = useLocalePath()
const { t } = useI18n()

defineProps<{
  product: {
    id: string
    slug: string
    title: string
    price: number
    productFiles: { id: string; url: string }[]
  }
}>()
</script>

<template>
  <NuxtLink
    :to="localePath(`/products/${product.slug}`)"
    class="group block"
  >
    <div class="rounded-2xl border border-default overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div class="aspect-4/3 bg-accented overflow-hidden">
        <img
          v-if="product.productFiles[0]"
          :src="product.productFiles[0].url"
          :alt="product.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div class="p-4 flex items-center justify-between">
        <p class="font-medium text-highlighted truncate">
          {{ t('product.packTitle', { title: product.title }) }}
        </p>
        <p class="text-sm text-muted shrink-0 ml-2">
          {{ formatPrice(product.price) }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>