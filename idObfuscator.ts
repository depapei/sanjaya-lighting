// lib/idObfuscator.ts

const PREFIX = "sl_dt_"; // opsional: untuk identifikasi
const SALT = "SANJAYALIGHTING2026"; // ganti dengan string rahasia mu

// Encode ID numerik → string
export const obfuscateId = (id: number): string => {
  const str = id.toString() + SALT;
  const base64 = Buffer.from(str).toString("base64");
  return (
    PREFIX + base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  ); // URL-safe
};

// Decode string → ID numerik
export const deobfuscateId = (obfuscated: string): number | null => {
  try {
    if (!obfuscated.startsWith(PREFIX)) return null;

    const base64 = obfuscated
      .slice(PREFIX.length)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    // Tambahkan padding '=' jika perlu
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const decoded = Buffer.from(padded, "base64").toString("utf8");

    if (!decoded.endsWith(SALT)) return null;

    const idStr = decoded.slice(0, -SALT.length);
    const id = parseInt(idStr, 10);

    return isNaN(id) ? null : id;
  } catch {
    return null;
  }
};
