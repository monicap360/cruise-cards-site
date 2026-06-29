"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type GuestDocument,
  DOCUMENT_TYPES,
  getAllDocuments,
  saveDocument,
  deleteDocument,
  uploadGuestFile,
  newDocId,
} from "@/lib/documents";
import { type GroupDeposit, getGroupDeposits } from "@/lib/group-deposits";

function DocumentsInner() {
  const params = useSearchParams();
  const [docs, setDocs] = useState<GuestDocument[]>([]);
  const [groups, setGroups] = useState<GroupDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<"individual" | "group">("individual");
  const [email, setEmail] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [confirmNumber, setConfirmNumber] = useState("");
  const [type, setType] = useState(DOCUMENT_TYPES[0]);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  async function refresh() {
    setDocs(await getAllDocuments());
    setLoading(false);
  }
  useEffect(() => {
    refresh();
    getGroupDeposits().then(setGroups);
  }, []);

  // Preset from a deep link, e.g. /admin/documents?scope=group&group=Thanksgiving…
  // or ?scope=individual&email=guest@x.com — so a booking/group page can open
  // the uploader prefilled for that exact guest or group.
  useEffect(() => {
    const s = params.get("scope");
    if (s === "group" || s === "individual") setScope(s);
    const em = params.get("email");
    if (em) setEmail(em);
    const g = params.get("group");
    if (g) setGroupName(g);
    const gid = params.get("groupId");
    if (gid) setGroupId(gid);
  }, [params]);

  function pickGroup(id: string) {
    setGroupId(id);
    const g = groups.find((x) => x.id === id);
    setGroupName(g ? g.groupName : "");
  }

  async function upload() {
    if (!file) {
      alert("Choose a PDF file.");
      return;
    }
    if (scope === "individual" && !email.trim()) {
      alert("Add the guest email.");
      return;
    }
    if (scope === "group" && !groupName.trim()) {
      alert("Pick a group (or type a group name).");
      return;
    }
    setBusy(true);
    setMsg("Uploading…");
    const up = await uploadGuestFile(file);
    if ("error" in up) {
      setBusy(false);
      setMsg("");
      alert(
        "Upload failed: " +
          up.error +
          "\n\nMake sure a PUBLIC Storage bucket named 'documents' exists in Supabase."
      );
      return;
    }
    await saveDocument({
      id: newDocId(),
      scope,
      email: scope === "individual" ? email : "",
      groupId: scope === "group" ? groupId : "",
      groupName: scope === "group" ? groupName : "",
      confirmNumber,
      type,
      label,
      fileUrl: up.url,
      fileName: up.name,
      uploadedBy: "admin",
    });
    setBusy(false);
    setMsg("✓ Uploaded");
    setFile(null);
    setLabel("");
    setConfirmNumber("");
    refresh();
    setTimeout(() => setMsg(""), 3000);
  }

  async function remove(id: string) {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    refresh();
  }

  const shown = search.trim()
    ? docs.filter((d) =>
        `${d.email} ${d.groupName} ${d.confirmNumber} ${d.label}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : docs;

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Admin
          </Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">
            {"// Guest Documents"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
            Confirmations &amp; Invoices
          </h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Upload a cruise-line confirmation or agent invoice for an{" "}
            <span className="text-white">individual</span> (appears in their account
            portal, matched by email) or for a{" "}
            <span className="text-white">group</span> (attached to the group).
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload form */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="font-extrabold text-lg mb-4">Upload a document</h2>

          {/* Individual vs Group toggle */}
          <div className="flex gap-2 mb-4">
            {(["individual", "group"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  scope === s
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {s === "individual" ? "👤 Individual" : "👥 Group"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scope === "individual" ? (
              <div>
                <label className={lbl}>Guest email *</label>
                <input className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="guest@example.com" />
              </div>
            ) : (
              <div>
                <label className={lbl}>Group *</label>
                <select className={input} value={groupId} onChange={(e) => pickGroup(e.target.value)}>
                  <option value="" className="bg-[#0b1020]">— pick a group —</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id} className="bg-[#0b1020]">
                      {g.groupName}{g.ship ? ` · ${g.ship}` : ""}
                    </option>
                  ))}
                </select>
                <input
                  className={`${input} mt-2`}
                  value={groupName}
                  onChange={(e) => { setGroupName(e.target.value); setGroupId(""); }}
                  placeholder="…or type a group name"
                />
              </div>
            )}
            <div>
              <label className={lbl}>Confirmation # (optional)</label>
              <input className={input} value={confirmNumber} onChange={(e) => setConfirmNumber(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Type</label>
              <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0b1020]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Label (optional)</label>
              <input className={input} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Carnival Jubilee · Dec 9" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>PDF file *</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:text-black file:font-semibold file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={upload}
              disabled={busy}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              {busy ? "Uploading…" : "Upload document"}
            </button>
            {msg && <span className="text-sky-300 text-sm">{msg}</span>}
          </div>
        </div>

        {/* List */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">
              {`// ${docs.length} document${docs.length === 1 ? "" : "s"}`}
            </div>
            <input
              className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 w-64 max-w-full"
              placeholder="Search email, group, conf #, label…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-white/45">Loading…</p>
          ) : shown.length === 0 ? (
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
              No documents yet.
            </div>
          ) : (
            <div className="space-y-2">
              {shown.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-center gap-3 flex-wrap"
                >
                  <span className="text-2xl">{d.scope === "group" ? "👥" : "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">
                        {d.scope === "group" ? d.groupName : d.email}
                      </span>
                      {d.scope === "group" && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/25">
                          Group
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">
                        {d.type}
                      </span>
                      {d.confirmNumber && (
                        <span className="text-white/40 font-mono text-xs">#{d.confirmNumber}</span>
                      )}
                    </div>
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 text-sm underline decoration-white/20 underline-offset-2"
                    >
                      {d.label || d.fileName}
                    </a>
                  </div>
                  <div className="text-white/35 text-xs whitespace-nowrap">
                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US") : ""}
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="text-red-300 hover:text-red-200 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsInner />
    </Suspense>
  );
}
