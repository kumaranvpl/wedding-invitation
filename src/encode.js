// Unicode-safe, URL-safe base64 (base64url) encode/decode for the guest name.
//
// SECURITY NOTE: base64 is obfuscation, NOT encryption. The name is trivially
// decodable by anyone with the URL. This only hides it from a casual glance —
// never put secrets in the param.

const toBase64Url = (b64) =>
  b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

const fromBase64Url = (s) => {
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return b64 + pad;
};

export const encodeName = (name) => {
  const bytes = new TextEncoder().encode(name);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return toBase64Url(btoa(binary));
};

export const decodeName = (param) => {
  if (!param) return "";
  try {
    const binary = atob(fromBase64Url(param));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return ""; // malformed param → treat as no name
  }
};
