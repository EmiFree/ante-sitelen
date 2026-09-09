export type KanaMap = Record<string, string | readonly string[]>;

function canonical(entry: string | readonly string[]): string {
  return typeof entry === "string" ? entry : entry[0]!;
}

function allForms(entry: string | readonly string[]): readonly string[] {
  return typeof entry === "string" ? [entry] : entry;
}

/** Derives a reverse lookup (kana → syllable) and a longest-first key list for greedy matching. */
export function buildKanaReverse(map: KanaMap): { reverse: Record<string, string>; keys: string[] } {
  const reverse: Record<string, string> = {};
  for (const [syllable, entry] of Object.entries(map)) {
    for (const form of allForms(entry)) {
      reverse[form] = syllable;
    }
  }
  const keys = Object.keys(reverse).sort((a, b) => b.length - a.length);
  return { reverse, keys };
}

export function makeLatinToKana(map: KanaMap): (input: string) => string {
  return (input) => {
    let result = "";
    let i = 0;
    const s = input.toLowerCase();
    while (i < s.length) {
      const two = s.slice(i, i + 2);
      if (map[two] !== undefined) {
        result += canonical(map[two]!);
        i += 2;
      } else {
        const one = s[i]!;
        result += map[one] !== undefined ? canonical(map[one]!) : one;
        i++;
      }
    }
    return result;
  };
}

export function makeKanaToLatin(reverse: Record<string, string>, keys: string[]): (input: string) => string {
  return (input) => {
    let result = "";
    let i = 0;
    while (i < input.length) {
      let matched = false;
      for (const k of keys) {
        if (input.startsWith(k, i)) {
          result += reverse[k];
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
  };
}

export const katakanaMap: KanaMap = {
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  sa: "サ", si: "シ", su: "ス", se: "セ", so: "ソ",
  ta: "タ",              tu: ["ツ", "トゥ"], te: "テ", to: "ト",
  na: "ナ", ni: "ニ",  nu: "ヌ", ne: "ネ", no: "ノ",
  pa: ["ハ", "パ"], pi: ["ヒ", "ピ"], pu: ["フ", "プ"], pe: ["ヘ", "ペ"], po: ["ホ", "ポ"],
  ma: "マ", mi: "ミ",  mu: "ム", me: "メ", mo: "モ",
  ja: "ヤ",              ju: "ユ", je: ["𛄡", "イェ", "エ"], jo: "ヨ",
  la: "ラ", li: "リ",  lu: "ル", le: "レ", lo: "ロ",
  wa: "ワ", wi: ["ヰ", "ウィ"],   we: ["ヱ", "ウェ"],
  n: "ン",
};

export const hiraganaMap: KanaMap = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", si: "し", su: "す", se: "せ", so: "そ",
  ta: "た",              tu: "つ", te: "て", to: "と",
  na: "な", ni: "に",  nu: "ぬ", ne: "ね", no: "の",
  pa: ["は", "ぱ"], pi: ["ひ", "ぴ"], pu: ["ふ", "ぷ"], pe: ["へ", "ぺ"], po: ["ほ", "ぽ"],
  ma: "ま", mi: "み",  mu: "む", me: "め", mo: "も",
  ja: "や",              ju: "ゆ", je: ["𛀁", "いぇ", "え", "江"], jo: "よ",
  la: "ら", li: "り",  lu: "る", le: "れ", lo: "ろ",
  wa: "わ", wi: ["ゐ", "うぃ"],   we: ["ゑ", "うぇ"],
  n: "ん",
};
