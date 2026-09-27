<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { sitelenAnte } from '@/ante'

const locale = ref<'en' | 'tok'>('en')

const messages = {
  en: {
    title: 'sitelen ante',
    subtitle: 'Translate between toki pona scripts',
    inputPlaceholder: 'type or paste text here...',
    outputPlaceholder: 'translation will appear here...',
    swapTitle: 'Swap scripts',
    copyTitle: 'Copy to clipboard',
    copy: 'copy',
    copied: 'copied!',
    scripts: ['Latin', 'Greek', 'Cyrillic', 'Katakana', 'Hiragana'],
  },
  tok: {
    title: 'sitelen ante',
    subtitle: 'o ante e nasin sitelen pi toki pona',
    inputPlaceholder: 'o pana li sitelen',
    outputPlaceholder: 'toki ante li kama lon ni  ',
    swapTitle: 'ante lon',
    copyTitle: 'pali e sama',
    copy: 'pali e sama',
    copied: 'pini!',
    scripts: ['lasina', 'elina', 'kililisa', 'katakana', 'ilakana'],
  },
}

const t = computed(() => messages[locale.value])

const SCRIPTS = computed(() =>
  [1, 2, 3, 4, 5].map((id, i) => ({ id, label: t.value.scripts[i] }))
)

const fromScript = ref(1)
const toScript = ref(2)
const inputText = ref('')
const outputText = ref('')
const copied = ref(false)

watch([inputText, fromScript, toScript], () => {
  outputText.value = inputText.value
    ? sitelenAnte(fromScript.value, toScript.value, inputText.value)
    : ''
})

function swap() {
  const tmp = fromScript.value
  fromScript.value = toScript.value
  toScript.value = tmp
  inputText.value = outputText.value
}

async function copyOutput() {
  if (!outputText.value) return
  await navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <main>
    <div class="lang-selector">
      <select v-model="locale">
        <option value="en">English</option>
        <option value="tok">toki pona</option>
      </select>
    </div>

    <h1>{{ t.title }}</h1>
    <p class="subtitle">{{ t.subtitle }}</p>

    <div class="translator">
      <div class="script-selectors">
        <select v-model="fromScript">
          <option v-for="s in SCRIPTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>

        <button class="swap-btn" @click="swap" :title="t.swapTitle">⇄</button>

        <select v-model="toScript">
          <option v-for="s in SCRIPTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>

      <div class="text-panels">
        <div class="panel">
          <textarea
            v-model="inputText"
            :placeholder="t.inputPlaceholder"
            spellcheck="false"
          />
        </div>

        <div class="panel output-panel">
          <textarea
            :value="outputText"
            :placeholder="t.outputPlaceholder"
            readonly
            spellcheck="false"
          />
          <button
            class="copy-btn"
            :class="{ copied }"
            @click="copyOutput"
            :disabled="!outputText"
            :title="t.copyTitle"
          >
            {{ copied ? t.copied : t.copy }}
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: #edd697;
  position: relative;
}

.lang-selector {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.lang-selector select {
  padding: 0.3rem 0.6rem;
  border: 2px solid #000;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #fff;
  cursor: pointer;
  outline: none;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  background: #AA71FF;
  padding: 0.4rem 1.4rem;
  border-radius: 9px;
  border: 3px solid #000;
  box-shadow: 0 14px 12px rgba(0,0,0, 0.35);
}

.subtitle {
  color: #5f6368;
  margin: 0.45rem 0 2rem;
  font-size: 0.95rem;
}

.translator {
  width: 100%;
  max-width: 860px;
  background: #fcf3db;
  border-radius: 12px;
  box-shadow: 0 14px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 4px solid #000;
}

.script-selectors {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e8eaed;
}

select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid #000;
  border-radius: 9px;
  font-size: 0.95rem;
  color: #202124;
  background: #ffd;
  cursor: pointer;
  outline: none;
}

select:focus {
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
}

.swap-btn {
  padding: 0.5rem 0.75rem;
  background: #AA71FF;
  border: 2px solid #000;
  border-radius: 9px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 3px 0 #000;
  transform: translateY(0);
  transition: background 0.1s, box-shadow 0.1s, transform 0.1s;
}

.swap-btn:hover {
  background: #9558ee;
}

.swap-btn:active {
  box-shadow: 0 1px 0 #000;
  transform: translateY(2px);
}

.text-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 280px;
}

.panel {
  position: relative;
  display: flex;
  flex-direction: column;
}

.panel:first-child {
  border-right: 1px solid #e8eaed;
}

textarea {
  flex: 1;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  outline: none;
  resize: none;
  font-size: 1.05rem;
  font-family: inherit;
  color: #202124;
  background: transparent;
  min-height: 280px;
  box-sizing: border-box;
}

/* output text formatting */
textarea[readonly] {
  color: #7a47c6;
}

.output-panel {
  position: relative;
}

.copy-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  padding: 0.35rem 0.85rem;
  min-width: 5rem;
  text-align: center;
  background: #AA71FF;
  border: 2px solid #000;
  border-radius: 9px;
  font-size: 0.85rem;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 3px 0 #000;
  transform: translateY(0);
  transition: background 0.1s, box-shadow 0.1s, transform 0.1s;
}

.copy-btn:hover:not(:disabled):not(.copied) {
  background: #9558ee;
}

.copy-btn:active:not(:disabled) {
  box-shadow: 0 1px 0 #000;
  transform: translateY(2px);
}

.copy-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.copy-btn.copied {
  background: #34a853;
  border-color: #000;
}


@media (max-width: 600px) {
  .text-panels {
    grid-template-columns: 1fr;
  }

  .panel:first-child {
    border-right: none;
    border-bottom: 1px solid #e8eaed;
  }
}
</style>
