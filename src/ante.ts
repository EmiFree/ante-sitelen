import { kanaKeys, kanaMap, kanaToSyllable } from "./data/kana";
import { letterMappings } from "./data/mappings";

type AlphaScript = "latin" | "greek" | "cyrillic";
type Script = AlphaScript | "katakana";

const SCRIPT_NAMES: Record<number, Script> = {
  1: "latin",
  2: "greek",
  3: "cyrillic",
  4: "katakana",
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

function latinToKana(input: string): string {
  let result = "";
  let i = 0;
  const s = input.toLowerCase();
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if (kanaMap[two] !== undefined) {
      result += kanaMap[two];
      i += 2;
    } else {
      const one = s[i]!;
      result += kanaMap[one] ?? one;
      i++;
    }
  }
  return result;
}

function kanaToLatin(input: string): string {
  let result = "";
  let i = 0;
  while (i < input.length) {
    let matched = false;
    for (const k of kanaKeys) {
      if (input.startsWith(k, i)) {
        result += kanaToSyllable[k];
        i += k.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += input[i]!;
      i++;
    }
  }
  return result;
}

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

export function sitelenAnte(from: number, to: number, input: string): string {
  const fromScript = SCRIPT_NAMES[from];
  const toScript = SCRIPT_NAMES[to];
  if (!fromScript || !toScript) return input;

  // Normalize kana input to Latin so the rest of the pipeline is uniform
  const normalized = fromScript === "katakana" ? kanaToLatin(input) : input;
  const effectiveFrom: AlphaScript = fromScript === "katakana" ? "latin" : fromScript;

  if (toScript === "katakana") {
    const latin = effectiveFrom === "latin"
      ? normalized
      : translateAlpha(effectiveFrom, "latin", normalized);
    return latinToKana(latin);
  }

  return translateAlpha(effectiveFrom, toScript, normalized);
}

export function tokiLukin(check: string): boolean {

}
