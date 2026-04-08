<script setup lang="ts">
const { t } = useI18n()

const items = computed(() => [
  {
    label: t('landing.faq.generalCategory'),
    key: 'general',
    questions: [
      {
        label: t('landing.faq.formatsQuestion'),
        content: t('landing.faq.formatsAnswer')
      }, {
        label: t('landing.faq.commercialQuestion'),
        content: t('landing.faq.commercialAnswer')
      }
    ]
  }, {
    label: t('landing.faq.ordersCategory'),
    key: 'orders',
    questions: [
      {
        label: t('landing.faq.downloadQuestion'),
        content: t('landing.faq.downloadAnswer')
      }, {
        label: t('landing.faq.refundQuestion'),
        content: t('landing.faq.refundAnswer')
      }
    ]
  }
])

const ui = {
  root: 'flex items-center gap-4 w-full',
  list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0',
  indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
  trigger: 'px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
  label: 'truncate'
}
</script>

<template>
  <UPageSection
    :title="t('landing.faq.title')"
    :description="t('landing.faq.description')"
    :ui="{
      container: 'px-0 pt-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <UTabs
      :items
      orientation="horizontal"
      :ui
    >
      <template #content="{ item }">
        <UAccordion
          trailing-icon="lucide:plus"
          :items="item.questions"
          :unmount-on-hide="false"
          :ui="{
            item: 'border-none',
            trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
            trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted'
          }"
        >
          <template #body="{ item: _item }">
            <p class="px-4 pb-3 text-sm text-muted">
              {{  _item.content  }}
            </p>
          </template>
        </UAccordion>
      </template>
    </UTabs>
  </UPageSection>
</template>