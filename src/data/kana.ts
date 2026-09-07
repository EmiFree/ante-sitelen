// Latin syllable → Katakana. Multi-char kana (e.g. トゥ) are single string values.
export const kanaMap: Record<string, string> = {
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  sa: "サ", si: "シ", su: "ス", se: "セ", so: "ソ",
  ta: "タ",            tu: "トゥ", te: "テ", to: "ト",
  na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  pa: "パ", pi: "ピ", pu: "プ", pe: "ペ", po: "ポ",
  ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ja: "ヤ",            ju: "ユ", je: "イェ", jo: "ヨ",
  la: "ラ", li: "リ", lu: "ル", le: "レ", lo: "ロ",
  wa: "ワ", wi: "ウィ",           we: "ウェ",
  n: "ン",
};

// Reverse map: kana string → Latin syllable, derived from kanaMap.
// Keyed longest-first so multi-char sequences are matched before their components.
const kanaToSyllable: Record<string, string> = {};
for (const [syllable, k] of Object.entries(kanaMap)) {
  kanaToSyllable[k] = syllable;
}
export const kanaKeys = Object.keys(kanaToSyllable).sort((a, b) => b.length - a.length);
export { kanaToSyllable };
