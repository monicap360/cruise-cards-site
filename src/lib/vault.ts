import { supabase } from "@/lib/supabase";

// Zero-knowledge password vault. Secrets are encrypted IN THE BROWSER with a key
// derived from a master passphrase (PBKDF2 → AES-GCM). The passphrase is never
// sent or stored. Supabase only holds ciphertext, so even with the public anon
// key the data is unreadable without the passphrase. Lose the passphrase = lose
// the data (by design — there is no recovery).

export type VaultItem = {
  id: string;
  label: string;
  username: string;
  password: string;
  url: string;
  notes: string;
};

const ROW_ID = "primary";
const ITERATIONS = 310000;

export const newVaultItemId = () =>
  (crypto.randomUUID?.() ?? "v-" + Math.random().toString(36).slice(2, 11));

function bufToB64(b: ArrayBuffer): string {
  const bytes = new Uint8Array(b);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function b64ToBytes(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export type VaultBlob = { salt: string; iv: string; ciphertext: string };

// Returns null when no vault exists yet (first-time setup).
export async function loadVaultBlob(): Promise<VaultBlob | null> {
  const { data } = await supabase.from("vault").select("salt,iv,ciphertext").eq("id", ROW_ID).limit(1);
  if (!data || !data[0]) return null;
  return data[0] as VaultBlob;
}

// Decrypts the blob. Throws if the passphrase is wrong (GCM auth failure).
export async function decryptVault(blob: VaultBlob, passphrase: string): Promise<VaultItem[]> {
  const key = await deriveKey(passphrase, b64ToBytes(blob.salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(blob.iv) },
    key,
    b64ToBytes(blob.ciphertext)
  );
  const parsed = JSON.parse(new TextDecoder().decode(plain));
  return Array.isArray(parsed) ? parsed : [];
}

// Encrypts and upserts. Reuses the salt when given (same passphrase); generates
// one on first save. Returns the salt (base64) so the caller can re-save later.
export async function encryptAndSave(
  items: VaultItem[],
  passphrase: string,
  existingSalt?: string
): Promise<string> {
  const saltBytes = existingSalt ? b64ToBytes(existingSalt) : crypto.getRandomValues(new Uint8Array(16));
  const saltB64 = existingSalt ?? bufToB64(saltBytes.buffer);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, saltBytes);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(items))
  );
  const { error } = await supabase.from("vault").upsert({
    id: ROW_ID,
    salt: saltB64,
    iv: bufToB64(iv.buffer),
    ciphertext: bufToB64(ct),
  });
  if (error) throw error;
  return saltB64;
}
