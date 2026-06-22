"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            ⚓ Galveston Cruise Specialists
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Ready to set sail from Galveston? Fill out the form below and a
            cruise specialist will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-extrabold text-blue-900 mb-6">
              Request a Free Quote
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚢</div>
                <h3 className="text-2xl font-extrabold text-blue-900 mb-2">
                  Thanks! We&apos;ll be in touch.
                </h3>
                <p className="text-gray-500">
                  A cruise specialist will contact you within 24 hours with
                  cruise options departing from Galveston.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Smith"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(713) 555-0000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Number of Guests *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Trip Length
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Any length</option>
                      <option>3–4 nights (Short)</option>
                      <option>5–7 nights (Week)</option>
                      <option>8+ nights (Extended)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Preferred Destination
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">No preference</option>
                    <option>Caribbean (Cozumel, Roatán, Belize)</option>
                    <option>Bahamas (Nassau, CocoCay)</option>
                    <option>Mexico (Cozumel, Progreso)</option>
                    <option>Eastern Caribbean</option>
                    <option>Western Caribbean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Estimated Travel Date
                  </label>
                  <input
                    type="month"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Celebrating a birthday? Need accessible cabins? Let us know..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 rounded-full text-lg transition-all shadow-lg"
                >
                  Get My Free Quote 🚢
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-blue-900 text-white rounded-2xl p-8">
              <h3 className="text-xl font-extrabold mb-6">Get in Touch</h3>
              <div className="space-y-4 text-blue-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="font-bold text-white">Location</div>
                    <div className="text-sm">Galveston, Texas</div>
                    <div className="text-sm">Near the Port of Galveston</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <div className="font-bold text-white">Phone</div>
                    <div className="text-sm">(409) 555-CRUISE</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="font-bold text-white">Email</div>
                    <div className="text-sm break-all">
                      cruisesfromgalveston.texas@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <div className="font-bold text-white">Hours</div>
                    <div className="text-sm">Mon – Fri: 9am – 6pm CST</div>
                    <div className="text-sm">Sat: 10am – 4pm CST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-extrabold text-blue-900 mb-4">
                Why Book With Us?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "✅ 100% Galveston departures — no flying required",
                  "✅ Free expert consultation with a cruise specialist",
                  "✅ Best price matching on all cruise lines",
                  "✅ All major cruise lines: Carnival, Royal Caribbean, Norwegian & Disney",
                  "✅ Support before, during, and after your cruise",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⚓</span>
                <h3 className="font-extrabold text-red-700">
                  Drive-to-Cruise Advantage
                </h3>
              </div>
              <p className="text-red-600 text-sm">
                Houston is just ~50 miles from Galveston. Drive to the port,
                park your car, and sail away — no airports, no delays, no
                stress. We&apos;ll help you make the most of it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
