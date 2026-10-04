<script setup lang="ts">
import CaseButton from '@/components/CaseButton.vue'
import { jouerSon } from '@/composables/useSon'

const props = defineProps<{
  items: string[]
  colonnes: number
  lignes: number
  dossier?: string
  minuscule?: boolean
}>()

const texte = (item: string) => (props.minuscule ? `${item} ${item.toLowerCase()}` : item)
</script>

<template>
  <div
    class="grille"
    :style="{
      gridTemplateColumns: `repeat(${colonnes}, 1fr)`,
      gridTemplateRows: `repeat(${lignes}, 1fr)`,
    }"
  >
    <template v-for="(item, i) in items" :key="i">
      <div v-if="!item" />
      <CaseButton
        v-else
        :style="{
          fontSize: `min(${(0.65 * 86) / lignes}vh, ${100 / colonnes / texte(item).length}vw)`,
        }"
        @press="jouerSon((dossier ?? '') + item)"
      >
        {{ texte(item) }}
      </CaseButton>
    </template>
  </div>
</template>

<style scoped>
.grille {
  height: 100%;
  display: grid;
  gap: 4px;
  padding: 4px;
  box-sizing: border-box;
}

.grille :deep(.case) {
  min-width: 0;
  min-height: 0;
  padding: 0;
  font-weight: 700;
  border-width: 2px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
