import { describe, it, expect } from "vitest";
import { sitelenAnte } from "./src/ante";

describe("sitelenAnte", () => {
  it("translates latin to greek", () => {
    expect(sitelenAnte(1, 2, "mn")).toBe("μν");
  });
  it("passes through unknown characters", () => {
    expect(sitelenAnte(1, 2, "m!")).toBe("μ!");
  });
});
