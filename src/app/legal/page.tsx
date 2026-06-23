import Link from "next/link";

const YEAR = new Date().getFullYear();
const OWNER = "Cruises from Galveston™";
const EMAIL = "cruisesfromgalveston.texas@gmail.com";

const trademarks = [
  { name: "Cruises from Galveston™", desc: "The name, logo, and branding of the business" },
  { name: "Cruise Experience Center™", desc: "The physical and virtual cruise planning center brand, including the motto Cruises Start Here and Plan. Book. Sail." },
  { name: "Sea You On Deck Crews™", desc: "The cruise social community program, all crew names, the crew system, and community framework" },
  { name: "Sea Duck Hunters™", desc: "The onboard duck-hunting community game and brand" },
  { name: "Sea Pay™", desc: "The customer-controlled cruise installment payment system" },
  { name: "Sea Memories Crew™", desc: "Crew brand" },
  { name: "SeaStrong Crew™", desc: "Crew brand" },
  { name: "Party Wake Crew™", desc: "Crew brand" },
  { name: "Easy Waves Crew™", desc: "Crew brand" },
  { name: "Jackpot Crew™", desc: "Crew brand" },
  { name: "Seniors at Sea™", desc: "Crew brand" },
  { name: "Singles At Sea Crew™", desc: "Crew brand" },
  { name: "Mindful Mornings Crew™", desc: "Crew brand" },
  { name: "Zen at Sea™", desc: "Crew brand" },
  { name: "Serenity at Sea™", desc: "Crew brand" },
];

const prohibited = [
  "Copy, reproduce, republish, upload, or transmit any content from this website without written permission",
  "Use any of our brand names, logos, slogans, crew names, or program names (including Sea You On Deck Crews™, Sea Pay™, Cruise Experience Center™, Sea Duck Hunters™, or any crew name) for any commercial purpose",
  "Create a competing product, service, app, or website that imitates our community systems, crew framework, booking features, or brand identity",
  "Scrape, harvest, or automatically collect any data, content, or structure from this website",
  "Use our ideas, concepts, or systems as the basis for a substantially similar competing product or service",
  "Remove, alter, or obscure any copyright, trademark, or proprietary notice from any content on this site",
  "Claim ownership of any content, brand name, crew name, program, or system originating from this website",
];

export default function LegalPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Legal</div>
          <h1 className="text-4xl font-extrabold mb-3">Intellectual Property &amp; Legal Notice</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            All content, brand names, programs, systems, crew names, and ideas on this website are the exclusive property of {OWNER}. Unauthorized use is prohibited.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">

        {/* Copyright */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">Copyright Notice</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900 font-semibold text-lg mb-4">
            © {YEAR} Cruises from Galveston™. All Rights Reserved.
          </div>
          <p className="text-gray-600 leading-relaxed">
            All content on this website — including but not limited to text, graphics, logos, icons, images, page layouts, program names, crew names, community systems, booking system concepts, and software — is the exclusive property of {OWNER} and is protected by United States copyright law and applicable international treaties. No content may be reproduced, distributed, modified, or used in any form without the prior written consent of {OWNER}.
          </p>
        </section>

        {/* Trademarks */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">Trademarks &amp; Brand Names</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The following names, slogans, and programs are trademarks and proprietary brands of {OWNER}. Unauthorized use of any of these names — in whole, in part, or in any confusingly similar form — for commercial purposes is strictly prohibited.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trademarks.map((tm) => (
              <div key={tm.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="font-extrabold text-blue-900 text-sm mb-1">{tm.name}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{tm.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            ™ indicates a trademark claim. Use of the ™ symbol does not constitute a concession that registration is required for protection under applicable law.
          </p>
        </section>

        {/* Slogans */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">Proprietary Slogans &amp; Mottos</h2>
          <div className="space-y-3">
            {[
              { slogan: '“Cruises Start Here.”', owner: "Cruise Experience Center™" },
              { slogan: '“Plan. Book. Sail.”', owner: "Cruise Experience Center™" },
              { slogan: '“Find Your People Before You Sail.”', owner: "Sea You On Deck Crews™" },
              { slogan: '“Cruise communities, meetups, tips, and onboard connections.”', owner: "Sea You On Deck Crews™" },
            ].map((s) => (
              <div key={s.slogan} className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-3">
                <span className="font-bold text-blue-900 italic flex-1">{s.slogan}</span>
                <span className="text-xs text-gray-400 font-semibold flex-shrink-0">{s.owner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Uses */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">Prohibited Uses</h2>
          <p className="text-gray-600 mb-4">You may not, without prior written permission from {OWNER}:</p>
          <ul className="space-y-3">
            {prohibited.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-red-500 font-extrabold mt-0.5 flex-shrink-0">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* DMCA */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">DMCA &amp; Infringement Reporting</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you believe that any content on this website infringes upon your intellectual property rights, or if you become aware of unauthorized use of our intellectual property, please contact us immediately. We take IP violations seriously and will pursue all available legal remedies.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="font-extrabold text-red-800 mb-2">Report Infringement or Unauthorized Use</div>
            <div className="text-sm text-red-700 space-y-1">
              <div>📧 <a href={`mailto:${EMAIL}?subject=IP Infringement Notice`} className="underline hover:no-underline">{EMAIL}</a></div>
              <div className="text-xs text-red-500 mt-2">Include: your name, description of the IP concern, URL of the infringing content (if applicable), and your contact information.</div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">No License Granted</h2>
          <p className="text-gray-600 leading-relaxed">
            Nothing on this website shall be construed as granting, by implication, estoppel, or otherwise, any license or right to use any trademark, brand name, logo, slogan, content, or intellectual property displayed on the site without the written permission of {OWNER}. Any unauthorized use will constitute an infringement and may subject you to civil and criminal penalties.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4">Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            This legal notice and any disputes arising from the use of this website or the unauthorized use of our intellectual property shall be governed by the laws of the State of Texas, United States of America. Any legal proceedings shall be brought exclusively in the courts of Galveston County, Texas.
          </p>
          <div className="mt-4 bg-gray-50 rounded-xl px-5 py-4 text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {OWNER} · Galveston, Texas
          </div>
        </section>

        <div className="border-t border-gray-100 pt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
