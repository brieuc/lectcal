<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ press: [] }>()

const pressed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function onPress() {
  pressed.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (pressed.value = false), 400)
  emit('press')
}
</script>

<template>
  <button type="button" class="case" :class="{ pressed }" @pointerdown="onPress">
    <slot />
  </button>
</template>

<style scoped>
.case {
  min-width: 6rem;
  min-height: 6rem;
  font-size: 3rem;
  border: 4px solid #888;
  border-radius: 1rem;
  background: #fff;
  cursor: pointer;
  touch-action: pan-x pan-y;
  transition:
    transform 0.1s,
    background-color 0.1s,
    border-color 0.1s;
}

.case.pressed {
  transform: scale(0.92);
  background: #ffe066;
  border-color: #f59f00;
  box-shadow: 0 0 0 6px rgba(245, 159, 0, 0.4);
}
</style>
