import { describe, it, expect } from "vitest";
import { anteSitelen } from "./src/ante";

describe("anteSitelen", () => {
  it("translates latin to greek", () => {
    expect(anteSitelen(1, 2, "mn")).toBe("μν");
  });
  it("passes through unknown characters", () => {
    expect(anteSitelen(1, 2, "m!")).toBe("μ!");
  });
});
