import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { GROUP_CRUISES, getGroupCruise } from "@/lib/group-cruises";

export const dynamic = "force-static";

export function generateStaticParams() {
  return GROUP_CRUISES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGroupCruise(slug);
  if (!g) return { title: "Group Cruises from Galveston" };
  return {
    title: `${g.h1} | Cruises from Galveston`,
    description: `${g.tagline} ${g.intro}`.slice(0, 155),
    alternates: { canonical: `/group-cruises/${g.slug}` },
    openGraph: { title: g.h1, description: g.tagline },
  };
}

export default async function GroupCruisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGroupCruise(slug);
  if (!g) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const others = GROUP_CRUISES.filter((x) => x.slug !== g.slug);

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <Photo src={`/destinations/${g.destSlug}.jpg`} alt={g.h1} overlay={false} className="absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">{"// Group Cruises"}</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            {g.emoji} {g.h1}
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">{g.tagline}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/group-signup" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Start a group</Link>
            <a href="tel:+14096322106" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Call (409) 632-2106</a>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <p className="text-white/70 text-lg leading-relaxed">{g.intro}</p>

        {/* Highlights */}
        <div className="grid sm:grid-cols-2 gap-4">
          {g.highlights.map((h) => (
            <div key={h.title} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
              <div className="text-3xl mb-2">{h.icon}</div>
              <div className="font-extrabold uppercase tracking-tight">{h.title}</div>
              <div className="text-white/55 text-sm mt-1">{h.text}</div>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// What we handle"}</div>
          <ul className="space-y-2">
            {g.included.map((x) => (
              <li key={x} className="text-white/75 flex gap-2"><span className="text-sky-400">✓</span> {x}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/group-signup" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">Start your group</Link>
            <Link href="/request-group-space" className="border border-white/20 hover:border-white/50 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">Travel agent? Request space</Link>
            <Link href="/find" className="border border-white/20 hover:border-white/50 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">Browse sailings</Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-5">{"// Frequently asked"}</div>
          <div className="space-y-3">
            {g.faq.map((f) => (
              <div key={f.q} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-white">{f.q}</div>
                <div className="text-white/60 text-sm mt-1.5">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Other occasions */}
        <div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// More group cruises"}</div>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/group-cruises/${o.slug}`} className="bg-white/5 border border-white/10 hover:border-sky-400/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white">
                {o.emoji} {o.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
