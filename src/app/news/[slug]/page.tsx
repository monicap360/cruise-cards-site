import Link from "next/link";
import { POSTS, getPost } from "@/lib/news";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Article not found",
      description: "This cruise news article could not be found.",
    };
  }

  return {
    title: `${post.title} | Cruise News`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="bg-[#05070d] text-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// 404"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Article not found
          </h1>
          <p className="text-white/55 mb-9">
            We couldn&apos;t find that story. It may have moved or the link may
            be incorrect.
          </p>
          <Link
            href="/news"
            className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Back to all news
          </Link>
        </div>
      </div>
    );
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    description: post.excerpt,
    articleSection: post.category,
    author: { "@type": "Organization", name: "Cruises from Galveston" },
    publisher: {
      "@type": "Organization",
      name: "Cruises from Galveston",
      logo: { "@type": "ImageObject", url: "https://cruisesfromgalveston.net/logo.png" },
    },
    mainEntityOfPage: `https://cruisesfromgalveston.net/news/${post.slug}`,
  };

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {/* Article header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <Link
            href="/news"
            className="label-mono text-[11px] uppercase text-sky-400/80 hover:text-sky-300 transition-colors inline-block mb-8"
          >
            &larr; All news
          </Link>
          <div className="inline-flex items-center rounded-full bg-sky-400/10 text-sky-400 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 mb-5">
            {post.category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] leading-[1.02] mb-5">
            {post.title}
          </h1>
          <div className="label-mono text-[12px] uppercase text-white/40">
            {formatDate(post.date)} &middot; {post.readMins} min read
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {post.body.map((para, i) => (
          <p key={i} className="text-white/70 text-lg leading-relaxed mb-5">
            {para}
          </p>
        ))}
      </article>

      {/* CTA band */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// From the Experience Center"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Ready to plan your sailing?
          </h2>
          <p className="text-white/55 text-lg mb-9">
            Find your cruise from Galveston, or talk it through with a local
            specialist at (409) 632-2106 — no pressure, just answers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/find"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Find a Cruise
            </Link>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
