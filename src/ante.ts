import { letterMappings } from "./data/mappings";

type Script = "latin" | "greek" | "cyrillic";

const SCRIPT_NAMES: Record<number, Script> = {
  1: "latin",
  2: "greek",
  3: "cyrillic",
};

const reverseMap: Record<string, Record<string, keyof typeof letterMappings>> = {
  latin: {},
  greek: {},
  cyrillic: {},
};

for (const [key, scripts] of Object.entries(letterMappings)) {
  reverseMap.latin[scripts.latin] = key as keyof typeof letterMappings;
  reverseMap.greek[scripts.greek] = key as keyof typeof letterMappings;
  reverseMap.cyrillic[scripts.cyrillic] = key as keyof typeof letterMappings;
}

export function anteSitelen(from: number, to: number, input: string): string {
  const fromScript = SCRIPT_NAMES[from];
  const toScript = SCRIPT_NAMES[to];

  if (!fromScript || !toScript) return input;

  return input
    .split("")
    .map((char) => {
      const key = reverseMap[fromScript][char];
      return key !== undefined ? letterMappings[key][toScript] : char;
    })
    .join("");
}
