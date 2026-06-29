import { supabase } from "@/lib/supabase";

// A document (PDF) attached to a guest by email — cruise-line confirmation,
// agent invoice, etc. Files live in the Supabase Storage "documents" bucket;
// metadata lives in the "documents" table.
export type GuestDocument = {
  id: string;
  email: string;
  confirmNumber: string;
  type: string; // "Cruise line confirmation" | "Agent invoice" | "Receipt" | "Other"
  label: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt?: string;
};

export const DOCUMENT_TYPES = [
  "Cruise line confirmation",
  "Agent invoice",
  "Receipt",
  "Travel documents",
  "Other",
];

export function newDocId() {
  return "doc-" + Math.random().toString(36).slice(2, 9);
}

function toDoc(r: Record<string, unknown>): GuestDocument {
  return {
    id: r.id as string,
    email: (r.email as string) ?? "",
    confirmNumber: (r.confirm_number as string) ?? "",
    type: (r.type as string) ?? "Other",
    label: (r.label as string) ?? "",
    fileUrl: (r.file_url as string) ?? "",
    fileName: (r.file_name as string) ?? "",
    uploadedBy: (r.uploaded_by as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

function docRow(d: GuestDocument): Record<string, unknown> {
  return {
    id: d.id,
    email: d.email.trim().toLowerCase() || null,
    confirm_number: d.confirmNumber || null,
    type: d.type || "Other",
    label: d.label || null,
    file_url: d.fileUrl,
    file_name: d.fileName,
    uploaded_by: d.uploadedBy || null,
  };
}

export async function getAllDocuments(): Promise<GuestDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toDoc);
}

export async function getDocumentsForEmail(email: string): Promise<GuestDocument[]> {
  const clean = email.trim().toLowerCase();
  if (!clean) return [];
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .ilike("email", clean)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toDoc);
}

export async function saveDocument(d: GuestDocument): Promise<boolean> {
  const { error } = await supabase.from("documents").upsert(docRow(d));
  return !error;
}

export async function deleteDocument(id: string): Promise<void> {
  await supabase.from("documents").delete().eq("id", id);
}

// Upload a file to the Supabase Storage "documents" bucket; returns a public URL.
export async function uploadGuestFile(
  file: File
): Promise<{ url: string; name: string } | { error: string }> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { upsert: true, contentType: file.type || "application/pdf" });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("documents").getPublicUrl(path);
  return { url: data.publicUrl, name: file.name };
}
