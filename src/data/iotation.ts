// Keys are the plain Cyrillic vowel following j/й, as produced by translateAlpha
const jVowelToIotated: Record<string, string> = {
  а: "я",
  э: "е",
  о: "ё",
  у: "ю",
};

const iotatedToJVowel: Record<string, string> = {
  я: "jа",
  е: "jэ",
  є: "jэ",
  ё: "jо",
  ю: "jу",
};

/** Collapses j + vowel into a single iotated Cyrillic letter (ja → я, je → е, jo → ё, ju → ю). */
export function toIotatedVowels(input: string): string {
  return input.replace(/[jй]([аэоу])/g, (_, vowel: string) => jVowelToIotated[vowel]!);
}

/** Expands iotated Cyrillic letters into j + plain vowel so they map back to j-syllables. */
export function fromIotatedVowels(input: string): string {
  let result = "";
  for (const ch of input) {
    result += iotatedToJVowel[ch] ?? ch;
  }
  return result;
}
