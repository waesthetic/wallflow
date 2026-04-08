<script setup lang="ts">
const { app, footer } = useAppConfig()
const currentYear = new Date().getFullYear()
</script>

<template>
  <UFooter class="z-10" :ui="{ left: 'text-muted text-xs' }">
    <template #left>
      © {{ currentYear }} {{ app.name }}
    </template>

    <template #right>
      <UButton
        v-for="link in footer.links"
        :key="link['aria-label']"
        v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>
  </UFooter>
</template>
