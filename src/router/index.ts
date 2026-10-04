import { createRouter, createWebHashHistory } from 'vue-router'
import GrilleView from '@/views/GrilleView.vue'
import JeuxView from '@/views/JeuxView.vue'
import { LETTRES, MOTS, NOMBRES, VOYELLES } from '@/data/contenu'

export const pages = [
  {
    path: '/',
    titre: 'Alphabet',
    props: { items: LETTRES, colonnes: 6, lignes: 5, minuscule: true },
  },
  { path: '/voyelles', titre: 'Voyelles', props: { items: VOYELLES, colonnes: 5, lignes: 3 } },
  {
    path: '/mots',
    titre: 'Petits mots',
    props: { items: MOTS, colonnes: 5, lignes: 4, dossier: 'mots/' },
  },
  {
    path: '/nombres',
    titre: 'Nombres',
    props: { items: ['', ...NOMBRES], colonnes: 10, lignes: 10, dossier: 'nombres/' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...pages.map((p) => ({ path: p.path, component: GrilleView, props: p.props })),
    { path: '/jeux', component: JeuxView },
  ],
})

export default router
