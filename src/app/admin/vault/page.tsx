"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type VaultItem, type VaultBlob,
  loadVaultBlob, decryptVault, encryptAndSave, newVaultItemId,
} from "@/lib/vault";

type Phase = "loading" | "setup" | "locked" | "unlocked";
const AUTO_LOCK_MS = 10 * 60 * 1000; // lock after 10 min idle

function blank(): VaultItem {
  return { id: newVaultItemId(), label: "", username: "", password: "", url: "", notes: "" };
}

export default function VaultPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [blob, setBlob] = useState<VaultBlob | null>(null);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Unlocked state — kept only in memory.
  const passRef = useRef("");
  const saltRef = useRef("");
  const [items, setItems] = useState<VaultItem[]>([]);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<VaultItem | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadVaultBlob().then((b) => { setBlob(b); setPhase(b ? "locked" : "setup"); });
  }, []);

  function lock() {
    passRef.current = ""; saltRef.current = "";
    setItems([]); setReveal({}); setEditing(null); setPass(""); setPass2("");
    setPhase("locked");
  }
  function bumpIdle() {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(lock, AUTO_LOCK_MS);
  }

  async function doSetup() {
    setErr("");
    if (pass.length < 10) { setErr("Use at least 10 characters for your master passphrase."); return; }
    if (pass !== pass2) { setErr("Passphrases don't match."); return; }
    setBusy(true);
    try {
      const salt = await encryptAndSave([], pass, undefined);
      passRef.current = pass; saltRef.current = salt;
      setItems([]); setPhase("unlocked"); setPass(""); setPass2(""); bumpIdle();
    } catch { setErr("Couldn't create the vault. Is the `vault` table set up?"); }
    setBusy(false);
  }

  async function doUnlock() {
    setErr("");
    if (!blob) return;
    setBusy(true);
    try {
      const list = await decryptVault(blob, pass);
      passRef.current = pass; saltRef.current = blob.salt;
      setItems(list); setPhase("unlocked"); setPass(""); bumpIdle();
    } catch { setErr("Wrong passphrase — try again."); }
    setBusy(false);
  }

  async function persist(next: VaultItem[]) {
    setItems(next);
    await encryptAndSave(next, passRef.current, saltRef.current);
  }
  async function saveItem() {
    if (!editing) return;
    if (!editing.label.trim()) { setErr("Give it a name."); return; }
    bumpIdle();
    const exists = items.some((i) => i.id === editing.id);
    const next = exists ? items.map((i) => (i.id === editing.id ? editing : i)) : [...items, editing];
    await persist(next);
    setEditing(null); setErr("");
  }
  async function removeItem(id: string) {
    if (!confirm("Delete this entry?")) return;
    bumpIdle();
    await persist(items.filter((i) => i.id !== id));
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5";

  // ── Loading ──
  if (phase === "loading") {
    return <div className="min-h-screen bg-[#05070d] text-white/50 flex items-center justify-center">Loading vault…</div>;
  }

  // ── Setup / Unlock gate ──
  if (phase === "setup" || phase === "locked") {
    const setup = phase === "setup";
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0b1020] border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">{setup ? "Create your vault" : "Unlock vault"}</h1>
            <p className="text-white/50 text-sm mt-1">
              {setup
                ? "Pick a strong master passphrase. It encrypts everything and is never stored — if you lose it, the vault can't be recovered."
                : "Enter your master passphrase to decrypt your saved passwords."}
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Master passphrase</label>
              <input type="password" className={input} value={pass} autoFocus
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setup ? doSetup() : doUnlock())}
                placeholder="••••••••••" />
            </div>
            {setup && (
              <div>
                <label className={lbl}>Confirm passphrase</label>
                <input type="password" className={input} value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSetup()}
                  placeholder="••••••••••" />
              </div>
            )}
            {err && <div className="text-red-300 text-sm">{err}</div>}
            <button onClick={setup ? doSetup : doUnlock} disabled={busy}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full">
              {busy ? "…" : setup ? "Create vault" : "Unlock"}
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white">← Admin</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Unlocked ──
  return (
    <div className="min-h-screen bg-[#05070d] text-white" onClick={bumpIdle} onKeyDown={bumpIdle}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Secure"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">🔐 Password Vault</h1>
            <p className="text-white/55 text-sm">Encrypted in your browser. Auto-locks after 10 min idle.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(blank())} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full">+ Add</button>
            <button onClick={lock} className="border border-white/20 hover:border-white/50 text-white/80 font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full">🔒 Lock</button>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white">← Admin</Link>
          </div>
        </div>

        {editing && (
          <div className="bg-[#0b1020] border border-sky-400/30 rounded-2xl p-5 mb-5 space-y-3">
            <div className="font-bold text-sm">{items.some((i) => i.id === editing.id) ? "Edit entry" : "New entry"}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={input} placeholder="Name (e.g. Twilio) *" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
              <input className={input} placeholder="Website / URL" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
              <input className={input} placeholder="Username / email" value={editing.username} onChange={(e) => setEditing({ ...editing, username: e.target.value })} />
              <input className={input} placeholder="Password" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
            </div>
            <textarea className={`${input} resize-none`} rows={2} placeholder="Notes (account #, 2FA backup codes, PIN…)" value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            {err && <div className="text-red-300 text-sm">{err}</div>}
            <div className="flex gap-2">
              <button onClick={saveItem} className="bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Save</button>
              <button onClick={() => { setEditing(null); setErr(""); }} className="text-white/50 hover:text-white text-xs font-bold px-3">Cancel</button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-white/45 text-center py-12">No saved passwords yet. Click <strong>+ Add</strong> to store your first one.</div>
        ) : (
          <div className="space-y-2">
            {items.slice().sort((a, b) => a.label.localeCompare(b.label)).map((it) => (
              <div key={it.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-bold flex items-center gap-2">
                      {it.label}
                      {it.url && <a href={it.url.startsWith("http") ? it.url : `https://${it.url}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs font-normal hover:text-sky-300">open ↗</a>}
                    </div>
                    {it.username && (
                      <div className="text-white/55 text-sm flex items-center gap-2">
                        {it.username}
                        <button onClick={() => navigator.clipboard?.writeText(it.username)} className="text-white/35 hover:text-white text-xs">copy</button>
                      </div>
                    )}
                    <div className="text-white/55 text-sm flex items-center gap-2 mt-0.5 font-mono">
                      {reveal[it.id] ? it.password : "••••••••••"}
                      <button onClick={() => setReveal((r) => ({ ...r, [it.id]: !r[it.id] }))} className="text-white/35 hover:text-white text-xs font-sans">{reveal[it.id] ? "hide" : "show"}</button>
                      <button onClick={() => navigator.clipboard?.writeText(it.password)} className="text-sky-400 hover:text-sky-300 text-xs font-sans">copy</button>
                    </div>
                    {it.notes && <div className="text-white/40 text-xs mt-1 whitespace-pre-wrap">{it.notes}</div>}
                  </div>
                  <div className="flex gap-3 text-xs font-bold shrink-0">
                    <button onClick={() => { setEditing(it); bumpIdle(); }} className="text-sky-400 hover:text-sky-300">Edit</button>
                    <button onClick={() => removeItem(it.id)} className="text-red-300 hover:text-red-200">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
