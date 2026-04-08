<script setup lang="ts">
const leftEye = useTemplateRef<HTMLElement>('leftEye')
const rightEye = useTemplateRef<HTMLElement>('rightEye')
const leftPupil = useTemplateRef<HTMLElement>('leftPupil')
const rightPupil = useTemplateRef<HTMLElement>('rightPupil')

function trackEyes(event: MouseEvent) {
  for (const {eye, pupil } of [
    { eye: leftEye.value, pupil: leftPupil.value },
    { eye: rightEye.value, pupil: rightPupil.value }
  ]) {
    if (!eye || !pupil) continue
    const rect = eye.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = event.clientX - cx
    const dy = event.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const max = rect.width * 0.28
    const ratio = dist > 0 ? Math.min(dist, max) / dist : 0
    pupil.style.transform = `translate(${dx * ratio}px, ${dy * ratio}px)`
  }
}

onMounted(() => window.addEventListener('mousemove', trackEyes))
onUnmounted(() => window.removeEventListener('mousemove', trackEyes))
</script>

<template>
  <div class="rounded-2xl bg-blue-400 shadow-xl p-8 flex gap-6">
    <div ref="leftEye" class="size-32 rounded-full bg-white flex items-center justify-center">
      <div ref="leftPupil" class="size-12 rounded-full bg-black" style="will-change: transform;" />
    </div>
    <div ref="rightEye" class="size-32 rounded-full bg-white flex items-center justify-center">
      <div ref="rightPupil" class="size-12 rounded-full bg-black" style="will-change: transform;" />
    </div>
  </div>
</template>