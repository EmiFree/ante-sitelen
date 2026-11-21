// Keys are the plain Cyrillic vowel following j/й, as produced by translateAlpha
const jVowelToIotated: Record<string, string> = {
  а: "я",
  э: "е",
  о: "ё",
  у: "ю",
};

// е is handled separately since it can mean either e or je
const iotatedToJVowel: Record<string, string> = {
  я: "jа",
  є: "jэ",
  ё: "jо",
  ю: "jу",
};

const CYRILLIC_VOWELS = new Set(["а", "э", "е", "и", "і", "о", "у", "я", "є", "ё", "ю"]);
const LETTER = /\p{L}/u;

/** Collapses j + vowel into a single iotated Cyrillic letter (ja → я, je → е, jo → ё, ju → ю). */
export function toIotatedVowels(input: string): string {
  return input.replace(/[jй]([аэоу])/g, (_, vowel: string) => jVowelToIotated[vowel]!);
}

/** Guesses whether ambiguous е means je, based on how the rest of the text is spelled. */
function looksIotated(input: string): boolean {
  if (/[яёює]/.test(input)) return true;
  if (/[jй][аэеоу]/.test(input)) return false;
  // Iotated text writes plain e as э, so seeing both suggests е is je
  return input.includes("э") && input.includes("е");
}

/**
 * Expands iotated Cyrillic letters into j + plain vowel so they map back to j-syllables.
 * Unambiguous letters (я, є, ё, ю) always expand. For е, toki pona phonotactics decide:
 * after a vowel it must be je, after a consonant it must be e, and at the start of a word
 * (or after n, where nje is possible) it falls back to what the rest of the text suggests.
 */
export function fromIotatedVowels(input: string): string {
  const iotated = looksIotated(input);
  const chars = [...input];
  let result = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    if (ch !== "е") {
      result += iotatedToJVowel[ch] ?? ch;
      continue;
    }
    const prev = chars[i - 1];
    let isJe: boolean;
    if (prev === undefined || !LETTER.test(prev) || prev === "н") isJe = iotated;
    else isJe = CYRILLIC_VOWELS.has(prev);
    result += isJe ? "jэ" : ch;
  }
  return result;
}
