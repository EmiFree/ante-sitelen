import {
  addDakuten,
  buildKanaReverse,
  hiraganaMap,
  katakanaMap,
  makeKanaToLatin,
  makeLatinToKana,
} from "./data/kana";
import { letterMappings } from "./data/mappings";
import { fromJapanesePunctuation, toJapanesePunctuation } from "./data/punctuation";

type AlphaScript = "latin" | "greek" | "cyrillic";
type Script = AlphaScript | "katakana" | "hiragana";

const SCRIPT_NAMES: Record<number, Script> = {
  1: "latin",
  2: "greek",
  3: "cyrillic",
  4: "katakana",
  5: "hiragana",
};

const reverseMap: Record<AlphaScript, Record<string, keyof typeof letterMappings>> = {
  latin: {},
  greek: {},
  cyrillic: {},
};

function alts(val: string | readonly string[]): readonly string[] {
  return typeof val === "string" ? [val] : val;
}

for (const [key, scripts] of Object.entries(letterMappings)) {
  for (const script of ["latin", "greek", "cyrillic"] as const) {
    for (const char of alts(scripts[script])) {
      reverseMap[script]![char] = key as keyof typeof letterMappings;
    }
  }
}

const katakanaReverse = buildKanaReverse(katakanaMap);
const hiraganaReverse = buildKanaReverse(hiraganaMap);

const kanaConverters: Record<"katakana" | "hiragana", {
  toLatin: (s: string) => string;
  fromLatin: (s: string) => string;
}> = {
  katakana: {
    toLatin: makeKanaToLatin(katakanaReverse.reverse, katakanaReverse.keys),
    fromLatin: makeLatinToKana(katakanaMap),
  },
  hiragana: {
    toLatin: makeKanaToLatin(hiraganaReverse.reverse, hiraganaReverse.keys),
    fromLatin: makeLatinToKana(hiraganaMap),
  },
};

function translateAlpha(from: AlphaScript, to: AlphaScript, input: string): string {
  return input
    .split("")
    .map((char) => {
      const key = reverseMap[from][char];
      if (key === undefined) return char;
      const val = letterMappings[key][to];
      return Array.isArray(val) ? val[0] : val;
    })
    .join("");
}

export function sitelenAnte(
  from: number,
  to: number,
  input: string,
  options: { japanesePunctuation?: boolean; dakuten?: boolean } = {},
): string {
  const fromScript = SCRIPT_NAMES[from];
  const toScript = SCRIPT_NAMES[to];
  if (!fromScript || !toScript) return input;

  // Normalize kana input to Latin so the rest of the pipeline is uniform
  const isKanaFrom = fromScript === "katakana" || fromScript === "hiragana";
  const isKanaTo = toScript === "katakana" || toScript === "hiragana";

  const pre = options.japanesePunctuation && isKanaFrom
    ? fromJapanesePunctuation(input)
    : input;

  const normalized = isKanaFrom
    ? kanaConverters[fromScript as "katakana" | "hiragana"].toLatin(pre)
    : pre;
  const effectiveFrom: AlphaScript = isKanaFrom ? "latin" : (fromScript as AlphaScript);

  let output: string;
  if (isKanaTo) {
    const latin = effectiveFrom === "latin"
      ? normalized
      : translateAlpha(effectiveFrom, "latin", normalized);
    output = kanaConverters[toScript as "katakana" | "hiragana"].fromLatin(latin);
  } else {
    output = translateAlpha(effectiveFrom, toScript as AlphaScript, normalized);
  }

  let final = output;
  if (options.japanesePunctuation && isKanaTo) final = toJapanesePunctuation(final);
  if (options.dakuten && isKanaTo) final = addDakuten(final);
  return final;
}

//TODO: implement this later lol
// export function tokiLukin(check: string): boolean {

// }
