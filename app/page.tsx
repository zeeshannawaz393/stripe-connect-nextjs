import React from "react";
import PaymentSection from "@/components/PaymentSection";

export const metadata = {
  title: "Luxe Salon | Secure Booking",
  description: "Book your premium salon appointment securely with Luxe Salon.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-gray-900 font-serif font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 tracking-wide font-bold">Luxe Salon</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-600/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Secure Environment
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Left Column - Booking Summary (Server Rendered) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 sticky top-28 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-yellow-500 font-serif border-b border-gray-700/50 pb-4">Booking Summary</h2>

              {/* Service Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-yellow-500/20 shadow-inner">
                    <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight mb-2 text-white">Premium Haircut</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Consultation, wash, cut & style.</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/10">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      60 mins
                    </div>
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex items-start gap-4 text-sm group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700/80 transition-colors">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Date & Time</div>
                      <div className="font-medium text-base text-gray-200">Today, 3:00 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-sm group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700/80 transition-colors">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Stylist</div>
                      <div className="font-medium text-base text-gray-200">Sarah Johnson</div>
                      <div className="text-xs text-yellow-500 font-medium mt-0.5">Senior Stylist</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-900/40 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-gray-700/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Service Total</span>
                    <span className="font-medium text-gray-300">£5.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Taxes & Fees</span>
                    <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded">INCLUDED</span>
                  </div>
                  <div className="h-px bg-gray-700/50 my-2"></div>
                  <div className="flex justify-between items-baseline font-bold text-lg text-white">
                    <span>Total Pay</span>
                    <div className="text-right">
                      <span className="text-2xl text-yellow-500">£5.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Client Side Payment Section */}
          <div className="lg:col-span-2">
            <PaymentSection />
          </div>
        </div>
      </main>
    </div>
  );
}
