<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { LETTRES, MOTS, NOMBRES, VOYELLES } from '@/data/contenu'

const THEMES: Record<string, string[]> = {
  Lettres: LETTRES,
  Voyelles: VOYELLES,
  'Petits mots': MOTS,
  Nombres: NOMBRES,
}

const jeu = reactive({ theme: 'Nombres', de: 15, a: 20, secondes: 3 })
const courant = ref<string | null>(null)
let minuteur: ReturnType<typeof setInterval> | undefined

const estNombres = computed(() => jeu.theme === 'Nombres')

function borner(cle: 'de' | 'a' | 'secondes', pas: number) {
  const [min, max] = {
    de: [1, jeu.a],
    a: [jeu.de, NOMBRES.length],
    secondes: [1, 30],
  }[cle]
  jeu[cle] = Math.min(max!, Math.max(min!, jeu[cle] + pas))
}

function lancer() {
  const liste = estNombres.value ? NOMBRES.slice(jeu.de - 1, jeu.a) : THEMES[jeu.theme]!
  let dernier: string | null = null
  const suivant = () => {
    let x: string
    do {
      x = liste[Math.floor(Math.random() * liste.length)]!
    } while (x === dernier && liste.length > 1)
    dernier = courant.value = x
  }
  suivant()
  minuteur = setInterval(suivant, jeu.secondes * 1000)
}

function arreter() {
  clearInterval(minuteur)
  courant.value = null
}

const texte = computed(() =>
  courant.value && jeu.theme === 'Lettres'
    ? `${courant.value} ${courant.value.toLowerCase()}`
    : (courant.value ?? ''),
)

onUnmounted(arreter)
</script>

<template>
  <div v-if="courant === null" class="reglages">
    <div class="themes">
      <button
        v-for="nom in Object.keys(THEMES)"
        :key="nom"
        :class="{ actif: nom === jeu.theme }"
        @click="jeu.theme = nom"
      >
        {{ nom }}
      </button>
    </div>
    <div
      v-for="[cle, nom] in [
        ...(estNombres
          ? [
              ['de', 'De'],
              ['a', 'À'],
            ]
          : []),
        ['secondes', 'Secondes'],
      ] as ['de' | 'a' | 'secondes', string][]"
      :key="cle"
      class="reglage"
    >
      <span class="nom">{{ nom }}</span>
      <button @click="borner(cle, -1)">−</button>
      <span class="valeur">{{ jeu[cle] }}</span>
      <button @click="borner(cle, 1)">+</button>
    </div>
    <button class="gros jouer" @click="lancer">JOUER</button>
  </div>
  <div v-else class="partie">
    <div class="valeur-jeu" :style="{ fontSize: `min(${130 / texte.length}vw, 45vh)` }">
      {{ texte }}
    </div>
    <button class="gros stop" @click="arreter">STOP</button>
  </div>
</template>

<style scoped>
.reglages,
.partie {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 4px 4px;
}

.reglages {
  justify-content: space-around;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  margin: 0 4px 4px;
  padding: 2vh 0;
  height: auto;
  min-height: calc(100% - 4px);
}

.reglage {
  display: flex;
  align-items: center;
  gap: 3vw;
  font:
    700 6vh system-ui,
    sans-serif;
  color: #2b2b2b;
}

.nom {
  width: 22vw;
  text-align: right;
}

.valeur {
  width: 14vw;
  text-align: center;
}

button {
  border: 0;
  border-radius: 12px;
  background: #cfe3ff;
  color: #1d3a66;
  font:
    700 6vh system-ui,
    sans-serif;
  cursor: pointer;
}

.reglage button {
  width: 10vh;
  height: 10vh;
}

.themes {
  display: flex;
  gap: 2vw;
}

.themes button {
  font-size: 5vh;
  padding: 2vh 3vw;
}

.themes button.actif {
  background: #2f6fde;
  color: #fff;
}

.gros {
  padding: 1.5vh 8vw;
  font-size: 7vh;
}

.jouer {
  background: #2fa84f;
  color: #fff;
}

.stop {
  background: #d93636;
  color: #fff;
  margin-top: 4px;
}

.valeur-jeu {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  font-weight: 700;
  color: #2b2b2b;
}
</style>
