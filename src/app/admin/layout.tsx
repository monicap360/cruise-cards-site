// Admin-only shell. The `admin-scope` class bumps the dashboard font/UI size
// (see globals.css). Public chrome (navbar/footer/chatbot) is already stripped
// from /admin by SiteChrome, so the admin is a separate surface.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-scope">{children}</div>;
}
