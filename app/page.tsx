"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

// Initialize Stripe without the connected account first
// We will re-initialize it once we get the connectedAccountId from the backend
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function Home() {
  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [mode, setMode] = useState<"pay_now" | "reserve" | "save_card">("pay_now");
  const [saveCard, setSaveCard] = useState(false);

  // 1. Fetch Client Secret when Mode Changes
  const fetchSecret = async (selectedMode: string, isSaveCardChecked: boolean) => {
    let endpoint = "/create-payment-intent";
    let body: any = { amount: 500, currency: "gbp", saveCard: isSaveCardChecked };

    if (selectedMode === "reserve") {
      endpoint = "/create-setup-intent";
      body = {};
    } else if (selectedMode === "save_card") {
      endpoint = "/create-customer-setup-intent";
      body = {};
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setClientSecret(data.clientSecret);

      // Initialize Stripe with the connected account ID from the backend
      if (data.connectedAccountId) {
        setStripePromise(loadStripe(stripePublishableKey, {
          stripeAccount: data.connectedAccountId
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching secret:", error);
      console.error("Endpoint:", `${API_BASE_URL}${endpoint}`);
      console.error("Body:", body);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSecret("pay_now", false);
  }, []);

  // Handle Radio Change
  const handleModeChange = (newMode: "pay_now" | "reserve" | "save_card") => {
    setMode(newMode);
    setClientSecret(""); // Clear old secret while loading
    fetchSecret(newMode, saveCard);
  };

  // Handle Checkbox Change
  const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSaveCard(checked);
    if (mode === "pay_now") {
      setClientSecret("");
      fetchSecret("pay_now", checked);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-yellow-500">Luxe Salon</h1>
          <div className="text-sm text-gray-400">Secure Checkout</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-yellow-500">Booking Summary</h2>

              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Premium Haircut & Styling</h3>
                    <p className="text-sm text-gray-400">60 minutes</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-gray-400">Date & Time</div>
                      <div className="font-medium">Today, 3:00 PM</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div className="text-gray-400">Stylist</div>
                      <div className="font-medium">Sarah Johnson</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service</span>
                  <span>£5.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-yellow-500">£5.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Options */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Payment Options</h2>

              {/* Payment Mode Selector */}
              <div className="space-y-3 mb-8">
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'pay_now' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="mode"
                      className="w-5 h-5 text-yellow-500"
                      checked={mode === 'pay_now'}
                      onChange={() => handleModeChange('pay_now')}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">Pay Full Amount</div>
                      <div className="text-sm text-gray-400">Secure your booking with payment now</div>
                    </div>
                    <div className="text-yellow-500 font-bold text-xl">£5.00</div>
                  </div>

                  {mode === 'pay_now' && (
                    <div className="ml-9 mt-3 pt-3 border-t border-gray-700">
                      <label className="flex items-center text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 rounded"
                          checked={saveCard}
                          onChange={handleSaveCardChange}
                        />
                        Save card for future bookings
                      </label>
                    </div>
                  )}
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'reserve' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="mode"
                      className="w-5 h-5 text-yellow-500"
                      checked={mode === 'reserve'}
                      onChange={() => handleModeChange('reserve')}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">Reserve Slot</div>
                      <div className="text-sm text-gray-400">Hold your appointment, pay later</div>
                    </div>
                    <div className="text-gray-400 font-bold text-xl">£0</div>
                  </div>
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'save_card' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="mode"
                      className="w-5 h-5 text-yellow-500"
                      checked={mode === 'save_card'}
                      onChange={() => handleModeChange('save_card')}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">Save Card Only</div>
                      <div className="text-sm text-gray-400">Save payment method for future use</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Stripe Payment Form */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                {clientSecret && stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#d4af37',
                          colorBackground: '#111827',
                          colorText: '#ffffff',
                          colorDanger: '#ef4444',
                          borderRadius: '8px'
                        }
                      },
                      wallets: {
                        applePay: 'auto',
                        googlePay: 'auto'
                      }
                    } as any}
                  >
                    <PaymentForm mode={mode} />
                  </Elements>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
                    <div className="text-gray-400">Loading payment details...</div>
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secured by Stripe • Your payment information is encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
