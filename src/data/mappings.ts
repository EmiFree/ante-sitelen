export const letterMappings = {
  m: { latin: "m", greek: "μ", cyrillic: "м" },
  n: { latin: "n", greek: "ν", cyrillic: "н" },
  p: { latin: "p", greek: "π", cyrillic: "п" },
  t: { latin: "t", greek: "τ", cyrillic: "т" },
  k: { latin: "k", greek: "κ", cyrillic: "к" },
  s: { latin: "s", greek: "σ", cyrillic: "с" },
  w: { latin: "w", greek: "β", cyrillic: ["в", "ў"] },
  l: { latin: "l", greek: "λ", cyrillic: "л" },
  j: { latin: "j", greek: "γ", cyrillic: ["й", "j"] },
  i: { latin: "i", greek: "ι", cyrillic: ["и", "і"] },
  u: { latin: "u", greek: "υ", cyrillic: "у" },
  e: { latin: "e", greek: "ε", cyrillic: ["э", "е"] },
  o: { latin: "o", greek: "ο", cyrillic: "о" },
  a: { latin: "a", greek: "α", cyrillic: "а" },
} as const

// export type Alphabet = "latin" | "greek" | "cyrillic"
// export type Letter = keyof typeof letterMappings

// export type ScriptTransformer = {
//   transformer: (input: string) => string;

// }

// export const SCRIPT_MAPPNIGS: Record<string, ScriptTransformer> = {
//   "hiragana": {
//     transformer: (input) => {
//       input += "test";
//       return input;
//     }
//   }
// }
