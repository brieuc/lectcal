declare global {
  interface Window {
    CONFIG?: { urlSons?: string }
  }
}

const cache: Record<string, HTMLAudioElement> = {}

export function jouerSon(chemin: string) {
  const url = `${window.CONFIG?.urlSons ?? 'sons/'}${chemin}.m4a`
  const audio = (cache[url] ??= new Audio(url))
  audio.currentTime = 0
  audio.play().catch(() => {})
}
