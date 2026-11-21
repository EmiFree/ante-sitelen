import { describe, it, expect } from "vitest";
import { sitelenAnte } from "./ante";

describe("sitelenAnte", () => {
  it("translates latin to greek", () => {
    expect(sitelenAnte(1, 2, "mn")).toBe("μν");
  });
  it("passes through unknown characters", () => {
    expect(sitelenAnte(1, 2, "m!")).toBe("μ!");
  });

  describe("japanese punctuation", () => {
    it("converts ASCII punctuation to Japanese forms when target is kana", () => {
      expect(sitelenAnte(1, 4, "toki.", { japanesePunctuation: true })).toBe("トキ。");
      expect(sitelenAnte(1, 5, "a,pa?su!", { japanesePunctuation: true })).toBe("あ、は？す！");
    });
    it("alternates quote direction for paired quotes", () => {
      expect(sitelenAnte(1, 5, '"a" "o"', { japanesePunctuation: true })).toBe("「あ」 「お」");
    });
    it("converts Japanese punctuation back to ASCII when source is kana", () => {
      expect(sitelenAnte(5, 1, "あ、は。", { japanesePunctuation: true })).toBe("a,pa.");
      expect(sitelenAnte(4, 1, "「ト」", { japanesePunctuation: true })).toBe('"to"');
    });
    it("leaves punctuation untouched when flag is off", () => {
      expect(sitelenAnte(1, 4, "toki.", { japanesePunctuation: false })).toBe("トキ.");
    });
    it("handles brackets and colons", () => {
      expect(sitelenAnte(1, 4, "(a:o);", { japanesePunctuation: true })).toBe("（ア：オ）；");
    });
  });

  describe("dakuten", () => {
    it("adds handakuten to katakana p-syllables when flag is on", () => {
      expect(sitelenAnte(1, 4, "pa pi pu pe po", { dakuten: true })).toBe("パ ピ プ ペ ポ");
    });
    it("adds handakuten to hiragana p-syllables when flag is on", () => {
      expect(sitelenAnte(1, 5, "pona", { dakuten: true })).toBe("ぽな");
    });
    it("leaves kana unmarked when flag is off", () => {
      expect(sitelenAnte(1, 5, "pona", { dakuten: false })).toBe("ほな");
    });
    it("does not affect non-kana targets", () => {
      expect(sitelenAnte(1, 2, "pona", { dakuten: true })).toBe("πονα");
    });
    it("composes with Japanese punctuation", () => {
      expect(sitelenAnte(1, 5, "pa.", { dakuten: true, japanesePunctuation: true })).toBe("ぱ。");
    });
  });

  describe("iotated vowels", () => {
    it("collapses j-syllables into iotated letters when flag is on", () => {
      expect(sitelenAnte(1, 3, "ja je jo ju", { iotatedVowels: true })).toBe("я е ё ю");
      expect(sitelenAnte(1, 3, "jelo", { iotatedVowels: true })).toBe("ело");
    });
    it("keeps plain e as э so it stays distinct from je", () => {
      expect(sitelenAnte(1, 3, "e je", { iotatedVowels: true })).toBe("э е");
    });
    it("leaves j + vowel when flag is off", () => {
      expect(sitelenAnte(1, 3, "jan", { iotatedVowels: false })).toBe("jан");
    });
    it("auto-detects iotated letters in Cyrillic input without the flag", () => {
      expect(sitelenAnte(3, 1, "ян ело ёпа юпа єн")).toBe("jan jelo jopa jupa jen");
    });
    it("reads е after a vowel as je and after a consonant as e", () => {
      expect(sitelenAnte(3, 1, "мие")).toBe("mije");
      expect(sitelenAnte(3, 1, "тело")).toBe("telo");
    });
    it("reads word-initial е from the rest of the text", () => {
      expect(sitelenAnte(3, 1, "ело")).toBe("elo");
      expect(sitelenAnte(3, 1, "э ело")).toBe("e jelo");
      expect(sitelenAnte(3, 1, "jан ело")).toBe("jan elo");
    });
    it("round-trips iotated output back to Latin", () => {
      const cyr = sitelenAnte(1, 3, "mi jan pona e jelo mije", { iotatedVowels: true });
      expect(cyr).toBe("ми ян пона э ело мие");
      expect(sitelenAnte(3, 1, cyr)).toBe("mi jan pona e jelo mije");
    });
    it("works from kana and greek sources", () => {
      expect(sitelenAnte(4, 3, "ヤン", { iotatedVowels: true })).toBe("ян");
      expect(sitelenAnte(2, 3, "γαν", { iotatedVowels: true })).toBe("ян");
    });
  });
});
