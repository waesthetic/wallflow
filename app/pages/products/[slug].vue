<script setup lang="ts">
import PackPage from '~/components/PackPage.vue'

const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string
const { data } = await useProduct(slug)

if (!data.value?.product) {
  throw createError({
    statusCode: 404,
    message: 'Product not found'
  })
}

const product = computed(() => data.value!.product)
const files = computed(() => data.value?.files ?? [])

useHead({
  title: computed(() => t('product.packTitle', { title: product.value.title }))
})
</script>

<template>
  <PackPage :product="product" :files="files"/>
</template>