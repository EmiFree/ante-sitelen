export const asciiToJaPunct: Record<string, string> = {
  ".": "。",
  ",": "、",
  "?": "？",
  "!": "！",
  "(": "（",
  ")": "）",
  ":": "：",
  ";": "；",
};

export const jaPunctToAscii: Record<string, string> = {
  "。": ".",
  "、": ",",
  "？": "?",
  "！": "!",
  "（": "(",
  "）": ")",
  "：": ":",
  "；": ";",
  "「": '"',
  "」": '"',
  "『": "'",
  "』": "'",
};

/** Converts ASCII punctuation to Japanese forms. Straight quotes alternate open/close. */
export function toJapanesePunctuation(input: string): string {
  let result = "";
  let doubleOpen = true;
  let singleOpen = true;
  for (const ch of input) {
    if (ch === '"') {
      result += doubleOpen ? "「" : "」";
      doubleOpen = !doubleOpen;
    } else if (ch === "'") {
      result += singleOpen ? "『" : "』";
      singleOpen = !singleOpen;
    } else {
      result += asciiToJaPunct[ch] ?? ch;
    }
  }
  return result;
}

export function fromJapanesePunctuation(input: string): string {
  let result = "";
  for (const ch of input) {
    result += jaPunctToAscii[ch] ?? ch;
  }
  return result;
}
