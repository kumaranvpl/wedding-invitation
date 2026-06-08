import { describe, expect, test } from "vitest";
import { decodeName, encodeName } from "./encode.js";

describe("encodeName / decodeName", () => {
  test("round-trips a plain ASCII name", () => {
    const encoded = encodeName("Mahandril Alagusabai");
    expect(encoded).not.toBe("Mahandril Alagusabai"); // obfuscated, not plaintext
    expect(decodeName(encoded)).toBe("Mahandril Alagusabai");
  });

  test("round-trips a name with unicode characters", () => {
    const name = "Thenmozhi தென்மொழி";
    expect(decodeName(encodeName(name))).toBe(name);
  });

  test("produces URL-safe output (no characters needing encoding)", () => {
    const encoded = encodeName("Amrutha & Kumaran");
    expect(encoded).toBe(encodeURIComponent(encoded));
  });

  test("decodes malformed input to empty string instead of throwing", () => {
    expect(decodeName("!!!not-base64!!!")).toBe("");
  });

  test("decodes empty input to empty string", () => {
    expect(decodeName("")).toBe("");
  });
});
