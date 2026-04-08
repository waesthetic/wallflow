<script setup lang="ts">
const props = defineProps<{
  product: {
    id: string
    slug: string
    title: string
    description: string | null
    price: number,
    currency: string,
  }

  files: Array<{
    id: string,
    url: string
  }>
}>()

const title = computed(() => { return props.product.title })
const description = computed(() => { return props.product.description })
const count = computed(() => { return props.files.length })

const { formatPrice } = useFormatPrice()
const price = computed(() => { return formatPrice(props.product.price, props.product.currency) })

const { loggedIn } = useUserSession()
const { t } = useI18n()
const { items, addToCart } = useCart()
const localePath = useLocalePath()
const isInCart = computed(() => items.value.some(i => i.cart_items.productId === props.product.id))

async function handleAddToCart() {
  if (!loggedIn.value) {
    return navigateTo(localePath('/login'))
  }

  await addToCart(props.product.id)
}

</script>

<template>
  <UPageSection>
    <div class="space-y-8">

      <Motion
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :animate="{ opacity: 1, transform: 'translateY(0px)' }"
        :transition="{ duration: 0.5 }"
      >
        <UCarousel
          v-slot="{ item }"
          :items="files.map(f => f.url)"
          :ui="{ item: 'basis-full' }"
          arrows
          dots
          class="rounded-2xl"
        >
          <img
            :src="item"
            class="w-full aspect-video object-cover rounded-2xl"
          />
        </UCarousel>
      </Motion>

      <Motion
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :animate="{ opacity: 1, transform: 'translateY(0px)' }"
        :transition="{ duration: 1, delay: 0.2 }"
      >
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div class="space-y-2">
            <p class="text-3xl font-bold text-highlighted">
              {{ t('product.packTitle', { title }) }}
            </p>
            <p v-if="description" class="text-muted max-w-xl">
              {{ description }}
            </p>
          </div>

          <div class="flex items-center gap-4 shrink-0">
            <UBadge color="neutral" variant="soft">
              {{ t('product.wallpaperCount', { count }) }}
            </UBadge>
            <span class="text-2xl font-semibold">{{ price }}</span>
            <UButton
              size="lg"
              :disabled="isInCart"
              @click="handleAddToCart()"
            >
              {{ isInCart ? t('cart.inCart') : t('cart.addToCart') }}
            </UButton>
          </div>
        </div>
      </Motion>

    </div>
  </UPageSection>
</template>