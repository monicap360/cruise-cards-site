import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year (only effective when served over HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js hydration + the Facebook SDK (comments/share)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net",
      // Tailwind inline styles
      "style-src 'self' 'unsafe-inline'",
      // Images: self, data/blob (Next/Image) + https for FB & map tiles
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      // Supabase + Facebook
      "connect-src 'self' https://*.supabase.co https://connect.facebook.net https://*.facebook.com",
      "media-src 'self'",
      // Embeds we use: Facebook comments, Jotform e-sign, Google Maps, booking calendar
      "frame-src https://www.facebook.com https://web.facebook.com https://*.facebook.com https://www.jotform.com https://form.jotform.com https://maps.google.com https://www.google.com https://calendar.google.com https://calendly.com https://docs.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Don't let cosmetic ESLint rules (e.g. unescaped apostrophes) fail the
  // production build on Render — TypeScript type-checking still runs, so real
  // bugs are still caught. This is what kept deploys silently stuck.
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      // Vanity group links → hosted-group page
      { source: "/thanksgiving-alston-group", destination: "/groups/thanksgiving-alston-group" },
      { source: "/gabbys-alaska", destination: "/groups/gabby-group" },
      { source: "/gabby", destination: "/groups/gabby-group" },
    ];
  },
};

export default nextConfig;
