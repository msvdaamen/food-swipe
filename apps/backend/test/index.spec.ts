import { describe, it, expect } from "vitest";

function sum(a: number, b: number): number {
  return a + b;
}

describe("Hello World worker", () => {
  it("should sum two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
