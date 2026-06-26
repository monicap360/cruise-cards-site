import Script from "next/script";

/**
 * Loads Google Analytics 4 + Microsoft Clarity when their IDs are configured.
 * Set in env (and Render): NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXX) and
 * NEXT_PUBLIC_CLARITY_ID (the Clarity project id). Until set, nothing loads.
 */
export default function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga}');`}
          </Script>
        </>
      )}
      {clarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}
