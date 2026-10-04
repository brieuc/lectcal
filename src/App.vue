<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { pages } from '@/router'
</script>

<template>
  <div class="portrait">
    <span>🔄</span>
    Tourne l'écran
  </div>
  <header>
    <nav>
      <RouterLink v-for="p in pages" :key="p.path" :to="p.path">{{ p.titre }}</RouterLink>
      <RouterLink to="/jeux">Jeux</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style>
html,
body,
#app {
  margin: 0;
  height: 100%;
}

body {
  background: #fff8e7;
  font-family: system-ui, sans-serif;
  user-select: none;
  touch-action: pan-x pan-y;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}

#app {
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
header {
  flex: 0 0 14vh;
}

nav {
  height: 100%;
  display: flex;
  gap: 4px;
  padding: 4px;
  box-sizing: border-box;
}

nav a {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #cfe3ff;
  color: #1d3a66;
  font:
    700 min(5vw, 6vh) system-ui,
    sans-serif;
  text-decoration: none;
}

nav a.router-link-exact-active {
  background: #2f6fde;
  color: #fff;
}

main {
  flex: 1;
  min-height: 0;
}

.portrait {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #2f6fde;
  color: #fff;
  font:
    700 9vw system-ui,
    sans-serif;
  text-align: center;
}

.portrait span {
  font-size: 25vw;
}

@media (orientation: portrait) {
  .portrait {
    display: flex;
  }
}
</style>
