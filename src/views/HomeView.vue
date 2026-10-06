<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { sitelenAnte } from '@/ante'

const locale = ref<'en' | 'tok' | 'es' | 'jp'>('en')

const messages = {
  en: {
    title: 'sitelen ante',
    subtitle: 'Convert toki pona scripts',
    inputPlaceholder: 'Type or paste text here...',
    outputPlaceholder: 'Translation will appear here...',
    swapTitle: 'Swap scripts',
    copyTitle: 'Copy to clipboard',
    copy: 'Copy',
    copied: 'Copied!',
    scripts: ['Latin', 'Greek', 'Cyrillic', 'Katakana', 'Hiragana'],
    jaPunctuation: 'Japanese punctuation',
    dakuten: 'Dakuten / handakuten',
  },
  tok: {
    title: 'sitelen ante',
    subtitle: 'o ante e nasin sitelen pi toki pona',
    inputPlaceholder: 'o pana e sitelen',
    outputPlaceholder: 'toki ante li kama lon',
    swapTitle: 'ante lon',
    copyTitle: 'o kama jo e ni',
    copy: 'o kama jo e ni',
    copied: 'pini!',
    scripts: ['Lasina', 'Elina', 'Kililisa', 'Katakana', 'Ilakana'],
    jaPunctuation: 'sitelen lili pi toki Nijon',
    dakuten: 'sitelen pi kalama ante',
  },
  es: {
    title: 'sitelen ante',
    subtitle: 'Convertir entre escrituras de toki pona',
    inputPlaceholder: 'Escribe o pega el texto aquí',
    outputPlaceholder: 'La traducción aparecerá aquí',
    swapTitle: 'Invertir escrituras',
    copyTitle: 'Copiar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    scripts: ['Latino', 'Greigo', 'Cirílico', 'Katakana', 'Hiragana'],
    jaPunctuation: 'Puntuación japonesa',
    dakuten: 'Dakuten / handakuten',
  },
  jp: {
    title: 'してれん　あんて',
    subtitle: 'トキポナの文字体系を相互に変換',
    inputPlaceholder: 'ここにテキストを入力または貼り付け...',
    outputPlaceholder: '変換結果がここに表示されます...',
    swapTitle: '文字体系を入れ替え',
    copyTitle: 'クリップボードにコピー',
    copy: 'コピー',
    copied: 'コピーしました！',
    scripts: ['ラテン文字', 'ギリシャ文字', 'キリル文字', 'カタカナ', 'ひらがな'],
    jaPunctuation: '日本語の句読点',
    dakuten: '濁点・半濁点',
  }
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
const japanesePunctuation = ref(false)
const dakuten = ref(false)

const kanaInvolved = computed(
  () => fromScript.value === 4 || fromScript.value === 5 || toScript.value === 4 || toScript.value === 5,
)

watch([inputText, fromScript, toScript, japanesePunctuation, dakuten], () => {
  outputText.value = inputText.value
    ? sitelenAnte(fromScript.value, toScript.value, inputText.value, {
        japanesePunctuation: japanesePunctuation.value,
        dakuten: dakuten.value,
      })
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
        <option value="es">Español</option>
        <option value="jp">日本語</option>
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

      <label v-if="kanaInvolved" class="ja-punct-toggle">
        <input type="checkbox" v-model="japanesePunctuation" />
        <span>{{ t.jaPunctuation }}</span>
      </label>

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
  background: #fdc85d;
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

.ja-punct-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: #202124;
  border-bottom: 1px solid #e8eaed;
  cursor: pointer;
  user-select: none;
}

.ja-punct-toggle input {
  appearance: none;
  -webkit-appearance: none;
  width: 1.15rem;
  height: 1.15rem;
  margin: 0 0 3px 0;
  background: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  box-shadow: 0 3px 0 #000;
  cursor: pointer;
  position: relative;
  transform: translateY(0);
  transition: background 0.1s, box-shadow 0.1s, transform 0.1s;
}

.ja-punct-toggle input:checked {
  background: #AA71FF;
}

.ja-punct-toggle input:checked::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 900;
  line-height: 1;
}

.ja-punct-toggle input:active {
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
  main {
    padding-top: 4.5rem;
  }

  .text-panels {
    grid-template-columns: 1fr;
  }

  .panel:first-child {
    border-right: none;
    border-bottom: 1px solid #e8eaed;
  }
}
</style>
