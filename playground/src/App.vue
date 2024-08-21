<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'
import grammarUri from '../../grammars/uri.json'
import fixtures from '../../test/uris.txt?raw'

const code = ref(fixtures)
const shiki = shallowRef<Highlighter>()

getHighlighter({
  themes: [
    'vitesse-dark',
  ],
  langs: [
    'js',
    grammarUri as any,
  ],
})
  .then((highlighter) => {
    shiki.value = highlighter
  })

const highlighted = computed(() => {
  return shiki.value?.codeToHtml(code.value, {
    lang: 'uri',
    theme: 'vitesse-dark',
  }) || ''
})
</script>

<template>
  <div style="display:grid;grid-template-rows: 1fr 1fr;height: 100vh; gap: 1em;">
    <textarea v-model="code" style="padding: 1rem; font-size: 24px;" />
    <div style="padding: 0.5rem" v-html="highlighted" />
  </div>
</template>

<style>
html {
  color-scheme: dark;
  font-size: 24px;
}
</style>
