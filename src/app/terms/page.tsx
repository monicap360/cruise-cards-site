import Link from "next/link";
import { TERMS_VERSION, TERMS_EFFECTIVE_DATE } from "@/lib/sea-pay";

export const metadata = {
  title: "Terms & Conditions · Cruises from Galveston",
};

const CRUISE_LINE_CONTRACTS = [
  {
    line: "Carnival Cruise Line",
    label: "Ticket Contract",
    url: "https://www.carnival.com/about-carnival/legal-notice/ticket-contract.aspx",
  },
  {
    line: "Royal Caribbean International",
    label: "Cruise Ticket Contract",
    url: "https://www.royalcaribbean.com/resources/cruise-ticket-contract",
  },
  {
    line: "Norwegian Cruise Line",
    label: "Guest Ticket Contract",
    url: "https://www.ncl.com/about/terms-and-conditions",
  },
  {
    line: "MSC Cruises",
    label: "Cruise Ticket Contract",
    url: "https://www.msccruisesusa.com/manage-booking/before-you-go/cruise-ticket-contract",
  },
  {
    line: "Disney Cruise Line",
    label: "Terms & Conditions",
    url: "https://disneycruise.disney.go.com/contracts-terms-safety/terms-conditions/us/",
  },
];

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg border-b border-white/10 pb-2 mb-3">
        {n}. {title.toUpperCase()}
      </h2>
      <div className="space-y-3 text-sm text-white/65 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="bg-[#05070d]">
      {/* Hero */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-2">Terms &amp; Conditions</h1>
          <p className="text-white/65">
            Cruises from Galveston · Cruise Experience Center
          </p>
          <p className="text-white/45 text-xs mt-3">
            Version {TERMS_VERSION} · Effective {TERMS_EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 sm:p-10">
          <p className="text-sm text-white/55 mb-8">
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the
            services provided by Cruises from Galveston (&quot;Agency,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including the
            Cruise Experience Center, located at 3501 Winnie, Galveston, TX 77550.
            By requesting a quote, making a reservation, submitting a booking, or
            using our website or facilities, you (&quot;Client,&quot;
            &quot;you,&quot; or &quot;Guest&quot;) acknowledge that you have read,
            understood, and agree to be bound by these Terms. If you do not agree,
            do not use our services.
          </p>

          <Section n="1" title="Agency Role & Independent Contractor Status">
            <p>
              The Agency acts solely as an independent travel agent and
              intermediary, arranging travel services on your behalf with cruise
              lines, hotels, transportation providers, tour operators, and other
              third-party suppliers (collectively, &quot;Suppliers&quot;). We do
              not own, operate, control, or supervise any Supplier. All travel
              documents, cruise fares, and transportation are subject to the terms,
              conditions, and ticket/passage contracts of the applicable Supplier,
              which constitute a separate, direct contract between you and that
              Supplier.
            </p>
          </Section>

          <Section n="2" title="Payment Terms">
            <p>Accepted methods of payment to the Agency are:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Check</strong>, made payable to{" "}
                <strong>Cruises from Galveston</strong> and mailed to{" "}
                <strong>3501 Winnie, Galveston, TX 77550</strong>;
              </li>
              <li>
                <strong>In person</strong> at the Cruise Experience Center; or
              </li>
              <li>
                <strong>Payment made directly to the cruise line</strong> through
                the cruise line&apos;s own secure systems.
              </li>
            </ul>
            <p>
              <strong>
                Payment by mailed check does not post to your booking until the
                check has cleared our bank.
              </strong>{" "}
              A check that is returned, dishonored, or for which a stop-payment is
              issued shall be treated as non-payment, and you agree to pay any
              resulting bank fees and a returned-item charge. The Agency does not
              custody, store, or process credit or debit card data; where a card is
              used, it is processed exclusively through the applicable cruise
              line&apos;s systems pursuant to the cruise line&apos;s authorization
              process.
            </p>
            <p>
              For payment-plan (Sea Pay) bookings, deposits and scheduled
              installments must be received by their due dates. Final payment is due
              no later than sixty (60) days before sailing (or earlier if required
              by the Supplier). Failure to pay by a due date may result in
              cancellation and forfeiture of amounts paid in accordance with Section
              4.
            </p>
          </Section>

          <Section n="3" title="Prices, Taxes & Exclusions">
            <p>
              All prices are quoted in U.S. dollars and are subject to change and to
              availability until paid in full. Unless expressly stated in writing,
              quoted prices do{" "}
              <strong>
                not include gratuities, service charges, or vacation/travel
                protection
              </strong>
              , which are never included in the cruise price. You are responsible
              for all taxes, port fees, fuel supplements, gratuities, onboard
              charges, and other amounts imposed by the Supplier or any governmental
              authority.
            </p>
          </Section>

          <Section n="4" title="Cancellations, Penalties & No Going Back">
            <p>
              <strong>
                All cancellations are final and cannot be undone or reversed.
              </strong>{" "}
              Cancellation requests must be submitted{" "}
              <strong>in writing through our online process</strong> and are{" "}
              <strong>not accepted verbally or through an individual agent</strong>.
              You accept and agree to pay all cancellation penalties, and you agree
              to comply with all rules, fare rules, and penalty schedules imposed by
              the applicable cruise line, which control. Cancellation penalties may
              equal up to one hundred percent (100%) of the total cost. Non-refundable
              deposits, fares, and fees are non-refundable. The Agency&apos;s service
              fees are non-refundable.
            </p>
          </Section>

          <Section n="5" title="Travel Protection">
            <p>
              Travel protection / trip insurance is{" "}
              <strong>strongly recommended</strong> and is not included in the cruise
              price. If you decline travel protection, you assume all risk of loss
              arising from cancellation, interruption, delay, medical events, missed
              connections, or lost property. By declining, you acknowledge you were
              offered coverage and waive any related claim against the Agency.
            </p>
          </Section>

          <Section n="6" title="Identity Verification & Conduct">
            <p>
              For the safety of our staff and guests, in-person guests may be
              required to present a valid government-issued photo identification,
              which our staff verify visually at the time of service. We do not
              retain copies of your identification. We reserve the right to refuse
              or discontinue service to any person who is abusive, threatening, or
              who cannot be reasonably identified.
            </p>
          </Section>

          <Section n="7" title="Authorization of Charges & Chargebacks">
            <p>
              By submitting payment or authorizing payment to a cruise line in
              connection with a booking arranged by the Agency, you represent that
              you are the authorized account holder and that you authorize the
              charge(s) for the amounts and on the schedule disclosed to you. You
              acknowledge that the cancellation and penalty terms in Section 4 are
              material terms of your booking.
            </p>
            <p>
              You agree that, before initiating any dispute, reversal, or
              &quot;chargeback&quot; with your card issuer or bank, you will first
              contact the Agency in writing to attempt resolution. You agree{" "}
              <strong>
                not to initiate a chargeback or payment dispute for charges that are
                valid under these Terms or under the applicable cruise line&apos;s
                ticket/passage contract
              </strong>
              , including charges representing cancellation penalties, non-refundable
              amounts, or services rendered. A chargeback initiated in breach of this
              Section constitutes a breach of contract, and you agree to be
              responsible for the disputed amount, any associated fees, and the costs
              of collection, including reasonable attorneys&apos; fees.
            </p>
          </Section>

          <Section n="8" title="Travel Documents">
            <p>
              You are solely responsible for ensuring that every traveler holds
              valid travel documents required for the itinerary, including
              passports, visas, and any health documentation. A valid passport is
              strongly recommended for all sailings. The Agency is not liable for
              denial of boarding or entry resulting from inadequate documentation,
              and no refund will be provided in such cases.
            </p>
          </Section>

          <Section n="9" title="Limitation of Liability & Indemnification">
            <p>
              To the maximum extent permitted by law, the Agency&apos;s total
              liability arising out of or relating to your booking or these Terms
              shall not exceed the total service fees actually paid by you to the
              Agency for the booking at issue. The Agency shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or
              for the acts, errors, omissions, representations, warranties, breaches,
              or negligence of any Supplier, or for personal injury, death, property
              damage, delay, or other loss arising therefrom. You agree to indemnify
              and hold harmless the Agency, its owners, employees, and agents from
              any claim arising out of your acts or omissions or your breach of these
              Terms.
            </p>
          </Section>

          <Section n="10" title="Force Majeure">
            <p>
              The Agency is not responsible for any failure or delay caused by events
              beyond its reasonable control, including weather, natural disasters,
              government action, public-health events, port closures, mechanical
              issues, strikes, or Supplier itinerary changes or cancellations.
            </p>
          </Section>

          <Section n="11" title="Electronic Communications & Signatures">
            <p>
              You consent to receive communications and disclosures electronically
              and agree that electronic signatures, acceptances, and records satisfy
              any legal requirement that such communications be in writing. Records
              of your acceptance (including name, date, time, version, and IP
              address) may be retained as evidence of agreement.
            </p>
          </Section>

          <Section n="12" title="Governing Law & Dispute Resolution">
            <p>
              These Terms are governed by the laws of the State of Texas, without
              regard to conflict-of-law principles. Subject to any controlling forum
              or arbitration provision in the applicable cruise line&apos;s
              ticket/passage contract, you agree that the exclusive venue for any
              dispute with the Agency shall be the state or federal courts located in
              Galveston County, Texas, and you consent to personal jurisdiction
              there. The prevailing party in any action to enforce these Terms shall
              be entitled to recover its reasonable attorneys&apos; fees and costs.
            </p>
          </Section>

          <Section n="13" title="Severability & Entire Agreement">
            <p>
              If any provision of these Terms is held unenforceable, the remaining
              provisions remain in full force. These Terms, together with your
              booking confirmation, the Cruise Booking Agreement, and the applicable
              cruise line ticket/passage contract, constitute the entire agreement
              between you and the Agency and supersede all prior understandings.
            </p>
          </Section>

          {/* Cruise line ticket contracts */}
          <section className="mt-10 pt-6 border-t border-white/10">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-2">
              CRUISE LINE TICKET / PASSAGE CONTRACTS
            </h2>
            <p className="text-sm text-white/65 mb-4">
              Your sailing is also governed by the ticket or passage contract of the
              operating cruise line, which is a separate, binding agreement between
              you and that cruise line and controls in the event of any conflict. The
              controlling document is the version the cruise line issues with your
              booking. Each cruise line&apos;s contract is linked below:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {CRUISE_LINE_CONTRACTS.map((c) => (
                <a
                  key={c.line}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-[#05070d] border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 hover:border-white/25 transition-colors"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{c.line}</div>
                    <div className="text-white/45 text-xs">{c.label}</div>
                  </div>
                  <span className="text-sky-400/80">↗</span>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-10 pt-6 border-t border-white/10 text-sm text-white/55">
            <p>
              Questions about these Terms? Contact us at{" "}
              <a
                href="mailto:cruisesfromgalveston.texas@gmail.com"
                className="text-sky-400/80 hover:text-white underline"
              >
                cruisesfromgalveston.texas@gmail.com
              </a>{" "}
              or visit the Cruise Experience Center at 3501 Winnie, Galveston, TX
              77550.
            </p>
            <p className="mt-3">
              See also our{" "}
              <Link href="/cancellation-policy" className="text-sky-400/80 hover:text-white underline">
                Cancellation Policy
              </Link>{" "}
              and{" "}
              <Link href="/legal" className="text-sky-400/80 hover:text-white underline">
                Legal Notice
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
