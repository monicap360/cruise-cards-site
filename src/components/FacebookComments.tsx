"use client";

import { useEffect, useRef, useState } from "react";

// Facebook Comments plugin — verified user-generated content under your posts
// (good for dwell time + fresh content). Needs a Facebook App ID set as
// NEXT_PUBLIC_FACEBOOK_APP_ID; until then the component renders nothing.
const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

type FBWindow = Window & {
  FB?: { XFBML?: { parse: (el?: Element) => void } };
};

export default function FacebookComments({
  numPosts = 5,
}: {
  numPosts?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [href, setHref] = useState("");

  useEffect(() => {
    if (!APP_ID) return;
    setHref(window.location.href);

    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div");
      root.id = "fb-root";
      document.body.appendChild(root);
    }

    const id = "facebook-jssdk";
    if (!document.getElementById(id)) {
      const js = document.createElement("script");
      js.id = id;
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0&appId=${APP_ID}`;
      document.body.appendChild(js);
    } else {
      (window as FBWindow).FB?.XFBML?.parse(ref.current ?? undefined);
    }
  }, []);

  if (!APP_ID) return null;

  return (
    <section className="bg-[#05070d] text-white border-t border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
          {"// Join the conversation"}
        </div>
        {/* Plugin renders on a white card so the FB widget reads cleanly */}
        <div className="bg-white rounded-2xl p-4" ref={ref}>
          {href && (
            <div
              className="fb-comments"
              data-href={href}
              data-width="100%"
              data-numposts={numPosts}
            />
          )}
        </div>
      </div>
    </section>
  );
}
