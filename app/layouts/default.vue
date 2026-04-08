<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UContainer class="pt-10 flex-1 flex flex-col">
      <AppHeader />
      <div class="flex-1">
        <slot />
      </div>
      <AppFooter />
    </UContainer>
  </div>
</template>
