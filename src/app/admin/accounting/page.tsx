"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type LedgerEntry,
  type LedgerType,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  METHODS,
  STATUSES,
  blankEntry,
  getLedger,
  saveEntry,
  saveEntries,
  deleteEntry,
  newLedgerId,
  totals,
  byMonth,
  parseCsv,
  guessColumn,
} from "@/lib/accounting";

function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const inputClass =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
const labelClass =
  "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";
const btnPrimary =
  "bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all";

type MapKey = "date" | "amount" | "description" | "client" | "category";

const MAP_CANDIDATES: Record<MapKey, string[]> = {
  date: ["date", "created", "issued"],
  amount: ["amount", "total", "paid", "subtotal", "amount (usd)"],
  description: ["description", "notes", "item", "line item", "memo", "service"],
  client: ["client", "customer", "organization", "company"],
  category: ["category", "expense category", "type"],
};

const MAP_LABELS: Record<MapKey, string> = {
  date: "Date",
  amount: "Amount",
  description: "Description",
  client: "Client",
  category: "Category",
};

export default function AccountingPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [year, setYear] = useState("all");
  const [filter, setFilter] = useState<"all" | LedgerType>("all");
  const [search, setSearch] = useState("");

  // add/edit form
  const [form, setForm] = useState<LedgerEntry>(blankEntry());
  const [saving, setSaving] = useState(false);

  // import
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvMsg, setCsvMsg] = useState("");
  const [importType, setImportType] = useState<LedgerType>("income");
  const [colMap, setColMap] = useState<Record<MapKey, number>>({
    date: -1,
    amount: -1,
    description: -1,
    client: -1,
    category: -1,
  });
  const [importResult, setImportResult] = useState("");

  async function refresh() {
    setEntries(await getLedger());
  }

  useEffect(() => {
    refresh();
  }, []);

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      const y = (e.date || "").slice(0, 4);
      if (y) set.add(y);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  // year-filtered set drives summary, by-month, and ledger
  const yearFiltered = useMemo(
    () =>
      year === "all"
        ? entries
        : entries.filter((e) => (e.date || "").slice(0, 4) === year),
    [entries, year]
  );

  const sum = useMemo(() => totals(yearFiltered), [yearFiltered]);
  const months = useMemo(() => byMonth(yearFiltered), [yearFiltered]);

  const ledgerRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return yearFiltered.filter((e) => {
      const matchType = filter === "all" || e.type === filter;
      const matchSearch =
        !q ||
        e.description.toLowerCase().includes(q) ||
        e.client.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.invoiceNumber.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [yearFiltered, filter, search]);

  const formCategories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function setFormType(type: LedgerType) {
    const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((f) => ({
      ...f,
      type,
      category: cats.includes(f.category) ? f.category : cats[0],
    }));
  }

  async function handleSave() {
    if (!form.date || !form.amount) return;
    setSaving(true);
    const ok = await saveEntry(form);
    setSaving(false);
    if (ok) {
      setForm(blankEntry());
      refresh();
    }
  }

  function handleEdit(e: LedgerEntry) {
    setForm({ ...e });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ledger entry?")) return;
    await deleteEntry(id);
    refresh();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImportResult("");
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      setCsvHeaders([]);
      setCsvRows([]);
      setCsvMsg("Couldn't read that file — it looks empty or has no data rows.");
      return;
    }
    const headers = rows[0];
    setCsvHeaders(headers);
    setCsvRows(rows);
    setCsvMsg("");
    setColMap({
      date: guessColumn(headers, MAP_CANDIDATES.date),
      amount: guessColumn(headers, MAP_CANDIDATES.amount),
      description: guessColumn(headers, MAP_CANDIDATES.description),
      client: guessColumn(headers, MAP_CANDIDATES.client),
      category: guessColumn(headers, MAP_CANDIDATES.category),
    });
  }

  function cell(row: string[], key: MapKey): string {
    const idx = colMap[key];
    if (idx < 0 || idx >= row.length) return "";
    return row[idx] ?? "";
  }

  const dataRows = csvRows.slice(1);

  function buildEntries(): LedgerEntry[] {
    const out: LedgerEntry[] = [];
    for (const row of dataRows) {
      const dateRaw = cell(row, "date").trim();
      const amount = parseFloat(cell(row, "amount").replace(/[^0-9.-]/g, ""));
      if (!dateRaw || isNaN(amount) || amount === 0) continue;
      out.push({
        id: newLedgerId(),
        date: dateRaw,
        type: importType,
        category: cell(row, "category").trim(),
        client: cell(row, "client").trim(),
        description: cell(row, "description").trim(),
        amount: Math.abs(amount),
        method: METHODS[0],
        status: "paid",
        invoiceNumber: "",
        source: "freshbooks",
      });
    }
    return out;
  }

  const importable = useMemo(
    () => (csvRows.length > 1 ? buildEntries() : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [csvRows, colMap, importType]
  );

  async function handleImport() {
    const toImport = buildEntries();
    if (toImport.length === 0) {
      setImportResult("Nothing to import — check your column mapping.");
      return;
    }
    const count = await saveEntries(toImport);
    setImportResult(`Imported ${count}`);
    setCsvHeaders([]);
    setCsvRows([]);
    setColMap({ date: -1, amount: -1, description: -1, client: -1, category: -1 });
    refresh();
  }

  const previewRows = dataRows.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
            {"// Accounting"}
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Bookkeeping
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className={labelClass}>Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClass}
                >
                  <option className="bg-[#0b1020]" value="all">
                    All years
                  </option>
                  {years.map((y) => (
                    <option className="bg-[#0b1020]" key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <Link
                href="/admin"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold px-4 py-2.5 rounded-full transition-all text-[13px] self-end"
              >
                ← Admin
              </Link>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#0b1020] rounded-2xl border border-green-400/30 p-6">
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mb-1">
                Income
              </div>
              <div className="text-2xl font-extrabold text-green-300">
                {usd(sum.income)}
              </div>
            </div>
            <div className="bg-[#0b1020] rounded-2xl border border-red-400/30 p-6">
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mb-1">
                Expenses
              </div>
              <div className="text-2xl font-extrabold text-red-300">
                {usd(sum.expense)}
              </div>
            </div>
            <div className="bg-[#0b1020] rounded-2xl border border-sky-400/30 p-6">
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mb-1">
                Net Profit
              </div>
              <div className="text-2xl font-extrabold text-holo">
                {usd(sum.net)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* By month */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-4">
            By Month
          </h2>
          {months.length === 0 ? (
            <p className="text-white/45 text-sm">No entries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/45 label-mono text-[10px] uppercase tracking-wider text-left">
                    <th className="py-2 pr-4">Month</th>
                    <th className="py-2 pr-4 text-right">Income</th>
                    <th className="py-2 pr-4 text-right">Expense</th>
                    <th className="py-2 text-right">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m.month} className="border-t border-white/10">
                      <td className="py-2 pr-4 font-mono text-white/80">
                        {m.month}
                      </td>
                      <td className="py-2 pr-4 text-right text-green-300">
                        {usd(m.income)}
                      </td>
                      <td className="py-2 pr-4 text-right text-red-300">
                        {usd(m.expense)}
                      </td>
                      <td
                        className={`py-2 text-right font-bold ${
                          m.net < 0 ? "text-red-300" : "text-green-300"
                        }`}
                      >
                        {usd(m.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add entry */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-4">
            {entries.some((e) => e.id === form.id) ? "Edit Entry" : "Add Entry"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setFormType(e.target.value as LedgerType)}
                className={inputClass}
              >
                <option className="bg-[#0b1020]" value="income">
                  Income
                </option>
                <option className="bg-[#0b1020]" value="expense">
                  Expense
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {formCategories.map((c) => (
                  <option className="bg-[#0b1020]" key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount</label>
              <input
                type="number"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
                }
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Client</label>
              <input
                type="text"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className={inputClass}
                placeholder="Customer / vendor"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={inputClass}
                placeholder="Notes"
              />
            </div>
            <div>
              <label className={labelClass}>Method</label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className={inputClass}
              >
                {METHODS.map((m) => (
                  <option className="bg-[#0b1020]" key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option className="bg-[#0b1020]" key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Invoice #</label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) =>
                  setForm({ ...form, invoiceNumber: e.target.value })
                }
                className={inputClass}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !form.date || !form.amount}
              className={`${btnPrimary} disabled:opacity-40`}
            >
              {saving ? "Saving…" : "Add Entry"}
            </button>
            {entries.some((e) => e.id === form.id) && (
              <button
                onClick={() => setForm(blankEntry())}
                className="text-white/50 hover:text-white text-sm font-semibold"
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>

        {/* Import from FreshBooks */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-1">
            Import from FreshBooks (CSV)
          </h2>
          <p className="text-white/45 text-sm mb-4">
            Upload an invoices/payments export (income) or an expenses export
            (expense). Map the columns, preview, then import.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:text-black file:font-semibold file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider"
            />
            <div>
              <label className={labelClass}>Default type</label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as LedgerType)}
                className={inputClass}
              >
                <option className="bg-[#0b1020]" value="income">
                  Income
                </option>
                <option className="bg-[#0b1020]" value="expense">
                  Expense
                </option>
              </select>
            </div>
          </div>

          {csvMsg && (
            <p className="text-red-300 text-sm mt-4">{csvMsg}</p>
          )}

          {csvHeaders.length > 0 && (
            <div className="mt-6 space-y-6">
              {/* Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(Object.keys(MAP_LABELS) as MapKey[]).map((key) => (
                  <div key={key}>
                    <label className={labelClass}>{MAP_LABELS[key]} column</label>
                    <select
                      value={colMap[key]}
                      onChange={(e) =>
                        setColMap({
                          ...colMap,
                          [key]: parseInt(e.target.value, 10),
                        })
                      }
                      className={inputClass}
                    >
                      <option className="bg-[#0b1020]" value={-1}>
                        — none —
                      </option>
                      {csvHeaders.map((h, i) => (
                        <option className="bg-[#0b1020]" key={i} value={i}>
                          {h || `Column ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div>
                <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mb-2">
                  Preview (first 5 rows)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/45 label-mono text-[10px] uppercase tracking-wider text-left">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Description</th>
                        <th className="py-2 pr-4">Client</th>
                        <th className="py-2">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td className="py-2 pr-4 font-mono text-white/80">
                            {cell(row, "date")}
                          </td>
                          <td className="py-2 pr-4">{cell(row, "amount")}</td>
                          <td className="py-2 pr-4">{cell(row, "description")}</td>
                          <td className="py-2 pr-4">{cell(row, "client")}</td>
                          <td className="py-2">{cell(row, "category")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button onClick={handleImport} className={btnPrimary}>
                Import {importable.length} row
                {importable.length === 1 ? "" : "s"}
              </button>
            </div>
          )}

          {importResult && (
            <p className="text-green-300 text-sm mt-4 font-semibold">
              {importResult}
            </p>
          )}
        </div>

        {/* Ledger */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-4">
            Ledger
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search description, client, category, invoice…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
            />
            {(["all", "income", "expense"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {ledgerRows.length === 0 ? (
            <p className="text-white/45 text-sm">No entries match.</p>
          ) : (
            <div className="space-y-2">
              {ledgerRows.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between flex-wrap gap-3 border-t border-white/10 pt-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        e.type === "income" ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-white/40">
                          {e.date}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {e.category || "—"}
                        </span>
                        {e.client && (
                          <span className="text-white/55 text-sm">
                            · {e.client}
                          </span>
                        )}
                      </div>
                      <div className="text-white/45 text-xs mt-0.5 truncate">
                        {e.description}
                        {e.description && (e.method || e.status) ? " · " : ""}
                        {e.method}
                        {e.method && e.status ? " · " : ""}
                        {e.status}
                        {e.invoiceNumber ? ` · #${e.invoiceNumber}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-base font-extrabold ${
                        e.type === "income" ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {e.type === "expense" ? "−" : ""}
                      {usd(e.amount)}
                    </div>
                    <button
                      onClick={() => handleEdit(e)}
                      className="text-sky-300 hover:text-sky-200 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-300 hover:text-red-200 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
