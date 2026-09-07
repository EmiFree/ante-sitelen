<script setup lang="ts">
import { ref } from 'vue'
import { sitelenAnte } from '@/ante'

const SCRIPTS = [
  { id: 1, label: 'Latin' },
  { id: 2, label: 'Greek' },
  { id: 3, label: 'Cyrillic' },
  { id: 4, label: 'Katakana' },
]

const fromScript = ref(1)
const toScript = ref(2)
const inputText = ref('')
const outputText = ref('')
const copied = ref(false)

function translate() {
  outputText.value = sitelenAnte(fromScript.value, toScript.value, inputText.value)
}

function swap() {
  const tmp = fromScript.value
  fromScript.value = toScript.value
  toScript.value = tmp
  if (outputText.value) {
    inputText.value = outputText.value
    outputText.value = ''
  }
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
    <h1>sitelen ante</h1>
    <p class="subtitle">toki pona script translator</p>

    <div class="translator">
      <div class="script-selectors">
        <select v-model="fromScript">
          <option v-for="s in SCRIPTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>

        <button class="swap-btn" @click="swap" title="Swap scripts">⇄</button>

        <select v-model="toScript">
          <option v-for="s in SCRIPTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>

      <div class="text-panels">
        <div class="panel">
          <textarea
            v-model="inputText"
            placeholder="paste text here..."
            spellcheck="false"
          />
        </div>

        <div class="panel output-panel">
          <textarea
            :value="outputText"
            placeholder="translation will appear here..."
            readonly
            spellcheck="false"
          />
          <button
            class="copy-btn"
            :class="{ copied }"
            @click="copyOutput"
            :disabled="!outputText"
            title="Copy to clipboard"
          >
            {{ copied ? 'copied!' : 'copy' }}
          </button>
        </div>
      </div>

      <button class="translate-btn" @click="translate" :disabled="!inputText">
        translate
      </button>
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
  background: #f8f9fa;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a73e8;
  margin: 0;
}

.subtitle {
  color: #5f6368;
  margin: 0.25rem 0 2rem;
  font-size: 0.95rem;
}

.translator {
  width: 100%;
  max-width: 860px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #202124;
  background: #fff;
  cursor: pointer;
  outline: none;
}

select:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.swap-btn {
  padding: 0.5rem 0.75rem;
  background: none;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #5f6368;
  transition: background 0.15s;
}

.swap-btn:hover {
  background: #f1f3f4;
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

textarea[readonly] {
  color: #1a73e8;
}

.output-panel {
  position: relative;
}

.copy-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  padding: 0.35rem 0.85rem;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  color: #5f6368;
  transition: all 0.15s;
}

.copy-btn:hover:not(:disabled) {
  background: #f1f3f4;
}

.copy-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.copy-btn.copied {
  border-color: #34a853;
  color: #34a853;
}

.translate-btn {
  display: block;
  width: calc(100% - 2.5rem);
  margin: 1rem 1.25rem;
  padding: 0.75rem;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.translate-btn:hover:not(:disabled) {
  background: #1557b0;
}

.translate-btn:disabled {
  background: #c5d9f8;
  cursor: default;
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
