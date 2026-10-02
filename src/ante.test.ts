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
      expect(sitelenAnte(1, 5, "pona", { dakuten: true })).toBe("ぱな");
    });
    it("leaves kana unmarked when flag is off", () => {
      expect(sitelenAnte(1, 5, "pona", { dakuten: false })).toBe("はな");
    });
    it("does not affect non-kana targets", () => {
      expect(sitelenAnte(1, 2, "pona", { dakuten: true })).toBe("πονα");
    });
    it("composes with Japanese punctuation", () => {
      expect(sitelenAnte(1, 5, "pa.", { dakuten: true, japanesePunctuation: true })).toBe("ぱ。");
    });
  });
});
